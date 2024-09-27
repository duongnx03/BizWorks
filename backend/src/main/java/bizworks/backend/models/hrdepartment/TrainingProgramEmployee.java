package bizworks.backend.models.hrdepartment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "training_program_employees")
public class TrainingProgramEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "training_program_id")
    private Long trainingProgramId;

    @Column(name = "employee_id")
    private Long employeeId;
}