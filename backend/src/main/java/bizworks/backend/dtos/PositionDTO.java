package bizworks.backend.dtos;

import bizworks.backend.models.Department; // Nhớ import Department
import bizworks.backend.models.Position;
import lombok.Data;

@Data
public class PositionDTO {
    private Long id;
    private String positionName;
    private String description;
    private Double basicSalary;
    private Long departmentId; // Use departmentId instead of DepartmentDTO


    public static PositionDTO from(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());
        dto.setDescription(position.getDescription());
        dto.setBasicSalary(position.getBasicSalary());

        // Just set the department ID instead of converting the whole Department
        if (position.getDepartment() != null) {
            dto.setDepartmentId(position.getDepartment().getId());
        } else {
            dto.setDepartmentId(null);
        }

        return dto;
    }
}
