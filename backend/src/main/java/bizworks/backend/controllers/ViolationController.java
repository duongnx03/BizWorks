package bizworks.backend.controllers;

import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.Violation;
import bizworks.backend.services.ViolationService;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
public class ViolationController {
    private final ViolationService violationService;

    public ViolationController(ViolationService violationService) {
        this.violationService = violationService;
    }

    @PostMapping
    public ResponseEntity<ViolationDTO> createViolation(@RequestBody ViolationDTO dto) {
        ViolationDTO created = violationService.createViolation(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ViolationDTO>> getAllViolations() {
        List<ViolationDTO> violations = violationService.getAllViolations();
        return ResponseEntity.ok(violations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViolationDTO> getViolationById(@PathVariable Long id) {
        ViolationDTO violation = violationService.getViolationById(id);
        return violation != null ? ResponseEntity.ok(violation) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViolationDTO> updateViolation(@PathVariable Long id, @RequestBody ViolationDTO dto) {
        ViolationDTO updated = violationService.updateViolation(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViolation(@PathVariable Long id) {
        violationService.deleteViolation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ViolationDTO>> searchViolations(@RequestParam String employeeName) {
        List<ViolationDTO> violations = violationService.searchViolationsByEmployeeName(employeeName);
        return ResponseEntity.ok(violations);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<ViolationDTO>> sortViolations(@RequestParam String direction) {
        Sort.Direction dir = Sort.Direction.fromString(direction);
        List<ViolationDTO> violations = violationService.sortViolationsByDate(dir);
        return ResponseEntity.ok(violations);
    }
}
