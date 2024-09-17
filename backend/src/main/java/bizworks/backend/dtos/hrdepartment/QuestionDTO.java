package bizworks.backend.dtos.hrdepartment;

import bizworks.backend.models.hrdepartment.Exam;
import bizworks.backend.models.hrdepartment.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private String questionText;
    private Boolean isMultipleChoice;
    private String answerOptions;
    private String correctAnswer;
    private Integer points;

    public static QuestionDTO from(Question question) {
        if (question == null) {
            return null;
        }
        return QuestionDTO.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .isMultipleChoice(question.getIsMultipleChoice())
                .answerOptions(question.getAnswerOptions()) // Giữ nguyên định dạng chuỗi phân cách
                .correctAnswer(question.getCorrectAnswer())
                .points(question.getPoints())
                .build();
    }

    public Question toEntity(Exam exam) {
        Question question = new Question();
        question.setId(this.id);
        question.setQuestionText(this.questionText);
        question.setIsMultipleChoice(this.isMultipleChoice);
        question.setAnswerOptions(this.answerOptions);
        question.setCorrectAnswer(this.correctAnswer);
        question.setPoints(this.points);
        question.setExam(exam);
        return question;
    }
}
