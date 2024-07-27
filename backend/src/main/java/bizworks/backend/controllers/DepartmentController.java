package com.example.bizwebsite.controllers;

import com.example.bizwebsite.dtos.DepartmentDTO;
import com.example.bizwebsite.models.Department;
import com.example.bizwebsite.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartments();
        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable Long id) {
        DepartmentDTO departmentDTO = departmentService.getDepartmentById(id);
        if (departmentDTO != null) {
            return ResponseEntity.ok(departmentDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<DepartmentDTO> createDepartment(@RequestBody DepartmentDTO departmentDTO) {
        // Attempt to save the department
        Optional<Department> createdDepartmentOpt = departmentService.saveDepartment(departmentDTO);

        // Check if the department was successfully created
        if (createdDepartmentOpt.isPresent()) {
            // Convert to DTO and return with HTTP 201 Created
            DepartmentDTO departmentDTOResponse = departmentService.convertToDTO(createdDepartmentOpt.get());
            return new ResponseEntity<>(departmentDTOResponse, HttpStatus.CREATED);
        } else {
            // Return with HTTP 409 Conflict if the department already exists
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> updateDepartment(@PathVariable Long id,
            @RequestBody DepartmentDTO departmentDTO) {
        Department updatedDepartment = departmentService.updateDepartment(id, departmentDTO);
        return ResponseEntity.ok(departmentService.convertToDTO(updatedDepartment));
    }

}
