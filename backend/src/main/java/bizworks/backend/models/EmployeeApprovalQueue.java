package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "employees_approval_queue")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeApprovalQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String empCode;
    private String fullname;
    private String email;
    private String avatar;
    private LocalDate startDate;
    private Long departmentId;
    private String departmentName;
    private Long positionId;
    private String positionName;
    private Long censor;
    private String status;
    private String description;
    private Long sender;
    private Long isManageShow;
}

