package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceComplaintDTO {
    private Long id;
    private LocalDateTime checkInTime;
    private LocalDateTime breakTimeStart;
    private LocalDateTime breakTimeEnd;
    private LocalDateTime checkOutTime;
    private LocalDate attendanceDate;
    private LocalTime totalTime;
    private LocalTime officeHours;
    private LocalTime overtime;
    private String complaintReason;
    private String status;
    private Long attendanceId;
    private String imagePaths;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private EmployeeResponseDTO employee;
    private UserResponseDTO censor;
    private OvertimeNotAttendanceDTO overTimes;
}
