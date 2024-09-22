package bizworks.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViolationComplaintDTO {
    private Long id;
    private EmployeeDTO employee;
    private ViolationDTO violation;
    @NotBlank(message = "Description cannot be empty.")
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
