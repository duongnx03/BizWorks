package bizworks.backend.dtos.hrdepartment;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class InterviewStatusDTO {
    private Long id;
    private Long interviewerId;
    private Long interviewScheduleId;
    private String status;
    private String result;
    private LocalDate resultDate;
    private String comments;
}
