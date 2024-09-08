package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime checkInTime;
    private LocalDateTime breakTimeStart;
    private LocalDateTime breakTimeEnd;
    private LocalDateTime checkOutTime;
    private LocalDate attendanceDate;
    private LocalTime totalTime;
    private LocalTime officeHours;
    private LocalTime overtime;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empId")
    private Employee employee;

    @OneToOne(mappedBy = "attendance", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AttendanceComplaint attendanceComplaint;

    @OneToOne(mappedBy = "attendance", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Overtime overTimes;
}

