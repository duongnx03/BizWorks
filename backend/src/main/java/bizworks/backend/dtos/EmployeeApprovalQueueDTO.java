package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeApprovalQueueDTO {
    private Long id;
    private String empCode;
    private String fullname;
    private String email;
    private String avatar;
    private LocalDate startDate;
    private Long departmentId;
    private String departmentName;
    private Long positionId;
    private String positionName;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponseDTO sender;
    private UserResponseDTO censor;
}
