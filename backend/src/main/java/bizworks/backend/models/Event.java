package bizworks.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID của sự kiện

    @Column(nullable = false)
    private String title; // Tiêu đề sự kiện

    @Column(nullable = false)
    private LocalDateTime date; // Ngày và giờ tổ chức sự kiện

    @Column(nullable = false)
    private LocalDateTime endDate; // Ngày và giờ kết thúc sự kiện

    @Column(length = 10000) // Giới hạn độ dài mô tả
    private String description; // Mô tả về sự kiện

    @Column(nullable = false)
    private String imageUrl; // URL hình ảnh liên quan đến sự kiện

    @Column(nullable = false)
    private String status; // Trạng thái của sự kiện

    @Column(nullable = false)
    private LocalDateTime createdAt; // Thời gian tạo sự kiện

    @Column(nullable = false)
    private LocalDateTime updatedAt; // Thời gian cập nhật sự kiện
}
