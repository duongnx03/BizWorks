package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.ExamDTO;
import bizworks.backend.dtos.hrdepartment.QuestionDTO;
import bizworks.backend.dtos.hrdepartment.TrainingProgramDTO;
import bizworks.backend.services.humanresources.TrainingProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/training-programs")
@RequiredArgsConstructor
public class TrainingProgramController {
    private final TrainingProgramService trainingProgramService;

    @GetMapping
    public ResponseEntity<List<TrainingProgramDTO>> getAllTrainingPrograms() {
        List<TrainingProgramDTO> trainingPrograms = trainingProgramService.getAllTrainingPrograms().stream()
                .map(TrainingProgramDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(trainingPrograms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> getTrainingProgramById(@PathVariable Long id) {
        TrainingProgramDTO trainingProgramDTO = TrainingProgramDTO.from(trainingProgramService.getTrainingProgramById(id));
        return ResponseEntity.ok(trainingProgramDTO);
    }

    @PostMapping
    public ResponseEntity<TrainingProgramDTO> createTrainingProgram(@RequestBody TrainingProgramDTO trainingProgramDTO) {
        TrainingProgramDTO createdTrainingProgram = trainingProgramService.createTrainingProgram(trainingProgramDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrainingProgram);
    }

    @PutMapping("/{id}/employees")
    public ResponseEntity<TrainingProgramDTO> assignEmployeesToTrainingProgram(@PathVariable Long id, @RequestBody Set<Long> employeeIds) {
        try {
            TrainingProgramDTO updatedTrainingProgram = trainingProgramService.assignEmployees(id, employeeIds);
            return ResponseEntity.ok(updatedTrainingProgram);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> updateTrainingProgram(@PathVariable Long id, @RequestBody TrainingProgramDTO trainingProgramDTO) {
        TrainingProgramDTO updatedTrainingProgram = trainingProgramService.updateTrainingProgram(id, trainingProgramDTO);
        return ResponseEntity.ok(updatedTrainingProgram);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainingProgram(@PathVariable Long id) {
        trainingProgramService.deleteTrainingProgram(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/exams")
    public ResponseEntity<ExamDTO> addExamToTrainingProgram(@PathVariable Long id, @RequestBody ExamDTO examDTO) {
        ExamDTO createdExam = trainingProgramService.addExamToTrainingProgram(id, examDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExam);
    }

    @GetMapping("/{id}/exams")
    public ResponseEntity<List<ExamDTO>> getExamsByTrainingProgram(@PathVariable Long id) {
        List<ExamDTO> exams = trainingProgramService.getExamsByTrainingProgram(id);
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/exams/{examId}/questions")
    public ResponseEntity<QuestionDTO> createQuestion(@PathVariable Long examId, @RequestBody QuestionDTO questionDTO) {
        try {
            QuestionDTO createdQuestion = trainingProgramService.createQuestion(examId, questionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/exams/{examId}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByExam(@PathVariable Long examId) {
        List<QuestionDTO> questions = trainingProgramService.getQuestionsByExam(examId);
        return ResponseEntity.ok(questions);
    }

    @DeleteMapping("/exams/{examId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long examId, @PathVariable Long questionId) {
        trainingProgramService.deleteQuestion(examId, questionId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{trainingProgramId}/exams/{examId}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long trainingProgramId, @PathVariable Long examId) {
        try {
            trainingProgramService.deleteExam(trainingProgramId, examId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
