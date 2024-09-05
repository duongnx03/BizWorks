package bizworks.backend.dtos;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import lombok.Data;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class PositionDTO {
    private Long id;
    private String positionName;
    private String description;
    private List<EmployeeDTO> employees;
    private DepartmentDTO department; // Chỉnh sửa ở đây

    public static PositionDTO from(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());
        dto.setDescription(position.getDescription());
        dto.setEmployees(position.getEmployees() != null ?
                position.getEmployees().stream()
                        .map(EmployeeDTO::from)
                        .collect(Collectors.toList()) :
                Collections.emptyList());

        if (position.getDepartment() != null) {
            dto.setDepartment(DepartmentDTO.from(position.getDepartment()));
        }

        return dto;
    }
}
