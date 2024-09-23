/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/RestController.java to edit this template
 */
package bizworks.backend.controllers;

import bizworks.backend.dtos.LeaveRequestDTO;
import bizworks.backend.dtos.SearchDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.Employee;
import bizworks.backend.models.LeaveRequest;
import bizworks.backend.services.EmployeeService;
import bizworks.backend.services.LeaveRequestService;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author PC
 */
@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/all")
    public List<LeaveRequestDTO> getAllLeaveRequests() {
        return leaveRequestService.getAllLeaveRequests();
    }

    @GetMapping("/getLeaveRequestById/{id}")
    public LeaveRequestDTO getLeaveRequestById(@PathVariable Long id) {
        return leaveRequestService.getLeaveRequestById(id).orElse(null);
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<?>> allLeaveRequestsByEmployee() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Employee employee = employeeService.findByEmail(email);
            Long empId = employee.getId();
            List<LeaveRequestDTO> leaveRequests = leaveRequestService.allLeaveRequestsByEmployee(empId);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(leaveRequests, "Get leave requests successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendLeaveRequest(@RequestBody LeaveRequestDTO leaveRequestDTO) {
        try {
            LeaveRequestDTO createdLeaveRequest = leaveRequestService.sendLeaveRequest(leaveRequestDTO);
            return new ResponseEntity<>(createdLeaveRequest, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<LeaveRequest> approveLeaveRequest(
            @PathVariable Long id
    ) {
        LeaveRequest leaveRequest = leaveRequestService.approveLeaveRequest(id);
        return ResponseEntity.ok(leaveRequest);
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<LeaveRequest> rejectLeaveRequest(
            @PathVariable Long id
    ) {
        LeaveRequest leaveRequest = leaveRequestService.rejectLeaveRequest(id);
        return ResponseEntity.ok(leaveRequest);
    }

    @GetMapping("/remaining-leave-days/{emp_id}")
    public Integer getRemainingLeaveDays(@PathVariable Long emp_id) {
        return leaveRequestService.calculateRemainingLeaveDays(emp_id).orElse(null);
    }

    @PostMapping("/search")
    public ResponseEntity<List<LeaveRequestDTO>> searchLeaveRequests(@RequestBody SearchDTO searchDto) {
        List<LeaveRequestDTO> results = leaveRequestService.searchLeaveRequests(searchDto);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getLeaveStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
            @RequestParam(required = false) String leaveType,
            @RequestParam(required = false) String employeeName,
            @RequestParam(required = false) String status) {

        List<LeaveRequestDTO> leaveRequests = leaveRequestService.searchLeaveRequests(new SearchDTO(startDate, endDate, leaveType, employeeName, status));
        Map<String, Long> leaveDaysPerEmployee = leaveRequestService.calculateTotalLeaveDays(leaveRequests);
        Map<String, Long> leaveTypeCounts = leaveRequestService.countLeaveRequestsByType(leaveRequests);

        Map<String, Object> response = new HashMap<>();
        response.put("leaveDaysPerEmployee", leaveDaysPerEmployee);
        response.put("leaveTypeCounts", leaveTypeCounts);

        return ResponseEntity.ok(response);
    }


}
