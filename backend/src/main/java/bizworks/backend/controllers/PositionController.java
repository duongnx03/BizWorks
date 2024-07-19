package com.example.projects.controllers;


import com.example.projects.dtos.DepartmentDTO;
import com.example.projects.dtos.PositionDTO;
import com.example.projects.models.Position;
import com.example.projects.services.PositionService;
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
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        List<PositionDTO> positions = positionService.getAllPositions();
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
