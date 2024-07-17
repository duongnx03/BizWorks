package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "attendance_date")
    private LocalDateTime attendanceDate;

    @Column(name = "is_checked")
    private boolean isChecked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id")
    private Employee employee;
}
