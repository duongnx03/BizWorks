package bizworks.backend.controllers;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Violation;
import bizworks.backend.services.ViolationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
public class ViolationController {
    private ViolationService violationService;

    public ViolationController(ViolationService violationService) {
        this.violationService = violationService;
    }

    @PostMapping("")
    public ResponseEntity<Violation> saveOrUpdateViolation(@RequestBody Violation violation) {
        Violation savedViolation = violationService.saveOrUpdateViolation(violation);
        return new ResponseEntity<>(savedViolation, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<Violation>> getAllViolations() {
        List<Violation> violations = violationService.getAllViolations();
        return new ResponseEntity<>(violations, HttpStatus.OK);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Violation>> getViolationsByEmployee(@PathVariable Long employeeId) {
        Employee employee = new Employee();
        employee.setId(employeeId);
        List<Violation> violations = violationService.getViolationsByEmployee(employee);
        return new ResponseEntity<>(violations, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViolation(@PathVariable Long id) {
        violationService.deleteViolation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
