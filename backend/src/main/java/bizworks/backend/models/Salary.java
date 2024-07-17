package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "salaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double basicSalary;
    private double allowanceSalary;
    private double deductionSalary;
    private double bonusSalary;
    private double overtimeSalary;
    private double totalSalaryMonth;
    private double totalSalaryYear;
    private Date dateSalary;
    @ManyToOne
    @JoinColumn(name = "empId")
    private Employee employee;

    @OneToOne(mappedBy = "salary", cascade = CascadeType.MERGE)
    private Transaction transaction;
}
