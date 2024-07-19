package aptech.project.controllers;

import aptech.project.helpers.ApiResponse;
import aptech.project.models.Attendance;
import aptech.project.models.Employee;
import aptech.project.services.AttendanceService;
import aptech.project.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/attendance")
    public ResponseEntity<ApiResponse<?>> attendance(@RequestBody Attendance attendance) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Employee employee = employeeService.findByEmail(email);
            attendance.setCheckInTime(LocalDateTime.now());
            attendance.setCheckOutTime(null);
            attendance.setAttendanceDate(LocalDate.now());
            attendance.setPresent(false);
            attendance.setEmployee(employee);
            Attendance createAttendance = attendanceService.save(attendance);
            if (createAttendance != null){
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createAttendance, "Create attendance successfully"));
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Error when taking attendance", "BAD_REQUEST"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}
