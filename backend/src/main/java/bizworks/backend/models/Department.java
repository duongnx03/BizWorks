package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String departmentName;
    private String description;

    @OneToMany(mappedBy = "department", cascade = CascadeType.MERGE)
    private List<Position> positions;

    @OneToMany(mappedBy = "department", cascade = CascadeType.MERGE)
    private List<Employee> employees;
}
