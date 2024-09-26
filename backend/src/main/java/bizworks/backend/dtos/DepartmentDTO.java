package bizworks.backend.dtos;

import bizworks.backend.models.Department;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class DepartmentDTO {
    private Long id;
    private String departmentName;
    private String description;
    private List<PositionDTO> positions; // Thêm trường positions

    public static DepartmentDTO from(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getName());
        dto.setDescription(department.getDescription());

        // Lấy danh sách positions và ánh xạ sang PositionDTO
        dto.setPositions(department.getPositions() != null ?
                department.getPositions().stream()
                        .map(PositionDTO::from)
                        .collect(Collectors.toList()) :
                null // hoặc Collections.emptyList() nếu bạn muốn trả về danh sách rỗng
        );

        return dto;
    }
}
