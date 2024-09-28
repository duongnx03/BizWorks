package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAllowanceDTO {
    private Long id;
    private Long allowanceId;  // Id của Allowance
    private List<EmployeeDTO> employees;  // Danh sách Id của Employee
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
