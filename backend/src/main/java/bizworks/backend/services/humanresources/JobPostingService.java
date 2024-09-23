package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.JobPostingDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.Position;
import bizworks.backend.models.hrdepartment.JobPosting;
import bizworks.backend.repositories.DepartmentRepository;
import bizworks.backend.repositories.PositionRepository;
import bizworks.backend.repositories.hrdepartment.JobPostingRepository;
import bizworks.backend.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {
    private final JobPostingRepository jobPostingRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private List<JobPostingDTO> expiredJobPostings = new ArrayList<>();

    public JobPostingDTO createJobPosting(JobPostingDTO jobPostingDTO) {
        validateJobPostingDTO(jobPostingDTO); // Validate before saving

        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle(jobPostingDTO.getTitle());
        jobPosting.setDescription(jobPostingDTO.getDescription());
        jobPosting.setPostedDate(LocalDate.now());

        if (jobPostingDTO.getDeadline() != null) {
            if (jobPostingDTO.getDeadline().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Application deadline cannot be before the posted date.");
            }
            jobPosting.setDeadline(jobPostingDTO.getDeadline());
        }

        jobPosting.setLocation(jobPostingDTO.getLocation());
        jobPosting.setEmploymentType(jobPostingDTO.getEmploymentType());
        jobPosting.setRequirements(jobPostingDTO.getRequirements());

        Department department = departmentRepository.findById(jobPostingDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        jobPosting.setDepartment(department);

        Position position = positionRepository.findById(jobPostingDTO.getPositionId())
                .orElseThrow(() -> new RuntimeException("Position not found"));
        jobPosting.setPosition(position);

        if (jobPostingDTO.getSalaryRangeMin() != null && jobPostingDTO.getSalaryRangeMax() != null) {
            if (jobPostingDTO.getSalaryRangeMin() > jobPostingDTO.getSalaryRangeMax()) {
                throw new IllegalArgumentException("Minimum salary cannot be greater than maximum salary.");
            }
            jobPosting.setSalaryRangeMin(jobPostingDTO.getSalaryRangeMin());
            jobPosting.setSalaryRangeMax(jobPostingDTO.getSalaryRangeMax());
        }

        jobPosting = jobPostingRepository.save(jobPosting);
        return convertToDTO(jobPosting);
    }

    public List<JobPostingDTO> getAllJobPostings() {
        return jobPostingRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public JobPostingDTO getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Posting not found"));

        if (jobPosting.getDeadline() != null && jobPosting.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot view job posting, deadline has passed.");
        }

        return convertToDTO(jobPosting);
    }
    @Scheduled(cron = "0 0 0 * * ?") // Chạy mỗi ngày lúc nửa đêm
    public void checkAndMoveExpiredPostings() {
        List<JobPosting> allJobPostings = jobPostingRepository.findAll();
        LocalDate today = LocalDate.now();

        List<JobPostingDTO> expiredPostings = new ArrayList<>();

        for (JobPosting jobPosting : allJobPostings) {
            if (jobPosting.getDeadline() != null && jobPosting.getDeadline().isBefore(today)) {
                expiredPostings.add(convertToDTO(jobPosting));
                jobPostingRepository.delete(jobPosting); // Xóa hoặc đánh dấu là hết hạn
            }
        }
        expiredJobPostings = expiredPostings; // Cập nhật danh sách tin hết hạn
    }

    public List<JobPostingDTO> getExpiredJobPostings() {
        return expiredJobPostings;
    }
    public JobPostingDTO updateJobPosting(Long id, JobPostingDTO jobPostingDTO) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Posting not found"));

        validateJobPostingDTO(jobPostingDTO); // Validate before updating

        jobPosting.setTitle(jobPostingDTO.getTitle());
        jobPosting.setDescription(jobPostingDTO.getDescription());
        if (jobPostingDTO.getDeadline() != null) {
            if (jobPostingDTO.getDeadline().isBefore(jobPosting.getPostedDate())) {
                throw new IllegalArgumentException("Application deadline cannot be before the posted date.");
            }
            jobPosting.setDeadline(jobPostingDTO.getDeadline());
        }
        jobPosting.setLocation(jobPostingDTO.getLocation());
        jobPosting.setEmploymentType(jobPostingDTO.getEmploymentType());
        jobPosting.setRequirements(jobPostingDTO.getRequirements());

        Department department = departmentRepository.findById(jobPostingDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        jobPosting.setDepartment(department);

        Position position = positionRepository.findById(jobPostingDTO.getPositionId())
                .orElseThrow(() -> new RuntimeException("Position not found"));
        jobPosting.setPosition(position);

        if (jobPostingDTO.getSalaryRangeMin() != null && jobPostingDTO.getSalaryRangeMax() != null) {
            if (jobPostingDTO.getSalaryRangeMin() > jobPostingDTO.getSalaryRangeMax()) {
                throw new IllegalArgumentException("Minimum salary cannot be greater than maximum salary.");
            }
            jobPosting.setSalaryRangeMin(jobPostingDTO.getSalaryRangeMin());
            jobPosting.setSalaryRangeMax(jobPostingDTO.getSalaryRangeMax());
        }

        jobPosting = jobPostingRepository.save(jobPosting);
        return convertToDTO(jobPosting);
    }

    public void deleteJobPosting(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new RuntimeException("Job Posting not found");
        }
        jobPostingRepository.deleteById(id);
    }

    private void validateJobPostingDTO(JobPostingDTO jobPostingDTO) {
        if (jobPostingDTO.getTitle() == null || jobPostingDTO.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Job title is required.");
        }
        if (jobPostingDTO.getDescription() == null || jobPostingDTO.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Job description is required.");
        }
        if (jobPostingDTO.getDepartmentId() == null) {
            throw new IllegalArgumentException("Department ID is required.");
        }
        if (jobPostingDTO.getPositionId() == null) {
            throw new IllegalArgumentException("Position ID is required.");
        }
        if (jobPostingDTO.getSalaryRangeMin() != null && jobPostingDTO.getSalaryRangeMax() != null) {
            if (jobPostingDTO.getSalaryRangeMin() > jobPostingDTO.getSalaryRangeMax()) {
                throw new IllegalArgumentException("Minimum salary cannot be greater than maximum salary.");
            }
        }
    }

    private JobPostingDTO convertToDTO(JobPosting jobPosting) {
        return new JobPostingDTO(
                jobPosting.getId(),
                jobPosting.getTitle(),
                jobPosting.getDescription(),
                jobPosting.getPostedDate(),
                jobPosting.getDeadline(),
                jobPosting.getDepartment().getId(),
                jobPosting.getPosition().getId(),
                jobPosting.getLocation(),
                jobPosting.getEmploymentType(),
                jobPosting.getRequirements(),
                jobPosting.getPosition().getPositionName(),
                jobPosting.getSalaryRangeMin(),
                jobPosting.getSalaryRangeMax()
        );
    }
}
