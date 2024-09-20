package bizworks.backend.dtos;

import bizworks.backend.models.Violation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViolationDTO {
    private Long id;
    private EmployeeDTO employee;;
    private ViolationTypeDTO violationType;
    private LocalDate violationDate;
    private String description;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedAt;

    public static ViolationDTO from(Violation violation) {
        return new ViolationDTO(
                violation.getId(),
                violation.getEmployee() != null ? EmployeeDTO.from(violation.getEmployee()) : null, // Chỉnh sửa ở đây
                violation.getViolationType() != null ? ViolationTypeDTO.from(violation.getViolationType()) : null,
                violation.getViolationDate(),
                violation.getDescription(),
                violation.getStatus(),
                violation.getCreatedDate(),
                violation.getUpdatedAt()
        );
    }
}
