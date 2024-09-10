package bizworks.backend.models;

import bizworks.backend.dtos.LeaveType;
import jakarta.persistence.*;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
  private String status;

  @ManyToOne
  @JoinColumn(name = "empId")
  private Employee employee;
}
