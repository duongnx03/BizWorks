package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.TrainingProgramDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import bizworks.backend.models.hrdepartment.AttendanceTrainingProgram;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.services.UserService;
import bizworks.backend.services.humanresources.TrainingProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/training-programs")
public class TrainingProgramController {

    @Autowired
    private TrainingProgramService trainingProgramService;
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<TrainingProgramDTO>> getAllTrainingPrograms() {
        List<TrainingProgramDTO> trainingPrograms = trainingProgramService.getAllTrainingPrograms();
        return ResponseEntity.ok(trainingPrograms);
    }
    @PostMapping
    public ResponseEntity<TrainingProgram> createTrainingProgram(@RequestBody TrainingProgramDTO dto) {
        return ResponseEntity.status(201).body(trainingProgramService.createTrainingProgram(dto));
    }
    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> getTrainingProgramById(@PathVariable Long id) {
        TrainingProgramDTO dto = trainingProgramService.getTrainingProgramById(id);
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/leaders")
    public ResponseEntity<List<User>> getLeaders() {
        return ResponseEntity.ok(trainingProgramService.getLeaders());
    }

    @GetMapping("/managers")
    public ResponseEntity<List<User>> getManagers() {
        List<User> managers = userService.findByRole("MANAGE");
        return ResponseEntity.ok(managers);
    }
    @GetMapping("/attendance/employee/{employeeId}")
    public ResponseEntity<List<AttendanceTrainingProgram>> getAttendanceByEmployeeId(@PathVariable Long employeeId) {
        List<AttendanceTrainingProgram> attendanceList = trainingProgramService.getAttendanceByEmployeeId(employeeId);
        return ResponseEntity.ok(attendanceList);
    }
    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgram> updateTrainingProgram(@PathVariable Long id, @RequestBody TrainingProgramDTO dto) {
        return ResponseEntity.ok(trainingProgramService.updateTrainingProgram(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainingProgram(@PathVariable Long id) {
        trainingProgramService.deleteTrainingProgram(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/new-employees")
    public ResponseEntity<List<Employee>> getNewEmployees() {
        return ResponseEntity.ok(trainingProgramService.getNewEmployees());
    }
    @PostMapping("/{programId}/attendance/{employeeId}")
    public ResponseEntity<Void> recordAttendance(
            @PathVariable Long programId,
            @PathVariable Long employeeId,
            @RequestParam LocalDate attendanceDate) {
        trainingProgramService.recordAttendance(programId, employeeId, attendanceDate);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{programId}/attendance")
    public ResponseEntity<List<AttendanceTrainingProgram>> getAttendance(@PathVariable Long programId) {
        List<AttendanceTrainingProgram> attendanceList = trainingProgramService.getAttendanceByProgramId(programId);
        return ResponseEntity.ok(attendanceList);
    }

}