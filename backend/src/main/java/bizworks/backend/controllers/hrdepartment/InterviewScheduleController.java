package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.InterviewScheduleDTO;
import bizworks.backend.models.hrdepartment.InterviewSchedule;
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
}
