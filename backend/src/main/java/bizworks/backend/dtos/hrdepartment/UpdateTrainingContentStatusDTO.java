package bizworks.backend.dtos.hrdepartment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTrainingContentStatusDTO {
    private String coreKnowledgeStatus; // Trạng thái cho Kiến Thức Cơ Bản
    private String softSkillsStatus; // Trạng thái cho Kỹ Năng Mềm
    private String professionalSkillsStatus; // Trạng thái cho Kỹ Năng Chuyên Môn
}
