package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.models.hrdepartment.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
    private Long id;
    private String answerText;
    private Long employeeId;
    private Long questionId;
    private Long examId;
    private Integer totalPoints;  // Total points achieved
    private String evaluationMessage;  // Evaluation message

    public static AnswerDTO from(Answer answer) {
        if (answer == null) {
            return null;
        }
        return AnswerDTO.builder()
                .id(answer.getId())
                .answerText(answer.getAnswerText())
                .employeeId(answer.getEmployee().getId())
                .questionId(answer.getQuestion().getId())
                .examId(answer.getExam().getId())
                .build();
    }

    public Answer toEntity() {
        Answer answer = new Answer();
        answer.setId(this.id);
        answer.setAnswerText(this.answerText);
        // Load other associations if needed
        return answer;
    }
}
