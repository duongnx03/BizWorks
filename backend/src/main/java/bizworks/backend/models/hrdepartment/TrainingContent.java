package bizworks.backend.models.hrdepartment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Lob
    private String coreKnowledge;
    private String coreKnowledgeStatus;
    @Lob
    private String softSkills;
    private String softSkillsStatus;
    @Lob
    private String professionalSkills;
    private String professionalSkillsStatus;

    @ManyToOne
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;
}
