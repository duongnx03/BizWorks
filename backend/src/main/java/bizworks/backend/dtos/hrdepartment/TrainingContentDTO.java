package bizworks.backend.dtos.hrdepartment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingContentDTO {
    private Long id;
    private String title;
    private String coreKnowledge;
    private String softSkills;
    private String professionalSkills;
    private Long trainingProgramId; // Link to the training program
}
