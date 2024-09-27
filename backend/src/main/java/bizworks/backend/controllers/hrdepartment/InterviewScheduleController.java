package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.InterviewScheduleDTO;
import bizworks.backend.dtos.hrdepartment.InterviewStatusRequest;
import bizworks.backend.models.hrdepartment.InterviewSchedule;
import bizworks.backend.models.hrdepartment.InterviewStatus;
import bizworks.backend.services.humanresources.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview-schedules")
public class InterviewScheduleController {
    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<InterviewScheduleDTO> createInterviewSchedule(@RequestBody InterviewScheduleDTO interviewScheduleDTO) {
        InterviewScheduleDTO createdSchedule = jobApplicationService.createInterviewSchedule(interviewScheduleDTO);
        return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
    }
    @GetMapping
    public List<InterviewSchedule> getAllInterviewSchedules() {
        return jobApplicationService.getAllInterviewSchedules();
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewScheduleDTO> updateInterviewScheduleStatus(
            @PathVariable Long id,
            @RequestBody InterviewStatusRequest request) { // Sử dụng InterviewStatusRequest
        InterviewStatus newStatus = request.getStatus(); // Lấy trạng thái từ request
        InterviewScheduleDTO updatedSchedule = jobApplicationService.updateInterviewScheduleStatus(id, newStatus);
        return ResponseEntity.ok(updatedSchedule);
    }
    @GetMapping("/completed")
    public ResponseEntity<List<InterviewScheduleDTO>> getCompletedInterviewSchedules() {
        List<InterviewScheduleDTO> completedSchedules = jobApplicationService.getCompletedInterviewSchedules();
        return ResponseEntity.ok(completedSchedules);
    }
}
