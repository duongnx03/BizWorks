package bizworks.backend.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TrainingProgramDTO {

    private Long id;
    private String programName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long departmentId;
    private String departmentName;
    private Long trainerId;
    private String trainerName;
    private List<Long> employeeIds;
    private List<String> employeeNames;
}
