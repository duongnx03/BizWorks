package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobPostingId(Long jobPostingId);
    Optional<JobApplication> findByJobPostingIdAndApplicantEmail(Long jobPostingId, String applicantEmail);
    List<JobApplication> findByStatus(String status);
    long countByJobPostingId(Long jobPostingId);

}
