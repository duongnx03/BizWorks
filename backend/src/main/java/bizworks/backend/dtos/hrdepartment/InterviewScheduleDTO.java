package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.models.hrdepartment.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewScheduleDTO {
    private Long id;
    private Long jobApplicationId; // Giữ nguyên kiểu Long
    private LocalDateTime interviewDate; // Kiểu LocalDateTime
    private List<Long> interviewers; // Danh sách ID
    private String location; // Địa điểm phỏng vấn
    private InterviewStatus status; // Trạng thái vẫn là enum
}
