package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "training_programs")
public class TrainingProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String programName;

    private LocalDate startDate;

    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Employee trainer;

    @ManyToMany
    @JoinTable(name = "training_program_employees", joinColumns = @JoinColumn(name = "training_program_id"), inverseJoinColumns = @JoinColumn(name = "employee_id"))
    private List<Employee> employees;
}
