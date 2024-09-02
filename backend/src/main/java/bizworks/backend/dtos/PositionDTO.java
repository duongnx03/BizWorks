package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class PositionDTO {
    private Long id;
    private String positionName;
    private String description;
}
