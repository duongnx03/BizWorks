package bizworks.backend.dtos;

import bizworks.backend.models.ViolationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViolationTypeDTO {
    private Long id;
    private String type;
    private Double violationMoney;

    public static ViolationTypeDTO from(ViolationType violationType) {
        return new ViolationTypeDTO(
                violationType.getId(),
                violationType.getType(),
                violationType.getViolationMoney()
        );
    }
}
