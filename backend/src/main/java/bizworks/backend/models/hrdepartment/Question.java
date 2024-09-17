package bizworks.backend.models.hrdepartment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;  // Nội dung câu hỏi

    @Column(name = "is_multiple_choice")
    private Boolean isMultipleChoice;  // Xác định câu hỏi trắc nghiệm hay tự luận

    private String answerOptions;  // Các lựa chọn trả lời (dành cho trắc nghiệm)

    private String correctAnswer;  // Đáp án đúng
    private Integer points; // Điểm đạt được khi trả lời đúng

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;  // Liên kết với bài thi
}
