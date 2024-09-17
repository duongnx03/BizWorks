package bizworks.backend.models.hrdepartment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "job_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String resumeUrl; // URL của CV hoặc hồ sơ xin việc
    private LocalDate applicationDate;
    private String status; // Ví dụ: PENDING, REVIEWED, ACCEPTED, REJECTED

    @Column(name = "rejection_reason")
    private String rejectionReason; // Thêm trường lý do từ chối
}
