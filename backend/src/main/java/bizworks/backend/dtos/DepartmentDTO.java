package bizworks.backend.dtos;

import bizworks.backend.models.Department;
import lombok.Data;


@Data
public class DepartmentDTO {
    private Long id;
    private String departmentName; // Thay thế với thuộc tính thực tế của bạn
    private String description;
    public static DepartmentDTO from(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getName());
        dto.setDescription(department.getDescription());
        return dto;
    }
}
