package bizworks.backend.controllers;

import bizworks.backend.dtos.AttendanceDTO;
import bizworks.backend.dtos.AttendanceReportDTO;
import bizworks.backend.dtos.AttendanceSummaryDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.Attendance;
import bizworks.backend.services.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/checkIn")
    public ResponseEntity<ApiResponse<?>> checkIn() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Attendance attendance = attendanceService.checkIn(email);
            AttendanceDTO attendanceDTO = attendanceService.convertToDTO(attendance);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTO, "CheckIn successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/checkOut")
    public ResponseEntity<ApiResponse<?>> checkOut() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Attendance attendance = attendanceService.checkOut(email);
            AttendanceDTO attendanceDTO = attendanceService.convertToDTO(attendance);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTO, "Check out success"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<ApiResponse<?>> findByEmail() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            List<AttendanceDTO> attendanceDTOs = attendanceService.getAttendancesByEmployeeEmail(email).stream()
                    .map(attendanceService::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTOs, "Attendance records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByDate")
    public ResponseEntity<ApiResponse<?>> findByDate() {
        try {
            List<AttendanceDTO> attendanceDTOs = attendanceService.getAttendancesByAttendanceDate().stream()
                    .map(attendanceService::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTOs, "Attendance records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByEmailAndDate")
    public ResponseEntity<ApiResponse<?>> findByEmailAndDate() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Attendance attendance = attendanceService.getByEmailAndDate(email);
            AttendanceDTO attendanceDTO = attendanceService.convertToDTO(attendance);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTO, "Attendance record retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<?>> findAll() {
        try {
            List<AttendanceDTO> attendanceDTOs = attendanceService.findAll().stream()
                    .map(attendanceService::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTOs, "All attendance records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByMonth")
    public ResponseEntity<ApiResponse<?>> findByMonth() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            List<AttendanceDTO> attendanceDTOs = attendanceService.getAttendancesFromStartOfMonth(email).stream()
                    .map(attendanceService::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTOs, "All attendance by month records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getForMonth")
    public ResponseEntity<ApiResponse<?>> findForMonth(@RequestParam int month, @RequestParam int year) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            List<AttendanceDTO> attendanceDTOs = attendanceService.getAttendancesForMonth(email, month, year).stream()
                    .map(attendanceService::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTOs, "All attendance by month records retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/totalWorkAndOvertime")
    public ResponseEntity<ApiResponse<?>> getTotalWorkAndOvertime() {
        try {
            LocalDate inputDate = LocalDate.now().minusDays(1);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            AttendanceReportDTO workAndOvertime = attendanceService.getTotalWorkAndOvertime(email, inputDate);

            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(workAndOvertime, "Total work and overtime retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/markAbsent")
    public ResponseEntity<ApiResponse<?>> markAbsentEmployees() {
        try {
            List<Attendance> absentAttendances = attendanceService.markAbsentEmployees();
            List<AttendanceDTO> attendanceDTOs = absentAttendances.stream()
                    .map(attendanceService::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceDTOs, "Marked absent employees successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<?>> getAttendanceSummary() {
        try {
            AttendanceSummaryDTO summary = attendanceService.getAttendanceSummary();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(summary, "Attendance summary retrieved successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}
