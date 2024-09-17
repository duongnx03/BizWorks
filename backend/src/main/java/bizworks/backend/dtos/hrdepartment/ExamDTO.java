package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.models.hrdepartment.Exam;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamDTO {
    private Long id;
    private String subjectName;
    private LocalDateTime examDateTime;  // Ngày và giờ thi
    private String location;
    private String examDuration;

    public static ExamDTO from(Exam exam) {
        if (exam == null) {
            return null;
        }
        return ExamDTO.builder()
                .id(exam.getId())
                .subjectName(exam.getSubjectName())
                .examDateTime(exam.getExamDateTime())
                .location(exam.getLocation())
                .examDuration(exam.getExamDuration())
                .build();
    }

    public Exam toEntity(TrainingProgram trainingProgram) {
        Exam exam = new Exam();
        exam.setId(this.id);
        exam.setSubjectName(this.subjectName);
        exam.setExamDateTime(this.examDateTime);
        exam.setLocation(this.location);
        exam.setExamDuration(this.examDuration);
        exam.setTrainingProgram(trainingProgram);
        return exam;
    }
}
