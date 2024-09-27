package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id; // ID của sự kiện
    private String title; // Tiêu đề sự kiện
    private LocalDateTime date; // Ngày và giờ tổ chức sự kiện
    private LocalDateTime endDate; // Ngày và giờ kết thúc sự kiện
    private String description; // Mô tả về sự kiện
    private String imageUrl; // URL hình ảnh liên quan đến sự kiện
    private String status; // Trạng thái của sự kiện
    private LocalDateTime createdAt; // Thời gian tạo sự kiện
    private LocalDateTime updatedAt; // Thời gian cập nhật sự kiện
}
