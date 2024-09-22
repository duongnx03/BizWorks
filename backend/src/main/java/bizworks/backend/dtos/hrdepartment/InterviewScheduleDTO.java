package bizworks.backend.dtos.hrdepartment;

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
    private Long jobApplicationId;
    private LocalDateTime interviewDate;
    private List<Long> interviewers; // Sử dụng List<Long> thay vì String
    private String location;
}
