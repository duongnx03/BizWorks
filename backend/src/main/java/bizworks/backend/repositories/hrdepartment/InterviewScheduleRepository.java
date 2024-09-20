package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewScheduleRepository extends JpaRepository<InterviewSchedule, Long> {
    List<InterviewSchedule> findAll();

}
