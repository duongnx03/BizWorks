package bizworks.backend.services;

import bizworks.backend.dtos.*;
import bizworks.backend.models.*;
import bizworks.backend.repositories.AttendanceRepository;
import bizworks.backend.repositories.MissedCheckOutHandlingRepository;
import bizworks.backend.repositories.OvertimeRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MissedCheckOutHandlingService {
    private final MissedCheckOutHandlingRepository missedCheckOutHandlingRepository;
    private final AttendanceRepository attendanceRepository;
    private final OvertimeRepository overtimeRepository;
    private final MailService mailService;

    public void createRequest(String email) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeEmailAndAttendanceDate(email, today);
        MissedCheckOutHandling missedCheckOutHandling = new MissedCheckOutHandling();
        missedCheckOutHandling.setDescription("Check and update the case of forgetting to check out");
        missedCheckOutHandling.setStatus("Pending");
        missedCheckOutHandling.setAttendance(attendance);
        missedCheckOutHandlingRepository.save(missedCheckOutHandling);
    }

    public void approve(Long id, LocalDateTime checkOutTime) throws MessagingException {
        MissedCheckOutHandling missedCheckOutHandling = missedCheckOutHandlingRepository.findById(id).orElseThrow();
        missedCheckOutHandling.setStatus("Approved");
        missedCheckOutHandlingRepository.save(missedCheckOutHandling);

        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime breakTimeStart = currentDateTime.with(LocalTime.of(12, 0));
        LocalDateTime breakTimeEnd = currentDateTime.with(LocalTime.of(13, 0));

        Attendance attendance = attendanceRepository.findByEmployeeEmailAndAttendanceDate(missedCheckOutHandling.getAttendance().getEmployee().getEmail(), missedCheckOutHandling.getAttendance().getAttendanceDate());
        Overtime overtime = overtimeRepository.findOvertimeByAttendanceIdAndStatus(attendance.getId(), "Approved");

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
        if (overtime != null && overtime.getType().equals("noon_overtime")) {
            attendance.setOfficeHours(LocalTime.of(
                    (int) actualWorkedMinutes / 60,
                    (int) actualWorkedMinutes % 60
            ));
        } else {
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

        Attendance saveAttendance = attendanceRepository.save(attendance);
        mailService.sendEmail(attendance.getEmployee().getEmail(), "Reminder for forgetting to check out!", generateEmailContent(saveAttendance));
    }

    public List<MissedCheckOutHandlingDTO> findAll() {
        List<MissedCheckOutHandling> missedCheckOutHandlings = missedCheckOutHandlingRepository.findAll();
        return missedCheckOutHandlings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<MissedCheckOutHandlingDTO> findByEmail() {
        String email = getCurrentUserEmail();
        List<MissedCheckOutHandling> missedCheckOutHandlings = missedCheckOutHandlingRepository.findMissedCheckOutHandlingByAttendanceEmployeeEmail(email);
        return missedCheckOutHandlings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public MissedCheckOutHandlingDTO convertToDTO(MissedCheckOutHandling missedCheckOutHandling) {
        MissedCheckOutHandlingDTO missedCheckOutHandlingDTO = new MissedCheckOutHandlingDTO();
        missedCheckOutHandlingDTO.setId(missedCheckOutHandling.getId());
        missedCheckOutHandlingDTO.setDescription(missedCheckOutHandling.getDescription());
        missedCheckOutHandlingDTO.setStatus(missedCheckOutHandling.getStatus());
        missedCheckOutHandlingDTO.setAttendanceDTO(convertToAttendanceDTO(missedCheckOutHandling.getAttendance()));
        return missedCheckOutHandlingDTO;
    }

    private AttendanceDTO convertToAttendanceDTO(Attendance attendance) {
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
        attendanceDTO.setOvertimeDTO(attendance.getOverTimes() != null ? convertToOvertimeDTO(attendance.getOverTimes()) : null);
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
        if (overtime.getUpdatedAt() == null) {
            overtimeDTO.setUpdatedAt(null);
        } else {
            overtimeDTO.setUpdatedAt(overtime.getUpdatedAt());
        }
        return overtimeDTO;
    }

    private UserResponseDTO convertToUserDTO(User user) {
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

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
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
        content.append("<p style='font-size: 16px;'>It seems that you forgot to check out today. Please review your attendance details below and update your check-out time if needed:</p>");
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
        content.append("<p style='font-size: 16px; margin-top: 20px;'>If you have any questions or need further assistance, please contact the HR department.</p>");
        content.append("</div>");
        content.append("<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>");
        content.append("<p style='margin: 0;'>Best regards,<br><span style='font-weight: bold;'>BizWorks</span></p>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        return String.format("%02d:%02d", hours, minutes);
    }
}
