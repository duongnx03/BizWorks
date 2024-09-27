package bizworks.backend.dtos;

import bizworks.backend.models.Department;
import lombok.Data;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class DepartmentDTO {
    private Long id;
    private String departmentName;
    private String description;
    private List<PositionDTO> positions;

    public static DepartmentDTO from(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getName());
        dto.setDescription(department.getDescription());

        dto.setPositions(department.getPositions() != null ?
                department.getPositions().stream()
                        .map(PositionDTO::from)
                        .collect(Collectors.toList()) :
                Collections.emptyList());

        return dto;
    }
}
