package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeNotAttendanceDTO {
    private Long id;
    private LocalTime overtimeStart;
    private LocalTime overtimeEnd;
    private LocalTime totalTime;
    private LocalDateTime checkOutTime;
    private String type;
    private String status;
    private String reason;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponseDTO censor;
}
