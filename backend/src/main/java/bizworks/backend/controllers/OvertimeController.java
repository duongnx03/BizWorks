package bizworks.backend.controllers;

import bizworks.backend.dtos.OvertimeDTO;
import bizworks.backend.dtos.OvertimeRequestDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.Overtime;
import bizworks.backend.services.OvertimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/overtime")
@RequiredArgsConstructor
public class OvertimeController {
    private final OvertimeService overtimeService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createOvertime(@ModelAttribute OvertimeRequestDTO overtimeRequestDTO){
        try{
            overtimeService.createOvertime(overtimeRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Overtime registered successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<ApiResponse<?>> getByEmail() {
        try {
            List<Overtime> overtimes = overtimeService.findByEmployeeEmail();
            List<OvertimeDTO> overtimeDTOS = overtimes.stream().map(overtimeService::convertToDTO).collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(overtimeDTOS, "Get overtime successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByCensor")
    public ResponseEntity<ApiResponse<?>> getByCensor() {
        try {
            List<Overtime> overtimes = overtimeService.findByCensor();
            List<OvertimeDTO> overtimeDTOS = overtimes.stream().map(overtimeService::convertToDTO).collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(overtimeDTOS, "Get overtime successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByAttendanceId/{id}")
    public ResponseEntity<ApiResponse<?>> getByCensor(@PathVariable("id") Long id) {
        try {
            Overtime overtime = overtimeService.findByAttendanceId(id);
            OvertimeDTO overtimeDTO = overtimeService.convertToDTO(overtime);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(overtimeDTO, "Get overtime successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/approveRequest/{id}")
    public ResponseEntity<ApiResponse<?>> approveRequest(@PathVariable("id") Long id) {
        try {
            overtimeService.approve(id);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Approved overtime"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/rejectRequest/{id}")
    public ResponseEntity<ApiResponse<?>> rejectRequest(@PathVariable("id") Long id, @RequestParam("description") String description) {
        try {
            overtimeService.reject(id, description);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Rejected overtime"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}
