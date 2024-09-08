package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceComplaint {
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
    private String complaintReason;
    private String status;
    private String imagePaths;
    private String description;
    private Long isManageShow;
    private Long isLeaderShow;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_id")
    private Attendance attendance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empId")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User censor;
}
