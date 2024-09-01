    package bizworks.backend.models;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.Date;

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
        private String leaveType;
        private String status;

        @ManyToOne
        @JoinColumn(name = "empId")
        private Employee employee;
    }
