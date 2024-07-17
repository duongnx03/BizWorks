package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "positions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String positionName;
    private String description;

    @OneToMany(mappedBy = "position", cascade = CascadeType.MERGE)
    private List<Employee> employees;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
