package bizworks.backend.controllers;

import bizworks.backend.dtos.ViolationTypeDTO;
import bizworks.backend.services.ViolationTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violation-types")
public class ViolationTypeController {
    private final ViolationTypeService violationTypeService;

    public ViolationTypeController(ViolationTypeService violationTypeService) {
        this.violationTypeService = violationTypeService;
    }

    @PostMapping
    public ResponseEntity<ViolationTypeDTO> createViolationType(@RequestBody ViolationTypeDTO dto) {
        ViolationTypeDTO created = violationTypeService.createViolationType(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ViolationTypeDTO>> getAllViolationTypes() {
        List<ViolationTypeDTO> types = violationTypeService.getAllViolationTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViolationTypeDTO> getViolationTypeById(@PathVariable Long id) {
        ViolationTypeDTO type = violationTypeService.getViolationTypeById(id);
        return type != null ? ResponseEntity.ok(type) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViolationTypeDTO> updateViolationType(@PathVariable Long id, @RequestBody ViolationTypeDTO dto) {
        ViolationTypeDTO updated = violationTypeService.updateViolationType(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViolationType(@PathVariable Long id) {
        violationTypeService.deleteViolationType(id);
        return ResponseEntity.ok().build();
    }
}
