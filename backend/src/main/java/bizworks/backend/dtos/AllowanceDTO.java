package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllowanceDTO {

    private Long id; // ID của allowance
    private String name; // Tên của allowance
    private Double amount; // Số tiền phụ cấp
    private String description; // Mô tả
    private Integer month; // Tháng áp dụng
    private Integer year; // Năm áp dụng
    private String status; // Tình trạng của allowance
    private LocalDateTime createdAt; // Ngày tạo
    private LocalDateTime updatedAt; // Ngày cập nhật
}
