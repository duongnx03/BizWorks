package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViolationDTO {
    private Long id;
    private EmployeeDTO employee;;
    private ViolationTypeDTO violationType;
    private LocalDate violationDate;
    private String reason;
    private String status;
}
