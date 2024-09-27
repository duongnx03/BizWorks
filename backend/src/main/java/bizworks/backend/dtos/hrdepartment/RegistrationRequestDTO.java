package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.models.hrdepartment.RegistrationStatus;
import lombok.Data;

@Data
public class RegistrationRequestDTO {
    private Long id;
    private Long employeeId;
    private Long activityId;
    private RegistrationStatus status;
}
