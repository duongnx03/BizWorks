package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.ExtracurricularActivityDTO;
import bizworks.backend.dtos.hrdepartment.RegistrationRequestDTO;
import bizworks.backend.services.humanresources.ExtracurricularActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extracurricular-activities")
public class ExtracurricularActivityController {

    @Autowired
    private ExtracurricularActivityService activityService;

    @GetMapping
    public ResponseEntity<List<ExtracurricularActivityDTO>> getAllActivities() {
        List<ExtracurricularActivityDTO> activities = activityService.getAllActivities();
        return ResponseEntity.ok(activities);
    }

    @PostMapping
    public ResponseEntity<ExtracurricularActivityDTO> createActivity(@RequestBody ExtracurricularActivityDTO dto) {
        ExtracurricularActivityDTO createdActivity = activityService.createActivity(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdActivity);
    }


    @PostMapping("/{activityId}/register/{employeeId}")
    public ResponseEntity<RegistrationRequestDTO> registerEmployee(@PathVariable Long activityId, @PathVariable Long employeeId) {
        RegistrationRequestDTO updatedRequest = activityService.registerEmployee(activityId, employeeId);
        return ResponseEntity.ok(updatedRequest);
    }

    @PostMapping("/registration-requests/{requestId}/approve")
    public ResponseEntity<RegistrationRequestDTO> approveRegistration(@PathVariable Long requestId) {
        RegistrationRequestDTO updatedRequest = activityService.approveRegistration(requestId);
        return ResponseEntity.ok(updatedRequest);
    }

    @PostMapping("/registration-requests/{requestId}/reject")
    public ResponseEntity<RegistrationRequestDTO> rejectRegistration(@PathVariable Long requestId) {
        RegistrationRequestDTO updatedRequest = activityService.rejectRegistration(requestId);
        return ResponseEntity.ok(updatedRequest);
    }
}
