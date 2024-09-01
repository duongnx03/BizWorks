package bizwebsite.example.demo.controllers;

import bizwebsite.example.demo.dtos.PositionDTO;
import bizwebsite.example.demo.models.Position;
import bizwebsite.example.demo.services.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/positions")
public class PositionController {

    @Autowired
    private PositionService positionService;

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

    @GetMapping
    public ResponseEntity<List<Position>> listPositions() {
        List<Position> positions = positionService.listAllPositions();
        return ResponseEntity.ok(positions);
    }

    // If you need a separate endpoint for detailed information, consider changing
    // the path
    @GetMapping("/details/{id}")
    public ResponseEntity<Position> getPositionDetails(@PathVariable Long id) {
        Position position = positionService.getPositionById(id);
        return ResponseEntity.ok(position);
    }
}
