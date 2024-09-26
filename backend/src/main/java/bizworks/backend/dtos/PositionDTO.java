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
    private Department department; // Thêm trường department

    public static PositionDTO from(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());
        dto.setDescription(position.getDescription());
        dto.setBasicSalary(position.getBasicSalary());
        dto.setDepartment(position.getDepartment()); // Gán phòng ban nếu cần
        return dto;
    }
}
