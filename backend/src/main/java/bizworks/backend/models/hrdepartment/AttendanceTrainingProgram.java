package bizworks.backend.models.hrdepartment;

import bizworks.backend.models.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceTrainingProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime attendedAt;

    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    public enum AttendanceStatus {
        PRESENT,  // Employee attended
        ABSENT    // Employee did not attend
    }
}
