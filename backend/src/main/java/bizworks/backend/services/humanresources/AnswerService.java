    package bizworks.backend.services.humanresources;

    import bizworks.backend.dtos.hrdepartment.AnswerDTO;
    import bizworks.backend.models.Employee;
    import bizworks.backend.models.hrdepartment.Answer;
    import bizworks.backend.models.hrdepartment.Exam;
    import bizworks.backend.models.hrdepartment.Question;
    import bizworks.backend.repositories.EmployeeRepository;
    import bizworks.backend.repositories.hrdepartment.AnswerRepository;
    import bizworks.backend.repositories.hrdepartment.ExamRepository;
    import bizworks.backend.repositories.hrdepartment.QuestionRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class AnswerService {
        private final AnswerRepository answerRepository;
        private final EmployeeRepository employeeRepository;
        private final ExamRepository examRepository;
        private final QuestionRepository questionRepository;

        public AnswerDTO submitAnswer(AnswerDTO answerDTO) {
            Employee employee = employeeRepository.findById(answerDTO.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            Exam exam = examRepository.findById(answerDTO.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
            Question question = questionRepository.findById(answerDTO.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            if (answerRepository.existsByExamIdAndEmployeeId(answerDTO.getExamId(), answerDTO.getEmployeeId())) {
                throw new RuntimeException("Bài thi đã được gửi trước đó.");
            }

            Answer answer = answerDTO.toEntity();
            answer.setEmployee(employee);
            answer.setExam(exam);
            answer.setQuestion(question);

            Answer savedAnswer = answerRepository.save(answer);
            return AnswerDTO.from(savedAnswer);
        }

        public boolean hasSubmitted(Long examId, Long employeeId) {
            return answerRepository.existsByExamIdAndEmployeeId(examId, employeeId);
        }

        public Integer calculateTotalScore(Long examId, Long employeeId) {
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(() -> new RuntimeException("Exam not found"));

            List<Question> questions = exam.getQuestions().stream().collect(Collectors.toList());
            List<Answer> answers = answerRepository.findByExamIdAndEmployeeId(examId, employeeId);

            int totalScore = 0;

            for (Question question : questions) {
                for (Answer answer : answers) {
                    if (question.getId().equals(answer.getQuestion().getId())) {
                        if (question.getCorrectAnswer().equals(answer.getAnswerText())) {
                            totalScore += question.getPoints();
                        }
                    }
                }
            }
            return totalScore;
        }
    }
