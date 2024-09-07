package bizworks.backend.controllers;

import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.services.humanresources.ViolationService;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import bizworks.backend.helpers.ApiResponse;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
public class ViolationController {
    private final ViolationService violationService;

    public ViolationController(ViolationService violationService) {
        this.violationService = violationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ViolationDTO>> createViolation(@RequestBody ViolationDTO dto) {
        try {
            ViolationDTO created = violationService.createViolation(dto);
            return ResponseEntity.ok(ApiResponse.success(created, "Violation created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while creating the violation", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ViolationDTO>>> getAllViolations() {
        try {
            List<ViolationDTO> violations = violationService.getAllViolations();
            return ResponseEntity.ok(ApiResponse.success(violations, "Violations fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while fetching violations", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ViolationDTO>> getViolationById(@PathVariable Long id) {
        try {
            ViolationDTO violation = violationService.getViolationById(id);
            if (violation != null) {
                return ResponseEntity.ok(ApiResponse.success(violation, "Violation found"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notfound(null, "Violation not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while fetching the violation", "INTERNAL_SERVER_ERROR"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ViolationDTO>> updateViolation(@PathVariable Long id, @RequestBody ViolationDTO dto) {
        try {
            ViolationDTO updated = violationService.updateViolation(id, dto);
            if (updated != null) {
                return ResponseEntity.ok(ApiResponse.success(updated, "Violation updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notfound(null, "Violation not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while updating the violation", "INTERNAL_SERVER_ERROR"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteViolation(@PathVariable Long id) {
        try {
            violationService.deleteViolation(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Violation deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while deleting the violation", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ViolationDTO>>> searchViolations(@RequestParam String employeeName) {
        try {
            List<ViolationDTO> violations = violationService.searchViolationsByEmployeeName(employeeName);
            return ResponseEntity.ok(ApiResponse.success(violations, "Search results"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while searching violations", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping("/sort")
    public ResponseEntity<ApiResponse<List<ViolationDTO>>> sortViolationsByDate(@RequestParam Sort.Direction direction) {
        try {
            List<ViolationDTO> violations = violationService.sortViolationsByDate(direction);
            return ResponseEntity.ok(ApiResponse.success(violations, "Violations sorted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while sorting violations", "INTERNAL_SERVER_ERROR"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateViolationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            violationService.updateViolationStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success(null, "Violation status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while updating violation status", "INTERNAL_SERVER_ERROR"));
        }
    }
}
