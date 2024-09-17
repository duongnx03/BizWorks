package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.ExamDTO;
import bizworks.backend.dtos.hrdepartment.QuestionDTO;
import bizworks.backend.dtos.hrdepartment.TrainingProgramDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.hrdepartment.Exam;
import bizworks.backend.models.hrdepartment.Question;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.hrdepartment.ExamRepository;
import bizworks.backend.repositories.hrdepartment.QuestionRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramRepository;
import bizworks.backend.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingProgramService {
    private final TrainingProgramRepository trainingProgramRepository;
    private final EmployeeRepository employeeRepository;
    private final EmailService emailService;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public List<TrainingProgram> getAllTrainingPrograms() {
        return trainingProgramRepository.findAll();
    }

    public TrainingProgram getTrainingProgramById(Long id) {
        return trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TrainingProgram not found"));
    }

    public TrainingProgramDTO createTrainingProgram(TrainingProgramDTO trainingProgramDTO) {
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setTitle(trainingProgramDTO.getTitle());
        trainingProgram.setDescription(trainingProgramDTO.getDescription());
        trainingProgram.setType(trainingProgramDTO.getType());
        trainingProgram.setStartDate(trainingProgramDTO.getStartDate());
        trainingProgram.setEndDate(trainingProgramDTO.getEndDate());

        // Save the new training program
        TrainingProgram savedTrainingProgram = trainingProgramRepository.save(trainingProgram);

        return TrainingProgramDTO.from(savedTrainingProgram);
    }

    public TrainingProgramDTO updateTrainingProgram(Long id, TrainingProgramDTO trainingProgramDTO) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TrainingProgram not found"));

        trainingProgram.setTitle(trainingProgramDTO.getTitle());
        trainingProgram.setDescription(trainingProgramDTO.getDescription());
        trainingProgram.setType(trainingProgramDTO.getType());
        trainingProgram.setStartDate(trainingProgramDTO.getStartDate());
        trainingProgram.setEndDate(trainingProgramDTO.getEndDate());

        TrainingProgram updatedTrainingProgram = trainingProgramRepository.save(trainingProgram);
        return TrainingProgramDTO.from(updatedTrainingProgram);
    }

    public TrainingProgramDTO assignEmployees(Long id, Set<Long> employeeIds) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TrainingProgram not found"));

        Set<Employee> employees = getEmployeesFromIds(employeeIds);

        if (employees.isEmpty()) {
            throw new RuntimeException("No employees found with the provided IDs");
        }

        trainingProgram.setEmployees(employees);
        TrainingProgram updatedTrainingProgram = trainingProgramRepository.save(trainingProgram);

        for (Employee employee : employees) {
            String emailContent = "Dear " + employee.getFullname() + ",\n\n"
                    + "You have been assigned to the training program: " + trainingProgram.getTitle() + "\n"
                    + "Description: " + trainingProgram.getDescription() + "\n"
                    + "Type: " + trainingProgram.getType() + "\n"
                    + "Please follow the schedule once it is available.";
            emailService.sendEmail(employee.getEmail(), "Training Program Assignment", emailContent);
        }

        return TrainingProgramDTO.from(updatedTrainingProgram);
    }

    public void deleteTrainingProgram(Long id) {
        trainingProgramRepository.deleteById(id);
    }

    public ExamDTO addExamToTrainingProgram(Long trainingProgramId, ExamDTO examDTO) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(trainingProgramId)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));

        Exam exam = examDTO.toEntity(trainingProgram);
        Exam savedExam = examRepository.save(exam);

        trainingProgram.getExams().add(savedExam);
        trainingProgramRepository.save(trainingProgram);

        return ExamDTO.from(savedExam);
    }

    public List<ExamDTO> getExamsByTrainingProgram(Long trainingProgramId) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(trainingProgramId)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));

        return trainingProgram.getExams().stream()
                .map(ExamDTO::from)
                .collect(Collectors.toList());
    }

    public QuestionDTO createQuestion(Long examId, QuestionDTO questionDTO) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (questionDTO.getIsMultipleChoice() && (questionDTO.getAnswerOptions() == null || questionDTO.getAnswerOptions().isEmpty())) {
            throw new RuntimeException("Answer options are required for multiple choice questions");
        }

        Question question = questionDTO.toEntity(exam);

        Question savedQuestion = questionRepository.save(question);

        return QuestionDTO.from(savedQuestion);
    }

    public List<QuestionDTO> getQuestionsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        return exam.getQuestions().stream()
                .map(QuestionDTO::from)
                .collect(Collectors.toList());
    }

    public void deleteQuestion(Long examId, Long questionId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        exam.getQuestions().remove(question);
        examRepository.save(exam);

        questionRepository.delete(question);
    }

    public void deleteExam(Long trainingProgramId, Long examId) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(trainingProgramId)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Remove the exam from the training program
        trainingProgram.getExams().remove(exam);
        trainingProgramRepository.save(trainingProgram);

        // Delete the exam
        examRepository.delete(exam);
    }

    private Set<Employee> getEmployeesFromIds(Set<Long> employeeIds) {
        Set<Employee> employees = new HashSet<>();
        if (employeeIds != null) {
            for (Long employeeId : employeeIds) {
                Optional<Employee> employee = employeeRepository.findById(employeeId);
                employee.ifPresent(employees::add);
            }
        }
        return employees;
    }
}
