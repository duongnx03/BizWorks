package com.example.bizwebsite.controllers;

import com.example.bizwebsite.dtos.PositionDTO;
import com.example.bizwebsite.models.Position;
import com.example.bizwebsite.services.PositionService;
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

    @GetMapping
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        List<PositionDTO> positions = positionService.getAllPositions();
        return new ResponseEntity<>(positions, HttpStatus.OK);
    }

    @GetMapping("/by-department")
    public ResponseEntity<List<PositionDTO>> getPositionsByDepartment(@RequestParam Long departmentId) {
        List<PositionDTO> positions = positionService.getPositionsByDepartment(departmentId);
        return new ResponseEntity<>(positions, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Position> getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Position> createPosition(@RequestBody PositionDTO positionDTO) {
        Position createdPosition = positionService.savePosition(positionDTO);
        return new ResponseEntity<>(createdPosition, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Position> updatePosition(@PathVariable Long id, @RequestBody Position positionDetails) {
        return ResponseEntity.ok(positionService.updatePosition(id, positionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }
}
