package bizworks.backend.models.hrdepartment;

import bizworks.backend.models.Employee;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    @ManyToMany
    @JoinTable(
            name = "training_program_employees",
            joinColumns = @JoinColumn(name = "training_program_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    @JsonManagedReference

    private List<Employee> participants;

    @OneToMany(mappedBy = "trainingProgram", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttendanceTrainingProgram> attendanceRecords = new ArrayList<>();


}