package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.models.hrdepartment.InterviewStatus;
import lombok.Data;

@Data
public class InterviewStatusRequest {
    private InterviewStatus status; // Trạng thái phỏng vấn
}
