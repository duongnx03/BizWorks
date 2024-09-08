package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "overtimes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Overtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalTime overtimeStart;
    private LocalTime overtimeEnd;
    private LocalTime totalTime;
    private LocalDateTime checkOutTime;
    private String type;
    private String status;
    private String reason;
    private String description;
    private Long isAdminShow;
    private Long isManageShow;
    private Long isLeaderShow;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendanceId")
    private Attendance attendance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empId")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "censor_id")
    private User censor;
}

