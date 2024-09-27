package bizworks.backend.controllers;

import bizworks.backend.dtos.ViolationComplaintDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.services.humanresources.ViolationComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/violation_complaints")
public class ViolationComplaintController {
    private final ViolationComplaintService violationComplaintService;

    public ViolationComplaintController(ViolationComplaintService violationComplaintService) {
        this.violationComplaintService = violationComplaintService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ViolationComplaintDTO>> createComplaint(@Valid @RequestBody ViolationComplaintDTO dto) {
        try {
            ViolationComplaintDTO created = violationComplaintService.createComplaint(dto);
            return ResponseEntity.ok(ApiResponse.success(created, "Complaint created successfully"));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while creating the complaint: " + e.getMessage(), "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ViolationComplaintDTO>>> getAllComplaints() {
        try {
            List<ViolationComplaintDTO> complaints = violationComplaintService.getAllComplaints();
            return ResponseEntity.ok(ApiResponse.success(complaints, "Complaints fetched successfully"));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while fetching complaints", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ViolationComplaintDTO>> getComplaintById(@PathVariable Long id) {
        try {
            ViolationComplaintDTO complaint = violationComplaintService.getComplaintById(id);
            if (complaint != null) {
                return ResponseEntity.ok(ApiResponse.success(complaint, "Complaint found"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notfound(null, "Complaint not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while fetching the complaint", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping("/exists/{violationId}")
    public ResponseEntity<Boolean> checkExistence(@PathVariable Long violationId) {
        boolean exists = violationComplaintService.existsByViolationId(violationId);
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ViolationComplaintDTO>> updateComplaint(@PathVariable Long id, @RequestBody ViolationComplaintDTO dto) {
        try {
            ViolationComplaintDTO updated = violationComplaintService.updateComplaint(id, dto);
            if (updated != null) {
                return ResponseEntity.ok(ApiResponse.success(updated, "Complaint updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notfound(null, "Complaint not found"));
            }
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(ApiResponse.errorServer(ex.getReason(), "BAD_REQUEST"));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while updating the complaint: " + e.getMessage(), "INTERNAL_SERVER_ERROR"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        try {
            violationComplaintService.deleteComplaint(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Complaint deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while deleting the complaint", "INTERNAL_SERVER_ERROR"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ViolationComplaintDTO>> updateStatus(@PathVariable Long id, @RequestParam String newStatus) {
        try {
            ViolationComplaintDTO updatedComplaint = violationComplaintService.updateStatus(id, newStatus);
            if (updatedComplaint != null) {
                return ResponseEntity.ok(ApiResponse.success(updatedComplaint, "Status updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notfound(null, "Complaint not found"));
            }
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(ApiResponse.errorServer(ex.getReason(), "BAD_REQUEST"));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while updating complaint status: " + e.getMessage(), "INTERNAL_SERVER_ERROR"));
        }
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
    }
}
