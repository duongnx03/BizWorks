package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.InterviewSchedule;
import bizworks.backend.models.hrdepartment.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewScheduleRepository extends JpaRepository<InterviewSchedule, Long> {
    List<InterviewSchedule> findAll();
    List<InterviewSchedule> findByStatus(InterviewStatus status); // Chắc chắn rằng tham số là InterviewStatus

}
