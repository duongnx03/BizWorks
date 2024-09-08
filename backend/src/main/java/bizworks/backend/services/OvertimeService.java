package bizworks.backend.services;

import bizworks.backend.dtos.*;
import bizworks.backend.models.*;
import bizworks.backend.repositories.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OvertimeService {
    private final OvertimeRepository overtimeRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final MailService mailService;
    private final NotificationRepository notificationRepository;

    public void createOvertime(OvertimeRequestDTO overtimeRequestDTO) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Overtime overtime = new Overtime();
        Attendance attendance = attendanceRepository.findById(overtimeRequestDTO.getAttendanceId()).orElseThrow();
        LocalTime overtimeStart;
        LocalTime overtimeEnd;
        LocalTime totalTime;
        LocalDateTime checkOutTime;
        User censor;
        String description;
        LocalDateTime currentDateTime = LocalDateTime.now();
        Notification notification = new Notification();

        switch (user.getRole()) {
            case "EMPLOYEE" -> {
                User leader =  userRepository.findUserByRoleAndEmployeeDepartmentName( "LEADER", user.getEmployee().getDepartment().getName());
                censor = leader;
                description = "Sent, waiting for Leader approval.";
                notification.setMessage("Register for overtime");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(leader);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            case "LEADER" -> {
                User manage = userRepository.findUserByRole("ADMIN");
                censor = manage;
                description = "Sent, waiting for Manage approval.";
                notification.setMessage("Register for overtime");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(manage);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            case "MANAGE" -> {
                User admin = userRepository.findUserByRole("ADMIN");
                censor = admin;
                description = "Sent, waiting for Admin approval.";
                notification.setMessage("Register for overtime");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(admin);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            default -> throw new IllegalStateException("Unexpected value: " + user.getRole());
        }

        switch (overtimeRequestDTO.getType()) {
            case "noon_overtime" -> {
                overtimeStart = LocalTime.of(12, 0);
                overtimeEnd = LocalTime.of(13, 0);
                totalTime = LocalTime.of(1, 0);
                checkOutTime = currentDateTime.with(LocalTime.of(17, 0));
            }
            case "30m_overtime" -> {
                overtimeStart = LocalTime.of(17, 0);
                overtimeEnd = LocalTime.of(17, 30);
                totalTime = LocalTime.of(0, 30);
                checkOutTime = currentDateTime.with(LocalTime.of(17, 30));
            }
            case "1h_overtime" -> {
                overtimeStart = LocalTime.of(17, 0);
                overtimeEnd = LocalTime.of(18, 0);
                totalTime = LocalTime.of(1, 0);
                checkOutTime = currentDateTime.with(LocalTime.of(18, 0));
            }
            case "1h30_overtime" -> {
                overtimeStart = LocalTime.of(17, 0);
                overtimeEnd = LocalTime.of(18, 30);
                totalTime = LocalTime.of(1, 30);
                checkOutTime = currentDateTime.with(LocalTime.of(18, 30));
            }
            case "2h_overtime" -> {
                overtimeStart = LocalTime.of(17, 0);
                overtimeEnd = LocalTime.of(19, 0);
                totalTime = LocalTime.of(2, 0);
                checkOutTime = currentDateTime.with(LocalTime.of(19, 0));
            }
            default -> throw new IllegalArgumentException("Invalid overtime type: " + overtimeRequestDTO.getType());
        }
        overtime.setOvertimeStart(overtimeStart);
        overtime.setOvertimeEnd(overtimeEnd);
        overtime.setTotalTime(totalTime);
        overtime.setCheckOutTime(checkOutTime);
        overtime.setType(overtimeRequestDTO.getType());
        overtime.setStatus("Pending");
        overtime.setReason(overtimeRequestDTO.getReason());
        overtime.setDescription(description);
        overtime.setCensor(censor);
        overtime.setAttendance(attendance);
        overtime.setEmployee(attendance.getEmployee());
        overtime.setCreatedAt(LocalDateTime.now());

        overtimeRepository.save(overtime);
    }

    public void approve(Long id) throws MessagingException {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Overtime overtime = overtimeRepository.findById(id).orElseThrow();
        User censor;
        String description;
        Notification notification = new Notification();
        User manage = userRepository.findUserByRole("MANAGE");
        User admin = userRepository.findUserByRole("ADMIN");
        User sender = userRepository.findById(overtime.getEmployee().getUser().getId()).orElseThrow();
        switch (user.getRole()) {
            case "LEADER" -> {
                censor = userRepository.findUserByRole("MANAGE");
                description = "Leader approved, waiting for Manager approval.";
                overtime.setIsLeaderShow(user.getId());
                notification.setMessage("Leader just approved overtime request.");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(admin);
                notification.setRead(false);
                notificationRepository.save(notification);

                notification.setMessage("Leader has approved your overtime request.");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(sender);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            case "MANAGE" -> {
                censor = user;
                description = "Approved";
                overtime.setIsManageShow(user.getId());
                overtime.setStatus("Approved");

                notification.setMessage("Manager just approved overtime request.");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(admin);
                notification.setRead(false);
                notificationRepository.save(notification);

                notification.setMessage("Manager has approved your overtime request.");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(sender);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            case "ADMIN" -> {
                censor = user;
                description = "Approved";
                overtime.setIsAdminShow(user.getId());
                overtime.setStatus("Approved");

                notification.setMessage("Admin has approved your overtime request.");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(sender);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            default -> throw new IllegalStateException("Unexpected value: " + user.getRole());
        }
        overtime.setCensor(censor);
        overtime.setDescription(description);
        overtime.setUpdatedAt(LocalDateTime.now());
        overtimeRepository.save(overtime);
        if(user.getRole().equals("ADMIN") || user.getRole().equals("MANAGE")){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm ");
            String checkOutTime =  overtime.getCheckOutTime().format(formatter);
            sendEmailApproved(overtime.getEmployee().getEmail(), overtime.getEmployee().getEmpCode(), overtime.getEmployee().getFullname(), checkOutTime);
        }
    }

    public void reject(Long id, String description) throws MessagingException {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Overtime overtime = overtimeRepository.findById(id).orElseThrow();
        switch (user.getRole()) {
            case "LEADER" -> {
                overtime.setIsLeaderShow(overtime.getCensor().getId());
            }
            case "MANAGE" -> {
                overtime.setIsManageShow(overtime.getCensor().getId());
            }
            case "ADMIN" -> {
                overtime.setIsAdminShow(overtime.getCensor().getId());
            }
            default -> throw new IllegalStateException("Unexpected value: ");
        }
        overtime.setDescription(description);
        overtime.setStatus("Rejected");
        overtime.setUpdatedAt(LocalDateTime.now());
        overtimeRepository.save(overtime);
        sendEmailRejected(overtime.getEmployee().getEmail(), overtime.getEmployee().getEmpCode(), overtime.getEmployee().getFullname());
    }

    public List<OvertimeDTO> findAll(){
        List<Overtime> overtimes = overtimeRepository.findAll();
        return overtimes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Overtime findByAttendanceIdAndStatus(Long id, String status) {
        return overtimeRepository.findOvertimeByAttendanceIdAndStatus(id, status);
    }

    public List<Overtime> findByEmployeeEmail() {
        String email = getCurrentUserEmail();
        return overtimeRepository.findOvertimeByEmployeeEmail(email);
    }

    public List<Overtime> findByCensor() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long censor = user.getId();
        return overtimeRepository.findOvertimeByCensorId(censor);
    }

    public List<Overtime> findByIsShow() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long id = user.getId();
        List<Overtime> overtimes;
        switch (user.getRole()) {
            case "LEADER":
                overtimes = overtimeRepository.findOvertimeByIsLeaderShow(id);
                break;
            case "MANAGE":
                overtimes = overtimeRepository.findOvertimeByIsManageShow(id);
                break;
            case "ADMIN":
                overtimes = overtimeRepository.findOvertimeByIsAdminShow(id);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + user.getRole());
        }
        return overtimes;
    }

    public Overtime findByAttendanceId(Long id) {
        return overtimeRepository.findOvertimeByAttendanceId(id);
    }

    public OvertimeDTO convertToDTO(Overtime overtime) {
        OvertimeDTO overtimeDTO = new OvertimeDTO();
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
        overtimeDTO.setAttendanceDTO(convertToAttendanceDTO(overtime.getAttendance()));
        overtimeDTO.setCreatedAt(overtime.getCreatedAt());
        if(overtime.getUpdatedAt() == null){
            overtimeDTO.setUpdatedAt(null);
        }else{
            overtimeDTO.setUpdatedAt(overtime.getUpdatedAt());
        }
        return overtimeDTO;
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
        return attendanceDTO;
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
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setGender(employee.getGender());
        employeeDTO.setDepartment(employee.getDepartment().getName());
        employeeDTO.setPosition(employee.getPosition().getPositionName());
        return employeeDTO;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private void sendEmailApproved(String email, String empCode, String fullname, String checkOutTime) throws MessagingException {
        String subject = "Approve overtime";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #4CAF50; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Approve overtime registration request</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + empCode + "-" + fullname + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We have approved your overtime request. You will check out at <strong>" + checkOutTime + "</strong>. Good luck with your work!</p>"
                + "<p>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>"
                + "<p style='margin: 0;'>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        mailService.sendEmail(email, subject, content);
    }

    private void sendEmailRejected(String email, String empCode, String fullname) throws MessagingException {
        String subject = "Overtime Request - Denied";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #ff4c4c; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Overtime Registration Request Denied</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + empCode + " - " + fullname + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We regret to inform you that your request for overtime has not been approved at this time. After careful consideration, we have determined that the current workload and schedule do not require additional hours.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We appreciate your willingness to contribute extra time and effort, and we encourage you to continue your excellent work during regular hours. If you have any questions or need further clarification, please feel free to reach out.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Thank you for your understanding.</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>"
                + "<p style='margin: 0;'>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        mailService.sendEmail(email, subject, content);
    }

}


