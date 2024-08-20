package bizworks.backend.services;

import bizworks.backend.dtos.AttendanceReportDTO;
import bizworks.backend.dtos.AttendanceDTO;
import bizworks.backend.dtos.AttendanceSummaryDTO;
import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.models.Attendance;
import bizworks.backend.models.Employee;
import bizworks.backend.repository.AttendanceRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private MailService mailService;

    public Attendance save(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> findAll() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendancesByEmployeeEmail(String email) {
        return attendanceRepository.findByEmployeeEmail(email);
    }

    public List<Attendance> getAttendancesByAttendanceDate() {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByAttendanceDate(today);
    }

    public Attendance getByEmailAndDate(String email){
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByEmployeeEmailAndAttendanceDate(email, today);
    }

    public Attendance getAttendanceByEmployeeEmailAndDate(String email, LocalDate attendanceDate) {
        return attendanceRepository.findByEmployeeEmailAndAttendanceDate(email, attendanceDate);
    }

    public List<Attendance> getAttendancesForMonth(String email, int month, int year) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        return attendanceRepository.findByEmployeeEmailAndAttendanceDateBetween(email, startOfMonth, endOfMonth);
    }

    public List<Attendance> getAttendancesFromStartOfMonth(String email) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        return attendanceRepository.findByEmployeeEmailAndAttendanceDateBetween(email, startOfMonth, today);
    }

    public AttendanceReportDTO getTotalWorkAndOvertime(String email, LocalDate inputDate) {
        List<Attendance> attendances = attendanceRepository.findByEmployeeEmail(email);

        // Tổng giờ làm việc trong tuần tính đến ngày inputDate
        LocalDate startOfWeek = inputDate.with(java.time.DayOfWeek.MONDAY);
        Duration totalWorkTimeInWeek = Duration.ZERO;

        for (Attendance attendance : attendances) {
            if (!attendance.getAttendanceDate().isBefore(startOfWeek)
                    && !attendance.getAttendanceDate().isAfter(inputDate)
                    && "Present".equals(attendance.getStatus())) {
                totalWorkTimeInWeek = totalWorkTimeInWeek
                        .plusHours(attendance.getTotalWorkTime().getHour())
                        .plusMinutes(attendance.getTotalWorkTime().getMinute());
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
                        .plusHours(attendance.getTotalWorkTime().getHour())
                        .plusMinutes(attendance.getTotalWorkTime().getMinute());
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

    public Attendance checkIn(String email) {
        LocalDate today = LocalDate.now();
        Attendance existingAttendance = getAttendanceByEmployeeEmailAndDate(email, today);
        if (existingAttendance != null) {
            throw new RuntimeException("You have already checked in today");
        } else {
            Attendance attendance = new Attendance();
            Employee employee = employeeService.findByEmail(email);
            attendance.setCheckInTime(LocalDateTime.now());
            attendance.setBreakTimeStart(null);
            attendance.setBreakTimeEnd(null);
            attendance.setCheckOutTime(null);
            attendance.setAttendanceDate(today);
            attendance.setTotalWorkTime(null);
            attendance.setOvertime(null);
            attendance.setStatus("In Progress");
            attendance.setEmployee(employee);
            return save(attendance);
        }
    }

    public Attendance checkOut(String email) throws MessagingException {
        LocalDate attendanceDate = LocalDate.now();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime breakTimeStart = currentDateTime.with(LocalTime.of(12, 0));
        LocalDateTime breakTimeEnd = currentDateTime.with(LocalTime.of(13, 0));
        Attendance attendance = getAttendanceByEmployeeEmailAndDate(email, attendanceDate);
        LocalDateTime checkOutTime = LocalDateTime.now();
        attendance.setBreakTimeStart(breakTimeStart);
        attendance.setBreakTimeEnd(breakTimeEnd);
        attendance.setCheckOutTime(checkOutTime);
        attendance.setStatus("Present");

        // Calculate the total worked time
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

        // Set total work time
        attendance.setTotalWorkTime(LocalTime.of(
                (int) actualWorkedDuration.toHours(),
                (int) actualWorkedDuration.toMinutes() % 60
        ));

        // Set overtime
        long standardWorkMinutes = 480; // 8 hours in minutes
        long actualWorkedMinutes = actualWorkedDuration.toMinutes();
        if (actualWorkedMinutes > standardWorkMinutes) {
            long overtimeMinutes = actualWorkedMinutes - standardWorkMinutes;
            attendance.setOvertime(LocalTime.of(
                    (int) overtimeMinutes / 60,
                    (int) overtimeMinutes % 60
            ));
        } else {
            attendance.setOvertime(LocalTime.of(0, 0));
        }

        Attendance savedAttendance = save(attendance);

        // Generate and send email content
        String emailContent = generateEmailContent(savedAttendance);
        mailService.sendEmail(email, "Attendance Checkout Notification", emailContent);

        return savedAttendance;
    }


    public List<Attendance> markAbsentEmployees() throws MessagingException {
        LocalDate today = LocalDate.now();
        List<Employee> allEmployees = employeeService.findAll();
        List<Attendance> todaysAttendances = attendanceRepository.findByAttendanceDate(today);

        List<Employee> checkedInEmployees = todaysAttendances.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());

        List<Employee> absentEmployees = allEmployees.stream()
                .filter(employee -> !checkedInEmployees.contains(employee))
                .collect(Collectors.toList());
        List<Attendance> absentAttendances = new ArrayList<>();
        for (Employee absentEmployee : absentEmployees) {
            Attendance attendance = new Attendance();
            attendance.setCheckInTime(null);
            attendance.setBreakTimeStart(null);
            attendance.setBreakTimeEnd(null);
            attendance.setCheckOutTime(null);
            attendance.setTotalWorkTime(null);
            attendance.setOvertime(null);
            attendance.setAttendanceDate(today);
            attendance.setStatus("Absent");
            attendance.setEmployee(absentEmployee);
            Attendance savedAttendance = save(attendance);
            absentAttendances.add(savedAttendance);
            mailService.sendEmail(savedAttendance.getEmployee().getEmail(), "Reminder for absenteeism", sendAbsent(savedAttendance.getEmployee().getFullname(), savedAttendance.getAttendanceDate()));
        }
        return absentAttendances;
    }


    public AttendanceSummaryDTO getAttendanceSummary() {
        LocalDate today = LocalDate.now();
        List<Employee> allEmployees = employeeService.findAll();
        List<Attendance> todaysAttendances = attendanceRepository.findByAttendanceDateAndStatus(today, "Present");

        int totalEmployees = allEmployees.size();
        List<Employee> checkedInEmployees = todaysAttendances.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());
        int checkedInCount = checkedInEmployees.size();
        int absentCount = (int) allEmployees.stream()
                .filter(employee -> !checkedInEmployees.contains(employee))
                .count();

        return new AttendanceSummaryDTO(totalEmployees, checkedInCount, absentCount);
    }

    public AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO attendanceDTO = new AttendanceDTO();
        attendanceDTO.setId(attendance.getId());
        attendanceDTO.setCheckInTime(attendance.getCheckInTime());
        attendanceDTO.setBreakTimeStart(attendance.getBreakTimeStart());
        attendanceDTO.setBreakTimeEnd(attendance.getBreakTimeEnd());
        attendanceDTO.setCheckOutTime(attendance.getCheckOutTime());
        attendanceDTO.setAttendanceDate(attendance.getAttendanceDate());
        attendanceDTO.setTotalWorkTime(attendance.getTotalWorkTime());
        attendanceDTO.setOvertime(attendance.getOvertime());
        attendanceDTO.setStatus(attendance.getStatus());
        attendanceDTO.setEmployee(convertToEmployeeDTO(attendance.getEmployee()));
        return attendanceDTO;
    }

    private EmployeeDTO convertToEmployeeDTO(Employee employee) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setGender(employee.getGender());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setStartDate(employee.getStartDate());
        if(employee.getDepartment() != null || employee.getPosition() != null){
            employeeDTO.setDepartment(employee.getDepartment().getDepartmentName());
            employeeDTO.setPosition(employee.getPosition().getPositionName());
        }else{
            employeeDTO.setDepartment(null);
            employeeDTO.setPosition(null);
        }
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

        // Calculate break time duration
        Duration breakDuration = (breakStartLocalTime != null && breakEndLocalTime != null)
                ? Duration.between(breakStartLocalTime, breakEndLocalTime)
                : Duration.ZERO;
        String breakDurationStr = formatDuration(breakDuration);

        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>");
        content.append("<h3 style='color: #0056b3;'>Attendance Checkout Details</h3>");
        content.append("<p>Dear ").append(attendance.getEmployee().getFullname()).append(",</p>");
        content.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
        content.append("<tr style='background-color: #f2f2f2;'><th style='text-align: left;'>Check-in Time</th><td>").append(attendance.getCheckInTime().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr><th style='background-color: #f9f9f9; text-align: left;'>Break Time Start</th><td>").append(attendance.getBreakTimeStart().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr style='background-color: #f9f9f9;'><th style='text-align: left;'>Break Time End</th><td>").append(attendance.getBreakTimeEnd().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr><th style='background-color: #f9f9f9; text-align: left;'>Check-out Time</th><td>").append(attendance.getCheckOutTime().toLocalTime().format(timeFormatterAMPM)).append("</td></tr>");
        content.append("<tr style='background-color: #f2f2f2;'><th style='text-align: left;'>Break Time</th><td>").append(breakDurationStr).append("</td></tr>");
        content.append("<tr><th style='background-color: #f2f2f2; text-align: left;'>Total Work Time</th><td>").append(attendance.getTotalWorkTime().format(timeFormatter)).append("</td></tr>");
        if (overtime != null && !overtime.equals(LocalTime.of(0, 0, 0))) {
            content.append("<tr style='background-color: #f9f9f9;'>")
                    .append("<th style='text-align: left;'>Overtime</th>")
                    .append("<td>").append(overtime.format(timeFormatter)).append("</td>")
                    .append("</tr>");
        }
        content.append("<tr style='background-color: #f2f2f2;'><th style='text-align: left;'>Status</th><td>").append(attendance.getStatus()).append("</td></tr>");
        content.append("</table>");
        content.append("<p>Best regards,<br><span style='font-weight: bold;'>BizWorks</span></p>");
        content.append("</body></html>");
        return content.toString();
    }

    private String sendAbsent(String fullname, LocalDate date) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>");
        content.append("<h3 style='color: #d9534f;'>Reminder for Absenteeism</h3>");
        content.append("<p>Dear ").append(fullname).append(",</p>");
        content.append("<p>The management office informs you that you were absent without permission today (").append(date).append("). Please pay more attention to your work schedule and attend work regularly.</p>");
        content.append("<p>Best regards,<br><span style='font-weight: bold;'>BizWorks</span></p>");
        content.append("</body></html>");
        return content.toString();
    }

}
