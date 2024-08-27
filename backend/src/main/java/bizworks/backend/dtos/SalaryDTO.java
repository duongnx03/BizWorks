package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryDTO {
    private Long id;
    private String salaryCode; // Mã tự động (nếu cần)
    private int month; // Tháng trả lương
    private int year; // Năm trả lương
    private Double basicSalary; // Lương cơ bản
    private Double bonusSalary; // Thưởng
    private Double overtimeSalary; // Lương tăng ca
    private Double advanceSalary; // Số tiền tạm ứng lương
    private Double allowances; // Các khoản phụ cấp
    private Double deductions; // Các khoản khấu trừ
    private Double totalSalary; // Tổng lương
    private LocalDateTime dateSalary; // Ngày nhận lương
    private EmployeeDTO employee; // Thông tin nhân viên
    private LocalDateTime createdAt; // Ngày tạo
    private LocalDateTime updatedAt; // Ngày cập nhật
}