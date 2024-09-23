package bizworks.backend.services;

import bizworks.backend.configs.Util.GeoToolsDistanceCalculator;
import bizworks.backend.dtos.*;
import bizworks.backend.models.*;
import bizworks.backend.repositories.AttendanceRepository;
import bizworks.backend.services.humanresources.ViolationService;
import bizworks.backend.services.humanresources.ViolationTypeService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeService employeeService;
    private final OvertimeService overtimeService;
    private final MailService mailService;
    private final FaceRecognitionService faceRecognitionService;
    private final MissedCheckOutHandlingService missedCheckOutHandlingService;
    private final ViolationTypeService violationTypeService;
    private final ViolationService violationService;

    // Địa điểm yêu cầu chấm công
    private static final double REQUIRED_LATITUDE = 11.879387995504702; // Vĩ độ
    private static final double REQUIRED_LONGITUDE =  108.55061899971506; // Kinh độ
    private static final double ACCEPTABLE_RADIUS = 5000; // Bán kính chấp nhận tính bằng mét

    public void checkLocation(double latitude, double longitude){
        double distance = GeoToolsDistanceCalculator.calculateDistance(
                REQUIRED_LATITUDE, REQUIRED_LONGITUDE,
                latitude, longitude
        );
        if(distance >= ACCEPTABLE_RADIUS){
            throw new RuntimeException("We cannot confirm your attendance as you are not at the required location. Please move to the correct area and try again.");
        }
    }

    public Attendance save(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> findAll() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendancesByEmployeeEmail() {
        String email = getCurrentUserEmail();
        return attendanceRepository.findByEmployeeEmail(email);
    }

    public List<Attendance> getAttendancesByAttendanceDate() {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByAttendanceDateWithEmployee(today);
    }

    public Attendance findById(Long id) {
        return attendanceRepository.findById(id).orElseThrow();
    }

    public Attendance getByEmailAndDate() {
        String email = getCurrentUserEmail();
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByEmployeeEmailAndAttendanceDate(email, today);
    }

    public Attendance getAttendanceByEmployeeEmailAndDate(LocalDate attendanceDate) {
        String email = getCurrentUserEmail();
        return attendanceRepository.findByEmployeeEmailAndAttendanceDate(email, attendanceDate);
    }

    public List<Attendance> getAttendancesForMonth(int month, int year) {
        String email = getCurrentUserEmail();
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        return attendanceRepository.findByEmployeeEmailAndAttendanceDateBetween(email, startOfMonth, endOfMonth);
    }

    public List<Attendance> getAttendancesFromStartOfMonth(String email) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        return attendanceRepository.findByEmployeeEmailAndAttendanceDateBetween(email, startOfMonth, today);
    }

    public AttendanceReportDTO getTotalWorkAndOvertime(LocalDate inputDate) {
        String email = getCurrentUserEmail();
        List<Attendance> attendances = attendanceRepository.findByEmployeeEmail(email);

        // Tổng giờ làm việc trong tuần tính đến ngày inputDate
        LocalDate startOfWeek = inputDate.with(java.time.DayOfWeek.MONDAY);
        Duration totalWorkTimeInWeek = Duration.ZERO;

        for (Attendance attendance : attendances) {
            if (!attendance.getAttendanceDate().isBefore(startOfWeek)
                    && !attendance.getAttendanceDate().isAfter(inputDate)
                    && "Present".equals(attendance.getStatus())) {
                totalWorkTimeInWeek = totalWorkTimeInWeek
                        .plusHours(attendance.getOfficeHours().getHour())
                        .plusMinutes(attendance.getOfficeHours().getMinute());
            }
        }

        // Tổng giờ làm việc trong tháng tính đến ngày inputDate
        LocalDate startOfMonth = inputDate.withDayOfMonth(1);
        Duration totalWorkTimeInMonth = Duration.ZERO;
        Duration totalOvertimeInMonth = Duration.ZERO;

        for (Attendance attendance : attendances) {
            if (!attendance.getAttendanceDate().isBefore(startOfMonth)
                    && !attendance.getAttendanceDate().isAfter(inputDate)
                    && "Present".equals(attendance.getStatus())) {
                totalWorkTimeInMonth = totalWorkTimeInMonth
                        .plusHours(attendance.getOfficeHours().getHour())
                        .plusMinutes(attendance.getOfficeHours().getMinute());
                totalOvertimeInMonth = totalOvertimeInMonth
                        .plusHours(attendance.getOvertime().getHour())
                        .plusMinutes(attendance.getOvertime().getMinute());
            }
        }

        return new AttendanceReportDTO(
                formatDuration(totalWorkTimeInWeek),
                formatDuration(totalWorkTimeInMonth),
                formatDuration(totalOvertimeInMonth)
        );
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        return String.format("%02d:%02d", hours, minutes);
    }

    public Attendance checkIn(MultipartFile faceImage) throws IOException {
        String email = getCurrentUserEmail();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime startCheckInTime = currentDateTime.with(LocalTime.of(7, 55));
        LocalDateTime endCheckInTime = currentDateTime.with(LocalTime.of(8, 5));

        if (currentDateTime.isBefore(startCheckInTime)) {
            throw new RuntimeException("You cannot check in at this time. Allowed time is between 7:55 and 8:05.");
        } else {
            boolean verifyFace = faceRecognitionService.verifyEmployeeFace(email, faceImage);
            if (verifyFace) {
                LocalDate today = LocalDate.now();
                Attendance existingAttendance = getAttendanceByEmployeeEmailAndDate(today);
                if (existingAttendance != null) {
                    throw new RuntimeException("You have already checked in today");
                } else {
                    LocalDateTime checkInTime;
                    Employee employee = employeeService.findByEmail(email);

                    if (currentDateTime.isAfter(endCheckInTime)) {
                        // Handle late arrival
                        checkInTime = currentDateTime;

                        // Create violation
                        ViolationDTO violationDTO = new ViolationDTO();
                        violationDTO.setEmployee(new EmployeeDTO(employee.getId()));
                        ViolationType violationType = violationTypeService.findById(1L);
                        violationDTO.setViolationType(ViolationTypeDTO.from(violationType));
                        violationDTO.setViolationDate(LocalDate.now());
                        violationDTO.setDescription("You were late today and checkIn in late at: " + checkInTime.toLocalTime());
                        violationDTO.setStatus("Pending");

                        violationService.createViolation(violationDTO);
                    } else {
                        checkInTime = currentDateTime.with(LocalTime.of(8, 0));
                    }

                    // Create attendance record
                    Attendance attendance = new Attendance();
                    attendance.setCheckInTime(checkInTime);
                    attendance.setAttendanceDate(today);
                    attendance.setStatus("In Progress");
                    attendance.setEmployee(employee);
                    return save(attendance);
                }
            } else {
                throw new RuntimeException("Invalid face authentication.");
            }
        }
    }

    public Attendance checkOut(MultipartFile faceImage) throws IOException, MessagingException {
        String email = getCurrentUserEmail();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime startCheckOutTime = currentDateTime.with(LocalTime.of(16, 55));
        if (currentDateTime.isBefore(startCheckOutTime)) {
            throw new RuntimeException("You cannot check out at this time. The allowed time is from 16:55 onwards.");
        } else {
            boolean verifyFace = faceRecognitionService.verifyEmployeeFace(email, faceImage);
            if (verifyFace) {
                LocalDate attendanceDate = LocalDate.now();

                LocalDateTime breakTimeStart;
                LocalDateTime breakTimeEnd;
                LocalDateTime checkOutTime;

                Attendance attendance = getAttendanceByEmployeeEmailAndDate(attendanceDate);
                Overtime overtime = overtimeService.findByAttendanceIdAndStatus(attendance.getId(), "Approved");
                if (overtime != null) {
                    LocalDateTime startCheckOutWithOvertime = overtime.getCheckOutTime().minusMinutes(5);
                    if (currentDateTime.isBefore(startCheckOutWithOvertime)) {
                        breakTimeStart = currentDateTime.with(LocalTime.of(12, 0));
                        breakTimeEnd = currentDateTime.with(LocalTime.of(13, 0));
                        checkOutTime = currentDateTime;
                    } else {
                        breakTimeStart = currentDateTime.with(LocalTime.of(12, 0));
                        breakTimeEnd = currentDateTime.with(LocalTime.of(13, 0));
                        checkOutTime = overtime.getCheckOutTime();
                    }
                } else {
                    breakTimeStart = currentDateTime.with(LocalTime.of(12, 0));
                    breakTimeEnd = currentDateTime.with(LocalTime.of(13, 0));
                    checkOutTime = currentDateTime.with(LocalTime.of(17, 0));
                }

                attendance.setBreakTimeStart(breakTimeStart);
                attendance.setBreakTimeEnd(breakTimeEnd);
                attendance.setCheckOutTime(checkOutTime);
                attendance.setStatus("Present");

                // Tính tổng thời gian làm việc
                LocalDateTime checkInTime = attendance.getCheckInTime();

                if (checkInTime == null || checkOutTime == null) {
                    throw new RuntimeException("Check-in or check-out time is missing.");
                }

                Duration breakDuration = Duration.ZERO;
                if (breakTimeStart != null && breakTimeEnd != null) {
                    breakDuration = Duration.between(breakTimeStart, breakTimeEnd);
                }

                Duration workedDuration = Duration.between(checkInTime, checkOutTime);
                Duration actualWorkedDuration = workedDuration.minus(breakDuration);

                // Tính thời gian overtime
                long overtimeMinutes = 0;
                if (overtime != null && overtime.getType().equals("noon_overtime")) {
                    attendance.setOvertime(LocalTime.of(1, 0));  // 1 giờ làm thêm vào buổi trưa
                    overtimeMinutes = 60; // 1 giờ = 60 phút
                } else {
                    overtimeMinutes = Math.max(0, actualWorkedDuration.toMinutes() - 480); // Trừ đi 8 giờ chuẩn
                    attendance.setOvertime(LocalTime.of(
                            (int) overtimeMinutes / 60,
                            (int) overtimeMinutes % 60
                    ));
                }

                // Tính office hours
                long actualWorkedMinutes = actualWorkedDuration.toMinutes();
                if(overtime != null &&overtime.getType().equals("noon_overtime")){
                    attendance.setOfficeHours(LocalTime.of(
                            (int) actualWorkedMinutes / 60,
                            (int) actualWorkedMinutes % 60
                    ));
                }else{
                    long officeHoursMinutes = actualWorkedMinutes - overtimeMinutes;
                    attendance.setOfficeHours(LocalTime.of(
                            (int) officeHoursMinutes / 60,
                            (int) officeHoursMinutes % 60
                    ));
                }

                // Set tổng thời gian
                long totalTime = workedDuration.toMinutes();
                attendance.setTotalTime(LocalTime.of(
                        (int) totalTime / 60,
                        (int) totalTime % 60
                ));

                Attendance savedAttendance = save(attendance);

                // Tạo và gửi nội dung email
                String emailContent = generateEmailContent(savedAttendance);
                mailService.sendEmail(email, "Attendance Checkout Notification", emailContent);

                return savedAttendance;
            } else {
                throw new RuntimeException("Invalid face authentication.");
            }
        }
    }

    @Transactional
    @Scheduled(cron = "0 0 20 * * ?")
    public List<Attendance> markAbsentEmployees() throws MessagingException {
        LocalDate today = LocalDate.now();
        List<Employee> allEmployees = employeeService.findAll();
        List<Attendance> todaysAttendances = attendanceRepository.findByAttendanceDateWithEmployee(today);

        List<Employee> employeesCheckedInButNotOut = todaysAttendances.stream()
                .filter(attendance -> attendance.getCheckInTime() != null && attendance.getCheckOutTime() == null)
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());

        for (Employee employee : employeesCheckedInButNotOut) {
            missedCheckOutHandlingService.createRequest(employee.getEmail());
            mailService.sendEmail(employee.getEmail(), "Reminder: Not checked out", sendForgotCheckOutReminder(employee.getEmpCode(), employee.getFullname()));
        }

        List<Employee> checkedInEmployees = todaysAttendances.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());

        List<Employee> absentEmployees = allEmployees.stream()
                .filter(employee -> !checkedInEmployees.contains(employee))
                .collect(Collectors.toList());
        List<Attendance> absentAttendances = new ArrayList<>();
        for (Employee absentEmployee : absentEmployees) {
            Attendance attendance = new Attendance();
            attendance.setAttendanceDate(today);
            attendance.setStatus("Absent");
            attendance.setEmployee(absentEmployee);
            Attendance savedAttendance = save(attendance);
            absentAttendances.add(savedAttendance);
            mailService.sendEmail(savedAttendance.getEmployee().getEmail(), "Reminder for absenteeism", sendAbsent(savedAttendance.getEmployee().getEmpCode() ,savedAttendance.getEmployee().getFullname(), savedAttendance.getAttendanceDate()));
        }
        return absentAttendances;
    }


    public AttendanceSummaryDTO getAttendanceSummary() {
        LocalDate today = LocalDate.now();
        List<Employee> allEmployees = employeeService.findAll();
        List<Attendance> todayAttendancesPresent = attendanceRepository.findByAttendanceDateAndStatus(today, "Present");
        List<Attendance> todayAttendancesAbsent = attendanceRepository.findByAttendanceDateAndStatus(today, "Absent");

        int totalEmployees = allEmployees.size();
        List<Employee> checkedInEmployees = todayAttendancesPresent.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());
        int checkedInCount = checkedInEmployees.size();
        List<Employee> absentEmployees = todayAttendancesAbsent.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());
        int absentCount = absentEmployees.size();
        int remaining = (int) allEmployees.stream()
                .filter(employee -> !checkedInEmployees.contains(employee))
                .count();

        return new AttendanceSummaryDTO(totalEmployees, checkedInCount, absentCount, remaining);
    }

    public AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO attendanceDTO = new AttendanceDTO();
        attendanceDTO.setId(attendance.getId());
        attendanceDTO.setCheckInTime(attendance.getCheckInTime());
        attendanceDTO.setBreakTimeStart(attendance.getBreakTimeStart());
        attendanceDTO.setBreakTimeEnd(attendance.getBreakTimeEnd());
        attendanceDTO.setCheckOutTime(attendance.getCheckOutTime());
        attendanceDTO.setAttendanceDate(attendance.getAttendanceDate());
        attendanceDTO.setTotalTime(attendance.getTotalTime());
        attendanceDTO.setOfficeHours(attendance.getOfficeHours());
        attendanceDTO.setOvertime(attendance.getOvertime());
        attendanceDTO.setStatus(attendance.getStatus());
        attendanceDTO.setEmployee(convertToEmployeeDTO(attendance.getEmployee()));
        if (attendance.getAttendanceComplaint() == null) {
            attendanceDTO.setAttendanceComplaintId(null);
        } else {
            attendanceDTO.setAttendanceComplaintId(attendance.getAttendanceComplaint().getId());
        }
        if(attendance.getOverTimes() == null){
            attendanceDTO.setOvertimeDTO(null);
        }else{
            attendanceDTO.setOvertimeDTO(convertToOvertimeDTO(attendance.getOverTimes()));
        }
        return attendanceDTO;
    }

    private OvertimeResponseDTO convertToOvertimeDTO(Overtime overtime) {
        OvertimeResponseDTO overtimeDTO = new OvertimeResponseDTO();
        overtimeDTO.setId(overtime.getId());
        overtimeDTO.setOvertimeStart(overtime.getOvertimeStart());
        overtimeDTO.setOvertimeEnd(overtime.getOvertimeEnd());
        overtimeDTO.setTotalTime(overtime.getTotalTime());
        overtimeDTO.setCheckOutTime(overtime.getCheckOutTime());
        overtimeDTO.setType(overtime.getType());
        overtimeDTO.setStatus(overtime.getStatus());
        overtimeDTO.setReason(overtime.getReason());
        overtimeDTO.setDescription(overtime.getDescription());
        overtimeDTO.setCensor(convertToUserDTO(overtime.getCensor()));
        overtimeDTO.setCreatedAt(overtime.getCreatedAt());
        if(overtime.getUpdatedAt() == null){
            overtimeDTO.setUpdatedAt(null);
        }else{
            overtimeDTO.setUpdatedAt(overtime.getUpdatedAt());
        }
        return overtimeDTO;
    }

    private UserResponseDTO convertToUserDTO(User user){
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setEmployee(convertToEmployeeDTO(user.getEmployee()));
        return userResponseDTO;
    }

    private EmployeeResponseDTO convertToEmployeeDTO(Employee employee) {
        EmployeeResponseDTO employeeDTO = new EmployeeResponseDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setEmpCode(employee.getEmpCode());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setGender(employee.getGender());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setPosition(employee.getPosition().getPositionName());
        employeeDTO.setDepartment(employee.getDepartment().getName());
        return employeeDTO;
    }

    private String generateEmailContent(Attendance attendance) {
        DateTimeFormatter timeFormatterAMPM = DateTimeFormatter.ofPattern("hh:mm a");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm");
        LocalDateTime breakTimeStart = attendance.getBreakTimeStart();
        LocalDateTime breakTimeEnd = attendance.getBreakTimeEnd();
        LocalTime overtime = attendance.getOvertime();

        LocalTime breakStartLocalTime = breakTimeStart != null ? breakTimeStart.toLocalTime() : null;
        LocalTime breakEndLocalTime = breakTimeEnd != null ? breakTimeEnd.toLocalTime() : null;

        // Tính toán thời gian nghỉ giải lao
        Duration breakDuration = (breakStartLocalTime != null && breakEndLocalTime != null)
                ? Duration.between(breakStartLocalTime, breakEndLocalTime)
                : Duration.ZERO;
        String breakDurationStr = formatDuration(breakDuration);

        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; margin: 0;'>");
        content.append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>");
        content.append("<div style='background-color: #0056b3; color: #ffffff; padding: 20px 30px; text-align: center;'>");
        content.append("<h2 style='margin: 0; font-size: 24px;'>Attendance Checkout Details</h2>");
        content.append("</div>");
        content.append("<div style='padding: 30px; color: #333333;'>");
        content.append("<p style='font-size: 18px;'>Dear ").append(attendance.getEmployee().getFullname()).append(",</p>");
        content.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
        content.append("<tr style='background-color: #f2f2f2;'><th style='text-align: left;'>Check-in Time</th><td>").append(attendance.getCheckInTime().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr><th style='background-color: #f9f9f9; text-align: left;'>Break Time Start</th><td>").append(attendance.getBreakTimeStart().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr style='background-color: #f9f9f9;'><th style='text-align: left;'>Break Time End</th><td>").append(attendance.getBreakTimeEnd().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr><th style='background-color: #f9f9f9; text-align: left;'>Check-out Time</th><td>").append(attendance.getCheckOutTime().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr style='background-color: #f2f2f2;'><th style='text-align: left;'>Break Time</th><td>").append(breakDurationStr).append("</td></tr>");
        content.append("<tr><th style='background-color: #f2f2f2; text-align: left;'>Total Time</th><td>").append(attendance.getTotalTime().format(timeFormatter)).append("</td></tr>");
        content.append("<tr><th style='background-color: #f2f2f2; text-align: left;'>Total Office Time</th><td>").append(attendance.getOfficeHours().format(timeFormatter)).append("</td></tr>");
        if (overtime != null && !overtime.equals(LocalTime.of(0, 0, 0))) {
            content.append("<tr style='background-color: #f9f9f9;'>")
                    .append("<th style='text-align: left;'>Overtime</th>")
                    .append("<td>").append(overtime.format(timeFormatter)).append("</td>")
                    .append("</tr>");
        }
        content.append("<tr style='background-color: #f2f2f2;'><th style='text-align: left;'>Status</th><td>").append(attendance.getStatus()).append("</td></tr>");
        content.append("</table>");
        content.append("</div>");
        content.append("<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>");
        content.append("<p style='margin: 0;'>Best regards,<br><span style='font-weight: bold;'>BizWorks</span></p>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }

    private String sendAbsent(String empCode, String fullname, LocalDate date) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; margin: 0;'>");
        content.append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>");
        content.append("<div style='background-color: #d9534f; color: #ffffff; padding: 20px 30px; text-align: center;'>");
        content.append("<h2 style='margin: 0; font-size: 24px;'>Reminder for Absenteeism</h2>");
        content.append("</div>");
        content.append("<div style='padding: 30px; color: #333333;'>");
        content.append("<p style='font-size: 18px;'>Dear ").append(empCode).append("-").append(fullname).append(",</p>");
        content.append("<p style='font-size: 16px; line-height: 1.5;'>The management office informs you that you were absent without permission today (").append(date).append("). Please pay more attention to your work schedule and attend work regularly.</p>");
        content.append("</div>");
        content.append("<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>");
        content.append("<p style='margin: 0;'>Best regards,<br><span style='font-weight: bold;'>BizWorks</span></p>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }

    private String sendForgotCheckOutReminder(String empCode, String fullname) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; margin: 0;'>");
        content.append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>");
        content.append("<div style='background-color: #5bc0de; color: #ffffff; padding: 20px 30px; text-align: center;'>");
        content.append("<h2 style='margin: 0; font-size: 24px;'>Reminder: Please Check-Out</h2>");
        content.append("</div>");
        content.append("<div style='padding: 30px; color: #333333;'>");
        content.append("<p style='font-size: 18px;'>Dear ").append(empCode).append(" - ").append(fullname).append(",</p>");
        content.append("<p style='font-size: 16px; line-height: 1.5;'>We noticed that you have not checked out today (").append(LocalDate.now()).append("). Please remember to check out before leaving to ensure that your work hours are accurately recorded.</p>");
        content.append("<p style='font-size: 16px; line-height: 1.5;'>If you have already left, please contact the HR department to resolve this issue.</p>");
        content.append("</div>");
        content.append("<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>");
        content.append("<p style='margin: 0;'>Best regards,<br><span style='font-weight: bold;'>BizWorks</span></p>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
