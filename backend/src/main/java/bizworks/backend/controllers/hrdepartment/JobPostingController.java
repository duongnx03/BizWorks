    package bizworks.backend.controllers.hrdepartment;

    import bizworks.backend.dtos.hrdepartment.JobPostingDTO;
    import bizworks.backend.helpers.ApiResponse;
    import bizworks.backend.services.humanresources.JobPostingService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/job-postings")
    @RequiredArgsConstructor
    public class JobPostingController {
        private final JobPostingService jobPostingService;

        @PostMapping("/create")
        public ResponseEntity<ApiResponse<?>> createJobPosting(@RequestBody JobPostingDTO jobPostingDTO) {
            try {
                JobPostingDTO createdJobPosting = jobPostingService.createJobPosting(jobPostingDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdJobPosting, "Job posting created successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(e.getMessage(), "ERROR_CREATING_JOB_POSTING"));
            }
        }

        @GetMapping("/list")
        public ResponseEntity<ApiResponse<?>> getAllJobPostings() {
            try {
                List<JobPostingDTO> jobPostings = jobPostingService.getAllJobPostings();
                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(jobPostings, "List of job postings fetched successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(e.getMessage(), "ERROR_FETCHING_JOB_POSTINGS"));
            }
        }
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<?>> getJobPostingById(@PathVariable Long id) {
            try {
                JobPostingDTO jobPostingDTO = jobPostingService.getJobPostingById(id);
                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(jobPostingDTO, "Job posting fetched successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(e.getMessage(), "ERROR_FETCHING_JOB_POSTING"));
            }
        }
        @PutMapping("/{id}/update")
        public ResponseEntity<ApiResponse<?>> updateJobPosting(@PathVariable Long id, @RequestBody JobPostingDTO jobPostingDTO) {
            try {
                JobPostingDTO updatedJobPosting = jobPostingService.updateJobPosting(id, jobPostingDTO);
                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(updatedJobPosting, "Job posting updated successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(e.getMessage(), "ERROR_UPDATING_JOB_POSTING"));
            }
        }

        @DeleteMapping("/{id}/delete")
        public ResponseEntity<ApiResponse<?>> deleteJobPosting(@PathVariable Long id) {
            try {
                jobPostingService.deleteJobPosting(id);
                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Job posting deleted successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(e.getMessage(), "ERROR_DELETING_JOB_POSTING"));
            }
        }

    }
