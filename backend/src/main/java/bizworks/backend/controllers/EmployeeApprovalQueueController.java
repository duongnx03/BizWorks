package bizworks.backend.controllers;

import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.EmployeeApprovalQueue;
import bizworks.backend.services.EmployeeApprovalQueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emp-queue")
@RequiredArgsConstructor
public class EmployeeApprovalQueueController {
    private final EmployeeApprovalQueueService employeeApprovalQueueService;

    @GetMapping("/getByCensor")
    public ResponseEntity<ApiResponse<?>> getByCensor() {
        try {
            List<EmployeeApprovalQueue> employeeApprovalQueues = employeeApprovalQueueService.findByCensor();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeApprovalQueues, "Get emp successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getBySender")
    public ResponseEntity<ApiResponse<?>> getBySender() {
        try {
            List<EmployeeApprovalQueue> employeeApprovalQueues = employeeApprovalQueueService.findBySender();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeApprovalQueues, "Get emp successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByManage")
    public ResponseEntity<ApiResponse<?>> getByManage() {
        try {
            List<EmployeeApprovalQueue> employeeApprovalQueues = employeeApprovalQueueService.findByIsManageShow();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeApprovalQueues, "Get emp successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}

