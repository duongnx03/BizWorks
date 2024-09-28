package bizworks.backend.models.hrdepartment;

import bizworks.backend.models.Employee;
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
public class ExtracurricularActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate date;

    @ManyToMany
    @JoinTable(
            name = "extracurricular_activity_employees",
            joinColumns = @JoinColumn(name = "activity_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employee> participants = new ArrayList<>();

    private boolean completed;
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegistrationRequest> registrationRequests = new ArrayList<>();

}
