package bizworks.backend.services;

import bizworks.backend.dtos.*;
import bizworks.backend.helpers.FileUpload;
import bizworks.backend.models.*;
import bizworks.backend.repositories.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceComplaintService {
    private final AttendanceComplaintRepository attendanceComplaintRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final FileUpload fileUpload;
    private final NotificationRepository notificationRepository;
    private final MailService mailService;

    private static final String rootUrl = "http://localhost:8080/";
    private static final String subFolder = "complaints";
    private static final String uploadFolder = "uploads";
    private static final String urlImage = rootUrl + uploadFolder + File.separator + subFolder;

    public AttendanceComplaint save(AttendanceComplaint complaint) {
        return attendanceComplaintRepository.save(complaint);
    }

    public List<AttendanceComplaintDTO> findAll(){
        List<AttendanceComplaint> attendanceComplaints = attendanceComplaintRepository.findAll();
        return attendanceComplaints.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public AttendanceComplaintDTO findByAttendanceId(Long id){
        AttendanceComplaint attendanceComplaint = attendanceComplaintRepository.findAttendanceComplaintByAttendanceId(id);
        if(attendanceComplaint == null){
            throw new RuntimeException("Not found");
        }else{
            return convertToDTO(attendanceComplaint);
        }
    }

    public List<AttendanceComplaintDTO> findByCensor(){
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        // Lấy danh sách các khiếu nại
        List<AttendanceComplaint> complaints = attendanceComplaintRepository.findAttendanceComplaintByCensorId(user.getId());

        return complaints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceComplaintDTO> findByIsShow() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long id = user.getId();
        List<AttendanceComplaint> attendanceComplaints;
        switch (user.getRole()) {
            case "LEADER" -> {
                attendanceComplaints = attendanceComplaintRepository.findAttendanceComplaintByIsLeaderShow(id);
            }
            case "MANAGE" -> {
                attendanceComplaints = attendanceComplaintRepository.findAttendanceComplaintByIsManageShow(id);
            }
            default -> throw new IllegalStateException("Unexpected value: " + user.getRole());
        }
        return attendanceComplaints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceComplaintDTO> findByEmployeeEmail(){
        String email = getCurrentUserEmail();
        // Lấy danh sách các khiếu nại
        List<AttendanceComplaint> complaints = attendanceComplaintRepository.findAttendanceComplaintByEmployeeEmail(email);

        return complaints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AttendanceComplaintDTO createComplaint(AttendanceComplaintRequestDTO complaintRequestDTO, List<MultipartFile> images) throws IOException {
        AttendanceComplaint complaint = new AttendanceComplaint();
        String email = getCurrentUserEmail();
        User censor;
        User user= userRepository.findByEmail(email).orElseThrow();
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Employee not found"));
        Attendance attendance = attendanceRepository.findById(complaintRequestDTO.getAttendanceId()).orElseThrow(() -> new RuntimeException("Attendance not found"));
        Notification notification = new Notification();
        switch (user.getRole()){
            case "EMPLOYEE", "LEADER" -> {
                User manage = userRepository.findUserByRole("MANAGE");
                censor = manage;
                notification.setMessage("Request for attendance complaint");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(manage);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            case "MANAGE" -> {
                User admin = userRepository.findUserByRole("ADMIN");
                notification.setMessage("Request for attendance complaint");
                notification.setCreatedAt(LocalDateTime.now());
                notification.setUser(admin);
                notification.setRead(false);
                notificationRepository.save(notification);
                censor = admin;
            }
            default -> throw new IllegalStateException("Unexpected value: ");
        }
        LocalDateTime breakTimeStart = complaintRequestDTO.getBreakTimeStart();
        LocalDateTime breakTimeEnd = complaintRequestDTO.getBreakTimeEnd();
        LocalDateTime checkInTime = complaintRequestDTO.getCheckInTime();
        LocalDateTime checkOutTime = complaintRequestDTO.getCheckOutTime();

        complaint.setAttendance(attendance);
        complaint.setAttendanceDate(complaintRequestDTO.getAttendanceDate());
        complaint.setCheckInTime(checkInTime);
        complaint.setBreakTimeStart(breakTimeStart);
        complaint.setBreakTimeEnd(breakTimeEnd);
        complaint.setCheckOutTime(checkOutTime);
        complaint.setOvertime(complaintRequestDTO.getOvertime());
        complaint.setOfficeHours(complaintRequestDTO.getOfficeHours());
        complaint.setTotalTime(complaintRequestDTO.getTotalTime());
        complaint.setComplaintReason(complaintRequestDTO.getComplaintReason());
        complaint.setEmployee(employee);
        complaint.setCensor(censor);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus("Pending");
        if (images != null && !images.isEmpty()) {
            List<String> imageNames = fileUpload.storeMultipleImages(subFolder, images);
            String imageUrls = imageNames.stream()
                    .map(name -> urlImage + File.separator + name)
                    .collect(Collectors.joining(","))
                    .replace("\\", "/");
            complaint.setImagePaths(imageUrls);
        }

        return convertToDTO(save(complaint));
    }

    public AttendanceComplaintDTO approveComplaint(AttendanceComplaintUpdateDTO attendanceComplaintUpdateDTO) throws MessagingException {
        String description = "We accept your attendance complaint request.";
        AttendanceComplaint complaint = attendanceComplaintRepository.findById(attendanceComplaintUpdateDTO.getId())
                .orElseThrow(() -> new RuntimeException("Complaint not found."));
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime checkInTime = attendanceComplaintUpdateDTO.getCheckInTime();
        LocalDateTime checkOutTime = attendanceComplaintUpdateDTO.getCheckOutTime();
        LocalDateTime breakTimeStart = currentDateTime.with(LocalTime.of(12, 0));
        LocalDateTime breakTimeEnd = currentDateTime.with(LocalTime.of(13, 0));
        Overtime overtime = complaint.getAttendance().getOverTimes();
        Notification notification = new Notification();
        User admin = userRepository.findUserByRole("ADMIN");
        User sender = userRepository.findById(complaint.getEmployee().getUser().getId()).orElseThrow();

        complaint.setCheckInTime(checkInTime);
        complaint.setBreakTimeStart(breakTimeStart);
        complaint.setBreakTimeEnd(breakTimeEnd);
        complaint.setCheckOutTime(checkOutTime);

        Duration breakDuration = Duration.ZERO;
        if (breakTimeStart != null && breakTimeEnd != null) {
            breakDuration = Duration.between(breakTimeStart, breakTimeEnd);
        }

        Duration workedDuration = Duration.between(checkInTime, checkOutTime);
        Duration actualWorkedDuration = workedDuration.minus(breakDuration);

        // Tính thời gian overtime
        long overtimeMinutes = 0;
        if (overtime != null && overtime.getType().equals("noon_overtime")) {
            complaint.setOvertime(LocalTime.of(1, 0));  // 1 giờ làm thêm vào buổi trưa
            overtimeMinutes = 60; // 1 giờ = 60 phút
        } else {
            overtimeMinutes = Math.max(0, actualWorkedDuration.toMinutes() - 480); // Trừ đi 8 giờ chuẩn
            complaint.setOvertime(LocalTime.of(
                    (int) overtimeMinutes / 60,
                    (int) overtimeMinutes % 60
            ));
        }

        // Tính office hours
        long actualWorkedMinutes = actualWorkedDuration.toMinutes();
        if(overtime != null &&overtime.getType().equals("noon_overtime")){
            complaint.setOfficeHours(LocalTime.of(
                    (int) actualWorkedMinutes / 60,
                    (int) actualWorkedMinutes % 60
            ));
        }else{
            long officeHoursMinutes = actualWorkedMinutes - overtimeMinutes;
            complaint.setOfficeHours(LocalTime.of(
                    (int) officeHoursMinutes / 60,
                    (int) officeHoursMinutes % 60
            ));
        }

        // Set tổng thời gian
        long totalTime = workedDuration.toMinutes();
        complaint.setTotalTime(LocalTime.of(
                (int) totalTime / 60,
                (int) totalTime % 60
        ));

        complaint.setUpdatedAt(LocalDateTime.now());
        complaint.setDescription(description);
        complaint.setStatus("Approved");

        AttendanceComplaint saveComplaint = attendanceComplaintRepository.save(complaint);

        Attendance attendance = saveComplaint.getAttendance();
        attendance.setCheckInTime(complaint.getCheckInTime());
        attendance.setCheckOutTime(complaint.getCheckOutTime());
        attendance.setBreakTimeStart(complaint.getBreakTimeStart());
        attendance.setBreakTimeEnd(complaint.getBreakTimeEnd());
        attendance.setTotalTime(complaint.getTotalTime());
        attendance.setOfficeHours(complaint.getOfficeHours());
        attendance.setOvertime(complaint.getOvertime());

        // Save updated Attendance
        attendanceRepository.save(attendance);

        notification.setMessage("Manager just approved the attendance complaint request.");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(admin);
        notification.setRead(false);
        notificationRepository.save(notification);

        notification.setMessage("Manager has approved your attendance request.");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(sender);
        notification.setRead(false);
        notificationRepository.save(notification);
        sendEmailApproved(complaint.getEmployee().getEmail(), complaint.getEmployee().getEmpCode(), complaint.getEmployee().getFullname());
        return convertToDTO(save(complaint));
    }

    public AttendanceComplaintDTO rejectComplaint(Long complaintId, String description) throws MessagingException {
        AttendanceComplaint complaint = attendanceComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        // Update complaint status
        complaint.setUpdatedAt(LocalDateTime.now());
        complaint.setDescription(description);
        complaint.setStatus("Rejected");
        sendEmailRejected(complaint.getEmployee().getEmail(),
                complaint.getEmployee().getEmpCode(),
                complaint.getEmployee().getFullname());
        return convertToDTO(save(complaint));
    }

    private AttendanceComplaintDTO convertToDTO(AttendanceComplaint complaint) {
        AttendanceComplaintDTO dto = new AttendanceComplaintDTO();
        dto.setId(complaint.getId());
        dto.setCheckInTime(complaint.getCheckInTime());
        dto.setBreakTimeStart(complaint.getBreakTimeStart());
        dto.setBreakTimeEnd(complaint.getBreakTimeEnd());
        dto.setCheckOutTime(complaint.getCheckOutTime());
        dto.setAttendanceDate(complaint.getAttendanceDate());
        dto.setTotalTime(complaint.getTotalTime());
        dto.setOfficeHours(complaint.getOfficeHours());
        dto.setOvertime(complaint.getOvertime());
        dto.setComplaintReason(complaint.getComplaintReason());
        dto.setStatus(complaint.getStatus());
        dto.setImagePaths(complaint.getImagePaths());
        if(complaint.getDescription() != null){
            dto.setDescription(complaint.getDescription());
        }else {
            dto.setDescription(null);
        }
        dto.setCreatedAt(complaint.getCreatedAt());
        if(complaint.getUpdatedAt() == null){
            dto.setUpdatedAt(null);
        }else{
            dto.setUpdatedAt(complaint.getUpdatedAt());
        }
        dto.setAttendanceId(complaint.getAttendance().getId());
        dto.setEmployee(convertToEmployeeDTO(complaint.getEmployee()));
        dto.setCensor(convertToUserDTO(complaint.getCensor()));
        if(complaint.getAttendance().getOverTimes() != null){
            dto.setOverTimes(convertToOvertimeDTO(complaint.getAttendance().getOverTimes()));
        }else{
            dto.setOverTimes(null);
        }
        return dto;
    }

    private UserResponseDTO convertToUserDTO(User user){
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setEmployee(convertToEmployeeDTO(user.getEmployee()));
        return userResponseDTO;
    }

    private OvertimeNotAttendanceDTO convertToOvertimeDTO(Overtime overtime) {
        OvertimeNotAttendanceDTO overtimeDTO = new OvertimeNotAttendanceDTO();
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

    private void sendEmailApproved(String email, String empCode, String fullname) throws MessagingException {
        String subject = "Attendance Complaint Approved";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #4CAF50; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Attendance Appeal Approved</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + empCode + " - " + fullname + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We are pleased to inform you that your attendance appeal has been approved.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Your records have been updated accordingly, and the correction has been reflected in our system.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>If you have any further questions, please do not hesitate to contact us.</p>"
                + "<p>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>"
                + "<p style='margin: 0;'>Thank you for your cooperation,<br>BizWorks</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        mailService.sendEmail(email, subject, content);
    }

    private void sendEmailRejected(String email, String empCode, String fullname) throws MessagingException {
        String subject = "Attendance Complaint Denied";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #ff4c4c; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Attendance Appeal Denied</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + empCode + " - " + fullname + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We regret to inform you that your attendance appeal has been denied after careful consideration.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>The decision was based on our current attendance policies and the information available to us.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>If you have any further questions or need clarification, please feel free to reach out to our HR department.</p>"
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

