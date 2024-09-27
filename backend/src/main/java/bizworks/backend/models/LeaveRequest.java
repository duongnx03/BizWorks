package bizworks.backend.models;

import bizworks.backend.dtos.LeaveType;
import jakarta.persistence.*;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Date startDate;
  private Date endDate;

  @Enumerated(EnumType.STRING)
  private LeaveType leaveType;

  private String reason;

  @Column(name = "created_at", nullable = false, updatable = false)
  @CreationTimestamp
  private Date createdAt;

  private String status;
  private String leaderStatus;

  @ManyToOne
  @JoinColumn(name = "empId")
  private Employee employee;
}
