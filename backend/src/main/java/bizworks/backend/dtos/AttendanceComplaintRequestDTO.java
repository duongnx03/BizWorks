package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceComplaintRequestDTO {
    private LocalDateTime checkInTime;
    private LocalDateTime breakTimeStart;
    private LocalDateTime breakTimeEnd;
    private LocalDateTime checkOutTime;
    private LocalDate attendanceDate;
    private String complaintReason;
    private Long attendanceId;
}
