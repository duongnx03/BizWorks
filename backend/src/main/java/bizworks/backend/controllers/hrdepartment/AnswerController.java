    package bizworks.backend.controllers.hrdepartment;

    import bizworks.backend.dtos.hrdepartment.AnswerDTO;
    import bizworks.backend.services.humanresources.AnswerService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/answers")
    @RequiredArgsConstructor
    public class AnswerController {
        private final AnswerService answerService;

        @PostMapping
        public ResponseEntity<AnswerDTO> submitAnswer(@RequestBody AnswerDTO answerDTO) {
            try {
                AnswerDTO createdAnswer = answerService.submitAnswer(answerDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdAnswer);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }

        @GetMapping("/exams/{examId}/employees/{employeeId}/total-score")
        public ResponseEntity<Integer> getTotalScore(@PathVariable Long examId, @PathVariable Long employeeId) {
            try {
                Integer totalScore = answerService.calculateTotalScore(examId, employeeId);
                return ResponseEntity.ok(totalScore);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }

        @GetMapping("/exams/{examId}/employees/{employeeId}/check-submission")
        public ResponseEntity<Boolean> checkSubmission(@PathVariable Long examId, @PathVariable Long employeeId) {
            boolean hasSubmitted = answerService.hasSubmitted(examId, employeeId);
            return ResponseEntity.ok(hasSubmitted);
        }
    }
