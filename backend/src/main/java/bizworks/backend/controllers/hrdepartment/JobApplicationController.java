package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.JobApplicationDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.helpers.ApiResponseDepartment;
import bizworks.backend.services.humanresources.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {
    private final JobApplicationService jobApplicationService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<?>> submitJobApplication(
            @RequestParam String applicantName,
            @RequestParam String applicantEmail,
            @RequestParam String applicantPhone,
            @RequestParam("resume") MultipartFile resume,
            @RequestParam Long jobPostingId) {
        try {
            // Log request parameters
            System.out.println("Received request with parameters:");
            System.out.println("applicantName: " + applicantName);
            System.out.println("applicantEmail: " + applicantEmail);
            System.out.println("applicantPhone: " + applicantPhone);
            System.out.println("jobPostingId: " + jobPostingId);

            // Store the resume file and get the URL
            String resumeUrl = jobApplicationService.storeFile(resume);

            JobApplicationDTO jobApplicationDTO = new JobApplicationDTO();
            jobApplicationDTO.setApplicantName(applicantName);
            jobApplicationDTO.setApplicantEmail(applicantEmail);
            jobApplicationDTO.setApplicantPhone(applicantPhone);
            jobApplicationDTO.setResumeUrl(resumeUrl);
            jobApplicationDTO.setJobPostingId(jobPostingId);

            JobApplicationDTO submittedApplication = jobApplicationService.submitApplication(jobApplicationDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(submittedApplication, "Job application submitted successfully"));
        } catch (RuntimeException e) {
            // Log error
            System.err.println("Error submitting application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseDepartment.errorClient(e.getMessage(), "ERROR_SUBMITTING_APPLICATION"));
        } catch (Exception e) {
            // Log error
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer(e.getMessage(), "ERROR_SUBMITTING_APPLICATION"));
        }
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<?>> getAllJobApplications() {
        try {
            List<JobApplicationDTO> applications = jobApplicationService.getAllApplications();
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success(applications, "List of all job applications fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer(e.getMessage(), "ERROR_FETCHING_APPLICATIONS"));
        }
    }

    @GetMapping("/by-job-posting/{jobPostingId}")
    public ResponseEntity<ApiResponse<?>> getApplicationsByJobPosting(@PathVariable Long jobPostingId) {
        try {
            List<JobApplicationDTO> applications = jobApplicationService.getApplicationsByJobPostingId(jobPostingId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success(applications, "List of applications fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer(e.getMessage(), "ERROR_FETCHING_APPLICATIONS"));
        }
    }

    @GetMapping("/resume/{fileName}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        try {
            Resource file = jobApplicationService.loadFileAsResource(fileName);
            String contentType = Files.probeContentType(Paths.get(file.getFilename()));
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PatchMapping("/update-status/{applicationId}")
    public ResponseEntity<ApiResponse<?>> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String newStatus,
            @RequestParam(required = false) String reason) { // Thêm tham số reason, yêu cầu là không bắt buộc

        try {
            JobApplicationDTO updatedApplication = jobApplicationService.updateApplicationStatus(applicationId, newStatus, reason);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success(updatedApplication, "Application status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.errorServer(e.getMessage(), "ERROR_UPDATING_STATUS"));
        }
    }

}
