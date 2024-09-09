package bizworks.backend.controllers;

import bizworks.backend.dtos.MissedCheckOutHandlingDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.services.MissedCheckOutHandlingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/missedCheckOut/")
@RequiredArgsConstructor
public class MissedCheckOutHandlingController {
    private final MissedCheckOutHandlingService missedCheckOutHandlingService;

    @PostMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<?>> approve(@PathVariable("id") Long id, @RequestParam("checkOutTime") LocalDateTime checkOutTime) {
        try {
            missedCheckOutHandlingService.approve(id, checkOutTime);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Create Miss Checkout successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<?>> findAll() {
        try {
            List<MissedCheckOutHandlingDTO> missedCheckOutHandlingDTOS = missedCheckOutHandlingService.findAll();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(missedCheckOutHandlingDTOS, "All Miss Checkout records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<ApiResponse<?>> findByEmail() {
        try {
            List<MissedCheckOutHandlingDTO> missedCheckOutHandlingDTOS = missedCheckOutHandlingService.findByEmail();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(missedCheckOutHandlingDTOS, "All Miss Checkout records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}
