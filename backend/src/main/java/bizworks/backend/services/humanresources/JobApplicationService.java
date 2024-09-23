        package bizworks.backend.services.humanresources;

        import bizworks.backend.dtos.hrdepartment.InterviewScheduleDTO;
        import bizworks.backend.dtos.hrdepartment.JobApplicationDTO;
        import bizworks.backend.models.Employee;
        import bizworks.backend.models.hrdepartment.InterviewSchedule;
        import bizworks.backend.models.hrdepartment.JobApplication;
        import bizworks.backend.models.hrdepartment.JobPosting;
        import bizworks.backend.models.hrdepartment.StatusChangeRequest;
        import bizworks.backend.repositories.hrdepartment.*;
        import bizworks.backend.services.DepartmentService;
        import bizworks.backend.services.EmailService;
        import lombok.RequiredArgsConstructor;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.core.io.FileSystemResource;
        import org.springframework.core.io.Resource;
        import org.springframework.stereotype.Service;
        import org.springframework.web.multipart.MultipartFile;

        import java.io.FileNotFoundException;
        import java.io.IOException;
        import java.nio.file.Files;
        import java.nio.file.Path;
        import java.nio.file.Paths;
        import java.time.LocalDate;
        import java.util.Arrays;
        import java.util.List;
        import java.util.Optional;
        import java.util.stream.Collectors;

        @Service
        @RequiredArgsConstructor
        public class JobApplicationService {
            private final JobApplicationRepository jobApplicationRepository;
            private final JobPostingRepository jobPostingRepository;
            private final StatusChangeRequestRepository statusChangeRequestRepository;
            private final InterviewScheduleRepository interviewScheduleRepository;
            @Autowired
            private EmailService emailService;

            private final String uploadDir = "uploads";
            public InterviewScheduleDTO createInterviewSchedule(InterviewScheduleDTO interviewScheduleDTO) {
                JobApplication jobApplication = jobApplicationRepository.findById(interviewScheduleDTO.getJobApplicationId())
                        .orElseThrow(() -> new RuntimeException("Job application not found"));

                InterviewSchedule interviewSchedule = new InterviewSchedule();
                interviewSchedule.setJobApplication(jobApplication);
                interviewSchedule.setInterviewDate(interviewScheduleDTO.getInterviewDate());
                interviewSchedule.setInterviewers(interviewScheduleDTO.getInterviewers()); // Đây sẽ là List<Long>
                interviewSchedule.setLocation(interviewScheduleDTO.getLocation());

                interviewSchedule = interviewScheduleRepository.save(interviewSchedule);

                // Gửi email thông báo về lịch phỏng vấn
                String applicantEmail = jobApplication.getApplicantEmail();
                String subject = "Interview Schedule Confirmation";
                String body = "Dear " + jobApplication.getApplicantName() + ",\n\n"
                        + "Your interview has been scheduled.\n"
                        + "Date: " + interviewSchedule.getInterviewDate() + "\n"
                        + "Interviewers: " + interviewSchedule.getInterviewers() + "\n" // Cần chuyển danh sách sang chuỗi nếu cần
                        + "Location: " + interviewSchedule.getLocation() + "\n\n"
                        + "Thank you for your interest in this position. We look forward to meeting you.";

                emailService.sendEmail(applicantEmail, subject, body);

                return convertToDTO(interviewSchedule);
            }
            public List<InterviewSchedule> getAllInterviewSchedules() {
                return interviewScheduleRepository.findAll();
            }
            private InterviewScheduleDTO convertToDTO(InterviewSchedule interviewSchedule) {
                return new InterviewScheduleDTO(
                        interviewSchedule.getId(),
                        interviewSchedule.getJobApplication().getId(),
                        interviewSchedule.getInterviewDate(),
                        interviewSchedule.getInterviewers(),
                        interviewSchedule.getLocation()
                );
            }

            public StatusChangeRequest requestStatusChange(Long applicationId, String newStatus, String reason) {
                JobApplication jobApplication = jobApplicationRepository.findById(applicationId)
                        .orElseThrow(() -> new RuntimeException("Application not found"));

                StatusChangeRequest statusChangeRequest = new StatusChangeRequest();
                statusChangeRequest.setJobApplication(jobApplication);
                statusChangeRequest.setNewStatus(newStatus);
                statusChangeRequest.setReason(reason);
                statusChangeRequest.setRequestDate(LocalDate.now());
                statusChangeRequest.setApproved(false);

                return statusChangeRequestRepository.save(statusChangeRequest);
            }
            public List<JobApplicationDTO> getAcceptedApplications() {
                return jobApplicationRepository.findByStatus("ACCEPTED")
                        .stream().map(this::convertToDTO).collect(Collectors.toList());
            }
            public StatusChangeRequest approveStatusChange(Long requestId) {
                StatusChangeRequest statusChangeRequest = statusChangeRequestRepository.findById(requestId)
                        .orElseThrow(() -> new RuntimeException("Status change request not found"));

                if (statusChangeRequest.getApproved()) {
                    throw new RuntimeException("Status change request has already been approved.");
                }

                JobApplication jobApplication = statusChangeRequest.getJobApplication();
                jobApplication.setStatus(statusChangeRequest.getNewStatus());

                jobApplicationRepository.save(jobApplication);

                statusChangeRequest.setApproved(true);
                statusChangeRequest.setApprovalDate(LocalDate.now());
                statusChangeRequestRepository.save(statusChangeRequest);

                String applicantEmail = jobApplication.getApplicantEmail();
                String subject = "Application Status Updated";
                String body = "Dear " + jobApplication.getApplicantName() + ",\n\n"
                        + "Your application status has been updated to: " + jobApplication.getStatus() + ".\n\n"
                        + "Thank you.";

                emailService.sendEmail(applicantEmail, subject, body);

                return statusChangeRequest;
            }
            public List<StatusChangeRequest> getPendingStatusChangeRequests() {
                return statusChangeRequestRepository.findByApproved(false);
            }
            public List<JobApplicationDTO> getAllApplications() {
                System.out.println("Fetching all job applications");
                return jobApplicationRepository.findAll()
                        .stream().map(this::convertToDTO).collect(Collectors.toList());
            }
            public long countApplicationsByJobPostingId(Long jobPostingId) {
                return jobApplicationRepository.countByJobPostingId(jobPostingId);
            }
            public JobApplicationDTO submitApplication(JobApplicationDTO jobApplicationDTO) {
                JobPosting jobPosting = jobPostingRepository.findById(jobApplicationDTO.getJobPostingId())
                        .orElseThrow(() -> new RuntimeException("Job posting not found"));
                if (LocalDate.now().isAfter(jobPosting.getDeadline())) {
                    throw new RuntimeException("Cannot submit application. The job posting has expired.");
                }

                Optional<JobApplication> existingApplication = jobApplicationRepository.findByJobPostingIdAndApplicantEmail(
                        jobApplicationDTO.getJobPostingId(),
                        jobApplicationDTO.getApplicantEmail()
                );

                if (existingApplication.isPresent()) {
                    throw new RuntimeException("You have already submitted an application for this job posting.");
                }

                JobApplication jobApplication = new JobApplication();
                jobApplication.setJobPosting(jobPosting);
                jobApplication.setApplicantName(jobApplicationDTO.getApplicantName());
                jobApplication.setApplicantEmail(jobApplicationDTO.getApplicantEmail());
                jobApplication.setApplicantPhone(jobApplicationDTO.getApplicantPhone());
                jobApplication.setResumeUrl(jobApplicationDTO.getResumeUrl());
                jobApplication.setApplicationDate(LocalDate.now());
                jobApplication.setStatus("PENDING");

                jobApplication = jobApplicationRepository.save(jobApplication);
                return convertToDTO(jobApplication);
            }

            public Resource loadFileAsResource(String fileName) {
                try {
                    Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
                    Resource resource = new FileSystemResource(filePath.toFile());
                    if (resource.exists()) {
                        return resource;
                    } else {
                        throw new FileNotFoundException("File not found " + fileName);
                    }
                } catch (Exception ex) {
                    throw new RuntimeException("File not found " + fileName, ex);
                }
            }

            public String storeFile(MultipartFile file) throws IOException {
                if (file.isEmpty()) {
                    throw new RuntimeException("Failed to store empty file.");
                }

                String[] allowedExtensions = {"pdf", "doc", "docx"};
                String fileExtension = getFileExtension(file.getOriginalFilename());

                if (Arrays.stream(allowedExtensions).noneMatch(fileExtension::equalsIgnoreCase)) {
                    throw new RuntimeException("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
                }

                String mimeType = Files.probeContentType(Paths.get(file.getOriginalFilename()));
                if (!mimeType.equals("application/pdf") &&
                        !mimeType.equals("application/msword") &&
                        !mimeType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                    throw new RuntimeException("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
                }

                Path path = Paths.get(uploadDir, file.getOriginalFilename());
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());

                return file.getOriginalFilename();
            }

            private String getFileExtension(String fileName) {
                if (fileName == null || fileName.isEmpty()) {
                    return "";
                }
                return fileName.substring(fileName.lastIndexOf(".") + 1);
            }

            public List<JobApplicationDTO> getApplicationsByJobPostingId(Long jobPostingId) {
                return jobApplicationRepository.findByJobPostingId(jobPostingId)
                        .stream().map(this::convertToDTO).collect(Collectors.toList());
            }

            public JobApplicationDTO updateApplicationStatus(Long applicationId, String newStatus, String reason) {
                JobApplication jobApplication = jobApplicationRepository.findById(applicationId)
                        .orElseThrow(() -> new RuntimeException("Application not found"));

                jobApplication.setStatus(newStatus);

                if (newStatus.equals("REJECTED") && reason != null && !reason.isEmpty()) {
                    jobApplication.setRejectionReason(reason);
                }

                jobApplication = jobApplicationRepository.save(jobApplication);
                String applicantEmail = jobApplication.getApplicantEmail();
                String subject = "";
                String body = "";

                if (newStatus.equals("ACCEPTED")) {
                    subject = "Application Status: ACCEPTED";
                    body = "Dear " + jobApplication.getApplicantName() + ",\n\n"
                            + "Congratulations! Your job application has been accepted. We will contact you shortly with further details.";
                } else if (newStatus.equals("REJECTED")) {
                    subject = "Application Status: REJECTED";
                    body = "Dear " + jobApplication.getApplicantName() + ",\n\n"
                            + "We regret to inform you that your job application has been rejected. Reason: " + reason + "\n\n"
                            + "We appreciate your interest and encourage you to apply for future openings.";
                }

                if (!subject.isEmpty()) {
                    emailService.sendEmail(applicantEmail, subject, body);
                }

                return convertToDTO(jobApplication);
            }

            private JobApplicationDTO convertToDTO(JobApplication jobApplication) {
                return new JobApplicationDTO(
                        jobApplication.getId(),
                        jobApplication.getJobPosting().getId(),
                        jobApplication.getApplicantName(),
                        jobApplication.getApplicantEmail(),
                        jobApplication.getApplicantPhone(),
                        jobApplication.getResumeUrl(),
                        jobApplication.getApplicationDate(),
                        jobApplication.getStatus()
                );
            }
            public List<StatusChangeRequest> getAllStatusChangeRequests() {
                return statusChangeRequestRepository.findAll();
            }
            public List<StatusChangeRequest> getApprovedStatusChangeRequests() {
                return statusChangeRequestRepository.findByApproved(true);
            }
            public String getUploadDir() {
                return uploadDir;
            }
        }
