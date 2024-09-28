package bizworks.backend.dtos.hrdepartment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingEvaluationDTO {
    private Long trainingProgramId;
    private Long employeeId;
    private int rating; // Đánh giá từ 1 đến 5
    private String feedback; // Nhận xét
}
