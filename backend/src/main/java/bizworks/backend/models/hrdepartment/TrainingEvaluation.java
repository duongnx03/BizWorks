package bizworks.backend.models.hrdepartment;

import bizworks.backend.models.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private int rating; // Đánh giá từ 1 đến 5
    private String feedback; // Nhận xét
}
