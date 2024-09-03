package bizworks.backend.dtos;

import bizworks.backend.models.Position;
import lombok.Data;

import java.util.List;

@Data
public class PositionDTO {
    private Long id;
    private String positionName;
    private String description;
    private List<String> employees; // Thay đổi để lưu danh sách nhân viên

    public static PositionDTO from(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());
        dto.setDescription(position.getDescription());
        return dto;
    }
}
