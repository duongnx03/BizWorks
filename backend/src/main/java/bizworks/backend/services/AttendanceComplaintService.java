package bizworks.backend.services;

import bizworks.backend.dtos.AttendanceComplaintDTO;
import bizworks.backend.dtos.AttendanceComplaintRequestDTO;
import bizworks.backend.dtos.EmployeeResponseDTO;
import bizworks.backend.helpers.FileUpload;
import bizworks.backend.models.*;
import bizworks.backend.repositories.AttendanceComplaintRepository;
import bizworks.backend.repositories.AttendanceRepository;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
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

    private static final String rootUrl = "http://localhost:8080/";
    private static final String subFolder = "complaints";
    private static final String uploadFolder = "uploads";
    private static final String urlImage = rootUrl + uploadFolder + File.separator + subFolder;

    public AttendanceComplaint save(AttendanceComplaint complaint) {
        return attendanceComplaintRepository.save(complaint);
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
        Long censor;
        switch (user.getRole()) {
            case "LEADER":
                censor = user.getEmployee().getId();
                break;
            case "MANAGE":
                censor = user.getEmployee().getId();
                break;
            case "ADMIN":
                censor = user.getId();
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + user.getRole());
        }
        // Lấy danh sách các khiếu nại
        List<AttendanceComplaint> complaints = attendanceComplaintRepository.findAttendanceComplaintByCensor(censor);

        return complaints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceComplaintDTO> findByIsShow() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long id;
        List<AttendanceComplaint> attendanceComplaints;
        switch (user.getRole()) {
            case "LEADER":
                id = user.getEmployee().getId();
                attendanceComplaints = attendanceComplaintRepository.findAttendanceComplaintByIsLeaderShow(id);
                break;
            case "MANAGE":
                id = user.getEmployee().getId();
                attendanceComplaints = attendanceComplaintRepository.findAttendanceComplaintByIsManageShow(id);
                break;
            case "ADMIN":
                id = user.getId();
                attendanceComplaints = attendanceComplaintRepository.findAttendanceComplaintByIsAdminShow(id);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + user.getRole());
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
        Long censor;
        User user= userRepository.findByEmail(email).orElseThrow();
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Employee not found"));
        Attendance attendance = attendanceRepository.findById(complaintRequestDTO.getAttendanceId()).orElseThrow(() -> new RuntimeException("Attendance not found"));
        switch (user.getRole()){
            case "EMPLOYEE" -> {
                User leader = userRepository.findUserByRoleAndEmployeeDepartmentName("LEADER", user.getEmployee().getDepartment().getName());
                censor = leader.getId();
            }
            case "LEADER" -> {
                User manage = userRepository.findUserByRole("MANAGE");
                censor = manage.getId();
            }
            case "MANAGE" -> {
                User admin = userRepository.findUserByRole("ADMIN");
                censor = admin.getId();
            }
            default -> throw new IllegalStateException("Unexpected value: ");
        }
        complaint.setAttendance(attendance);
        complaint.setAttendanceDate(complaintRequestDTO.getAttendanceDate());
        complaint.setCheckInTime(complaintRequestDTO.getCheckInTime());
        complaint.setBreakTimeStart(complaintRequestDTO.getBreakTimeStart());
        complaint.setBreakTimeEnd(complaintRequestDTO.getBreakTimeEnd());
        complaint.setCheckOutTime(complaintRequestDTO.getCheckOutTime());
        complaint.setComplaintReason(complaintRequestDTO.getComplaintReason());
        complaint.setEmployee(employee);
        complaint.setCensor(censor);

        // Calculate total work time and overtime
        if (complaintRequestDTO.getCheckInTime() != null && complaintRequestDTO.getCheckOutTime() != null) {
            Duration breakDuration = Duration.ZERO;
            if (complaintRequestDTO.getBreakTimeStart() != null && complaintRequestDTO.getBreakTimeEnd() != null) {
                breakDuration = Duration.between(complaintRequestDTO.getBreakTimeStart(), complaintRequestDTO.getBreakTimeEnd());
            }

            Duration workedDuration = Duration.between(complaintRequestDTO.getCheckInTime(), complaintRequestDTO.getCheckOutTime());
            Duration actualWorkedDuration = workedDuration.minus(breakDuration);

            // Set total work time
            complaint.setTotalWorkTime(LocalTime.of(
                    (int) actualWorkedDuration.toHours(),
                    (int) actualWorkedDuration.toMinutes() % 60
            ));

            // Set overtime
            long standardWorkMinutes = 480; // 8 hours in minutes
            long actualWorkedMinutes = actualWorkedDuration.toMinutes();
            if (actualWorkedMinutes > standardWorkMinutes) {
                long overtimeMinutes = actualWorkedMinutes - standardWorkMinutes;
                complaint.setOvertime(LocalTime.of(
                        (int) overtimeMinutes / 60,
                        (int) overtimeMinutes % 60
                ));
            } else {
                complaint.setOvertime(LocalTime.of(0, 0));
            }
        }
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

    public AttendanceComplaintDTO approveComplaint(Long complaintId) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        String description;
        Long censor;
        AttendanceComplaint complaint = attendanceComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found."));
        switch (user.getRole()){
            case "LEADER" -> {
                User manage = userRepository.findUserByRole("MANAGE");
                censor = manage.getId();
                description = "Leader approved, waiting for Manager approval.";
                complaint.setIsLeaderShow(complaint.getCensor());
            }
            case "MANAGE" -> {
                User admin = userRepository.findUserByRole("ADMIN");
                censor = admin.getId();
                description = "Manage approved, waiting for Leader approval.";
                complaint.setIsManageShow(complaint.getCensor());
            }
            case "ADMIN" -> {
                User admin = userRepository.findUserByRole("ADMIN");
                censor = admin.getId();
                description = "We accept your attendance complaint request.";
                complaint.setIsManageShow(complaint.getCensor());
                complaint.setStatus("Approved");
                // Update Attendance with complaint details
                Attendance attendance = complaint.getAttendance();
                attendance.setCheckInTime(complaint.getCheckInTime());
                attendance.setCheckOutTime(complaint.getCheckOutTime());
                attendance.setBreakTimeStart(complaint.getBreakTimeStart());
                attendance.setBreakTimeEnd(complaint.getBreakTimeEnd());
                attendance.setTotalTime(complaint.getTotalWorkTime());
                attendance.setOvertime(complaint.getOvertime());

                // Save updated Attendance
                attendanceRepository.save(attendance);
            }
            default -> throw new IllegalStateException("Unexpected value: ");
        }
        complaint.setCensor(censor);
        complaint.setDescription(description);
        return convertToDTO(save(complaint));
    }

    public AttendanceComplaintDTO rejectComplaint(Long complaintId, String description) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        AttendanceComplaint complaint = attendanceComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        switch (user.getRole()){
            case "LEADER" -> {
                complaint.setIsLeaderShow(complaint.getCensor());
            }
            case "MANAGE" -> {
                complaint.setIsManageShow(complaint.getCensor());
            }
            case "ADMIN" -> {
                complaint.setIsAdminShow(complaint.getCensor());
            }
            default -> throw new IllegalStateException("Unexpected value: ");
        }
        // Update complaint status
        complaint.setDescription(description);
        complaint.setStatus("Rejected");
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
        dto.setTotalWorkTime(complaint.getTotalWorkTime());
        dto.setOvertime(complaint.getOvertime());
        dto.setComplaintReason(complaint.getComplaintReason());
        dto.setStatus(complaint.getStatus());
        dto.setImagePaths(complaint.getImagePaths());
        if(complaint.getDescription() != null){
            dto.setDescription(complaint.getDescription());
        }else {
            dto.setDescription(null);
        }
        dto.setAttendanceId(complaint.getAttendance().getId());
        dto.setEmployee(convertToEmployeeDTO(complaint.getEmployee()));
        return dto;
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
}

