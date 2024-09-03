package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "salaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID của bản ghi lương

    @Column(name = "salary_code", nullable = false, unique = true)
    private String salaryCode; // Mã tự động của phiếu lương

    @Column(name = "month", nullable = false)
    private Integer month; // Tháng trả lương

    @Column(name = "year", nullable = false)
    private Integer year; // Năm trả lương

    private double basicSalary; // Lương cơ bản
    private double bonusSalary; // Thưởng
    private double overtimeSalary; // Lương tăng ca
    private double allowances; // Các khoản phụ cấp
    private double deductions; // Các khoản khấu trừ
    private double totalSalary; // Tổng lương
    private double advanceSalary; // Tiền ứng lương

    @Column(name = "date_salary", nullable = false)
    private LocalDateTime dateSalary; // Ngày nhận lương

    @ManyToOne
    @JoinColumn(name = "empId", nullable = false)
    private Employee employee; // Nhân viên có lương này

    @OneToOne(mappedBy = "salary", cascade = CascadeType.MERGE)
    private Transaction transaction; // Giao dịch liên quan đến việc trả lương

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Ngày giờ tạo bản ghi

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Ngày giờ cập nhật bản ghi
}