package bizworks.backend.controllers;

import bizworks.backend.dtos.AttendanceComplaintDTO;
import bizworks.backend.dtos.AttendanceComplaintRequestDTO;
import bizworks.backend.dtos.RejectComplaintRequestDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.services.AttendanceComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaint")
@RequiredArgsConstructor
public class AttendanceComplaintController {
    private final AttendanceComplaintService attendanceComplaintService;

    @GetMapping("/getByAttendanceId/{id}")
    public ResponseEntity<ApiResponse<?>> getByAttendanceId(@PathVariable("id") Long id){
        try{
            AttendanceComplaintDTO attendanceComplaintDTO = attendanceComplaintService.findByAttendanceId(id);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceComplaintDTO, "Complaint get by attendance id successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByCensor")
    public ResponseEntity<ApiResponse<?>> getByCensor(){
        try{
            List<AttendanceComplaintDTO> attendanceComplaintDTOs = attendanceComplaintService.findByCensor();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceComplaintDTOs, "Complaint get all successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByIsShow")
    public ResponseEntity<ApiResponse<?>> getIsShow(){
        try{
            List<AttendanceComplaintDTO> attendanceComplaintDTOs = attendanceComplaintService.findByIsShow();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceComplaintDTOs, "Complaint get all successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<ApiResponse<?>> getByEmail(){
        try{
            List<AttendanceComplaintDTO> attendanceComplaintDTOs = attendanceComplaintService.findByEmployeeEmail();
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceComplaintDTOs, "Complaint get by email successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<?>> submitComplaint(@ModelAttribute AttendanceComplaintRequestDTO attendanceComplaintRequestDTO, @RequestParam Map<String, MultipartFile> fileMap){
        try{
            List<MultipartFile> images = new ArrayList<>();
            for (Map.Entry<String, MultipartFile> entry : fileMap.entrySet()) {
                images.add(entry.getValue());
            }
            AttendanceComplaintDTO attendanceComplaintDTO = attendanceComplaintService.createComplaint(attendanceComplaintRequestDTO, images);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(attendanceComplaintDTO, "Complaint registered successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<?>> approve(@PathVariable("id") Long id){
        try{
            AttendanceComplaintDTO attendanceComplaintDTO = attendanceComplaintService.approveComplaint(id);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceComplaintDTO, "Complaint accept successfully"));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<ApiResponse<?>> reject(@RequestBody RejectComplaintRequestDTO request) {
        try {
            AttendanceComplaintDTO attendanceComplaintDTO = attendanceComplaintService.rejectComplaint(request.getId(), request.getDescription());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(attendanceComplaintDTO, "Complaint rejected successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }
}

