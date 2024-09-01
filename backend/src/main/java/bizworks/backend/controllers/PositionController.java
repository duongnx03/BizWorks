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
@CrossOrigin(origins = "http://localhost:3000")
public class PositionController {

    @Autowired
    private PositionService positionService;

    // Get all positions
    @GetMapping
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        List<PositionDTO> positions = positionService.getAllPositions();
        return new ResponseEntity<>(positions, HttpStatus.OK);
    }

    // Get positions by department ID
    @GetMapping("/by-department")
    public ResponseEntity<List<PositionDTO>> getPositionsByDepartment(@RequestParam Long departmentId) {
        List<PositionDTO> positions = positionService.getPositionsByDepartment(departmentId);
        return new ResponseEntity<>(positions, HttpStatus.OK);
    }

    // Get a position by ID
    @GetMapping("/{id}")
    public ResponseEntity<PositionDTO> getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id)
                .map(position -> ResponseEntity.ok(positionService.convertToDTO(position)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new position
    @PostMapping
    public ResponseEntity<PositionDTO> createPosition(@RequestBody PositionDTO positionDTO) {
        Position createdPosition = positionService.savePosition(positionDTO);
        return new ResponseEntity<>(positionService.convertToDTO(createdPosition), HttpStatus.CREATED);
    }

    // Update an existing position
    @PutMapping("/{id}")
    public ResponseEntity<PositionDTO> updatePosition(@PathVariable Long id, @RequestBody PositionDTO positionDTO) {
        Position updatedPosition = positionService.updatePosition(id, positionDTO);
        return ResponseEntity.ok(positionService.convertToDTO(updatedPosition));
    }

    // Delete a position
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }
}
