package bizworks.backend.controllers;

import bizworks.backend.dtos.PositionDTO;
import bizworks.backend.models.Position;
import bizworks.backend.services.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionController {

    @Autowired
    private PositionService positionService;

    @GetMapping
    public ResponseEntity<List<Position>> getAllPositions() {
        try {
            List<Position> positions = positionService.getAllPositions();
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Hoặc xử lý lỗi chi tiết hơn
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Position> getPositionById(@PathVariable Long id) {
        Position position = positionService.findById(id);
        return ResponseEntity.ok(position);
    }

    @PostMapping
    public ResponseEntity<Position> createPosition(@RequestBody PositionDTO positionDTO) {
        Position position = positionService.createPosition(positionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(position);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Position> updatePosition(@PathVariable Long id, @RequestBody PositionDTO positionDTO) {
        Position position = positionService.updatePosition(id, positionDTO);
        return ResponseEntity.ok(position);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{positionId}/assign/{employeeId}")
    public ResponseEntity<Void> assignPositionToEmployee(@PathVariable Long positionId, @PathVariable Long employeeId) {
        positionService.assignPositionToEmployee(positionId, employeeId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Position>> getPositionsByDepartmentId(@PathVariable Long departmentId) {
        List<Position> positions = positionService.getPositionsByDepartmentId(departmentId);
        return ResponseEntity.ok(positions);
    }
    @GetMapping("/list")
    public ResponseEntity<List<Position>> listPositions() {
        List<Position> positions = positionService.listAllPositions();
        return ResponseEntity.ok(positions);
    }
    @GetMapping("/by-department")
    public ResponseEntity<List<PositionDTO>> getPositionsByDepartment(@RequestParam Long departmentId) {
        List<PositionDTO> positions = positionService.findByDepartment(departmentId);
        return ResponseEntity.ok(positions);
    }
    @GetMapping("/details/{id}")
    public ResponseEntity<Position> getPositionDetails(@PathVariable Long id) {
        Position position = positionService.getPositionById(id);
        return ResponseEntity.ok(position);
    }
}
