package bizworks.backend.dtos.hrdepartment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate postedDate;
    private LocalDate deadline;
    private Long departmentId;
    private Long positionId;
    private String location;
    private String employmentType;
    private String requirements;
    private String positionName;
    private Double salaryRangeMin;
    private Double salaryRangeMax;

}
