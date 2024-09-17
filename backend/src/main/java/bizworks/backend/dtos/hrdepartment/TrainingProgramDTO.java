package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.models.hrdepartment.TrainingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramDTO {
    private Long id;
    private String title;
    private String description;
    private TrainingType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<EmployeeDTO> employees; // Thay đổi từ List<Long> thành List<EmployeeDTO>

    public static TrainingProgramDTO from(TrainingProgram trainingProgram) {
        if (trainingProgram == null) {
            return null;
        }
        return TrainingProgramDTO.builder()
                .id(trainingProgram.getId())
                .title(trainingProgram.getTitle())
                .description(trainingProgram.getDescription())
                .type(trainingProgram.getType())
                .startDate(trainingProgram.getStartDate())
                .endDate(trainingProgram.getEndDate())
                .employees(trainingProgram.getEmployees() != null
                        ? trainingProgram.getEmployees().stream().map(EmployeeDTO::from).collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }

    public TrainingProgram toEntity(Set<Employee> employees) {
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setId(this.id);
        trainingProgram.setTitle(this.title);
        trainingProgram.setDescription(this.description);
        trainingProgram.setType(this.type);
        trainingProgram.setStartDate(this.startDate);
        trainingProgram.setEndDate(this.endDate);
        trainingProgram.setEmployees(employees);
        return trainingProgram;
    }
}
