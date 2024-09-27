package bizworks.backend.controllers;

import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.services.humanresources.ViolationService;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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
        } catch (AccessDeniedException ex) {
            // Trả về lỗi 403 Forbidden nếu gặp lỗi AccessDeniedException
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (IllegalArgumentException ex) {
            // Trả về lỗi 400 Bad Request nếu nhân viên đã có vi phạm tương tự trong ngày
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "BAD_REQUEST"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while creating the violation: " + e.getMessage(), "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ViolationDTO>>> getAllViolations() {
        try {
            // Lấy danh sách violation với logic phân quyền trong service
            List<ViolationDTO> violations = violationService.getAllViolations();
            return ResponseEntity.ok(ApiResponse.success(violations, "Violations fetched successfully"));
        } catch (AccessDeniedException ex) {
            // Trường hợp người dùng không có quyền truy cập
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            // Các lỗi khác (nội bộ server)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while fetching violations", "INTERNAL_SERVER_ERROR"));
        }
    }

    @GetMapping("/user")
    public List<ViolationDTO> getAllViolationsByUser() {
        // Gọi service để lấy danh sách violations của user đang đăng nhập
        return violationService.getAllViolationsByUser();
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
                // Trường hợp không tìm thấy vi phạm
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notfound(null, "Violation not found"));
            }
        } catch (AccessDeniedException ex) {
            // Xử lý khi người dùng không có quyền truy cập
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (IllegalArgumentException ex) {
            // Xử lý khi có lỗi đầu vào (ví dụ: số lần cập nhật vượt quá giới hạn)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "BAD_REQUEST"));
        } catch (Exception e) {
            // Xử lý các lỗi không mong muốn khác
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
        } catch (IllegalArgumentException ex) {
            // Nếu vi phạm giới hạn số lần cập nhật, trả về lỗi 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "LIMIT_REACHED"));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer("An error occurred while updating violation status", "INTERNAL_SERVER_ERROR"));
        }
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.errorClient(null, ex.getMessage(), "FORBIDDEN"));
    }
}
