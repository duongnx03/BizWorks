package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryDTO {
    private Long id;
    private String salaryCode; // Mã tự động (nếu cần)
    private Integer month; // Tháng trả lương
    private Integer year; // Năm trả lương
    private Double basicSalary; // Lương cơ bản
    private Double bonusSalary; // Thưởng
    private Double overtimeSalary; // Lương tăng ca
    private Double advanceSalary; // Số tiền tạm ứng lương
    private Double allowances; // Các khoản phụ cấp
    private Double deductions; // Các khoản khấu trừ
    private Double totalSalary; // Tổng lương
    private LocalDateTime dateSalary; // Ngày nhận lương
    private List<EmployeeDTO> employees;
    private LocalDateTime createdAt; // Ngày tạo
    private LocalDateTime updatedAt; // Ngày cập nhật
    private String status; // Tình trạng phiếu lương
    private String notes; // Ghi chú về phiếu lương
    private String createdBy; // Người tạo bản ghi
    private String updatedBy; // Người cập nhật bản ghi
}