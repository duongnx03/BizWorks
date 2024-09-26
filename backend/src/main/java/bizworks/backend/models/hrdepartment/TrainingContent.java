package bizworks.backend.models.hrdepartment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Title of the training content

    @Lob
    private String coreKnowledge; // Core knowledge to be taught

    @Lob
    private String softSkills; // Soft skills to be taught

    @Lob
    private String professionalSkills; // Professional skills to be taught

    @ManyToOne
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram; // Link to the training program
}
