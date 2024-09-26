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
    private String coreKnowledgeStatus; // Thêm trường trạng thái
    private String softSkills;
    private String softSkillsStatus; // Thêm trường trạng thái
    private String professionalSkills;
    private String professionalSkillsStatus; // Thêm trường trạng thái
    private Long trainingProgramId;
}
