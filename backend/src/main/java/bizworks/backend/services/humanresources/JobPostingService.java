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
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {
    private final JobPostingRepository jobPostingRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    private final EmployeeService employeeService;


    public JobPostingDTO createJobPosting(JobPostingDTO jobPostingDTO) {
        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle(jobPostingDTO.getTitle());
        jobPosting.setDescription(jobPostingDTO.getDescription());

        // Set postedDate to current date
        LocalDate postedDate = LocalDate.now();
        jobPosting.setPostedDate(postedDate);

        // Kiểm tra nếu deadline nhỏ hơn postedDate
        if (jobPostingDTO.getDeadline() != null && jobPostingDTO.getDeadline().isBefore(postedDate)) {
            throw new IllegalArgumentException("Application deadline cannot be before the posted date.");
        }
        jobPosting.setDeadline(jobPostingDTO.getDeadline());

        jobPosting.setLocation(jobPostingDTO.getLocation());
        jobPosting.setEmploymentType(jobPostingDTO.getEmploymentType());
        jobPosting.setRequirements(jobPostingDTO.getRequirements());

        // Gán Department và Position
        Department department = departmentRepository.findById(jobPostingDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        jobPosting.setDepartment(department);

        Position position = positionRepository.findById(jobPostingDTO.getPositionId())
                .orElseThrow(() -> new RuntimeException("Position not found"));
        jobPosting.setPosition(position);

        // Kiểm tra mức lương
        if (jobPostingDTO.getSalaryRangeMin() != null && jobPostingDTO.getSalaryRangeMax() != null) {
            if (jobPostingDTO.getSalaryRangeMin() > jobPostingDTO.getSalaryRangeMax()) {
                throw new IllegalArgumentException("Minimum salary cannot be greater than maximum salary.");
            }
        }
        jobPosting.setSalaryRangeMin(jobPostingDTO.getSalaryRangeMin());
        jobPosting.setSalaryRangeMax(jobPostingDTO.getSalaryRangeMax());

        // Lưu JobPosting vào cơ sở dữ liệu
        jobPosting = jobPostingRepository.save(jobPosting);
        return convertToDTO(jobPosting);
    }
    public List<JobPostingDTO> getAllJobPostings() {
        return jobPostingRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    public JobPostingDTO getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Posting not found"));
        return convertToDTO(jobPosting);
    }
    public JobPostingDTO updateJobPosting(Long id, JobPostingDTO jobPostingDTO) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Posting not found"));
        jobPosting.setTitle(jobPostingDTO.getTitle());
        jobPosting.setDescription(jobPostingDTO.getDescription());
        LocalDate postedDate = jobPosting.getPostedDate();
        if (jobPostingDTO.getDeadline() != null && jobPostingDTO.getDeadline().isBefore(postedDate)) {
            throw new IllegalArgumentException("Application deadline cannot be before the posted date.");
        }
        jobPosting.setDeadline(jobPostingDTO.getDeadline());
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
        }
        jobPosting.setSalaryRangeMin(jobPostingDTO.getSalaryRangeMin());
        jobPosting.setSalaryRangeMax(jobPostingDTO.getSalaryRangeMax());
        jobPosting = jobPostingRepository.save(jobPosting);
        return convertToDTO(jobPosting);
    }
    public void deleteJobPosting(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new RuntimeException("Job Posting not found");
        }
        jobPostingRepository.deleteById(id);
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
