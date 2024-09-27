package bizworks.backend.dtos.hrdepartment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceTrainingProgramDTO {
    private Long id;
    private Long trainingProgramId; // ID của chương trình đào tạo
    private Long employeeId; // ID của nhân viên
    private LocalDateTime attendedAt;
    private LocalDate attendanceDate;
    private AttendanceStatus status;

    public enum AttendanceStatus {
        PRESENT,  // Nhân viên có mặt
        ABSENT    // Nhân viên vắng mặt
    }
}
