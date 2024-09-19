package bizworks.backend.models.hrdepartment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "status_change_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusChangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_application_id")
    private JobApplication jobApplication;

    private String newStatus;
    private String reason;

    private LocalDate requestDate;
    private Boolean approved;

    @Column(name = "approval_date")
    private LocalDate approvalDate;
}
