package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryDTO {
    private Long id;
    private String salaryCode; // Mã tự động (nếu cần)
    private int month; // Tháng trả lương
    private int year; // Năm trả lương
    private double basicSalary; // Lương cơ bản
    private double bonusSalary; // Thưởng
    private double overtimeSalary; // Lương tăng ca
    private double allowances; // Các khoản phụ cấp
    private double deductions; // Các khoản khấu trừ
    private double totalSalary; // Tổng lương
    private Date dateSalary; // Ngày nhận lương
    private EmployeeDTO employee; // Thông tin nhân viên
    private Date createdAt; // Ngày tạo
    private Date updatedAt; // Ngày cập nhật
}