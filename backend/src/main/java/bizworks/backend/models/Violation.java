package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "violations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Violation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String violationType;
    private double violationMoney;
    private LocalDateTime violationDate;
    private String reason;
    private String status;

    @ManyToOne
    @JoinColumn(name = "empId")
    private Employee employee;
}
