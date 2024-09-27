package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.Employee;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findByCompleted(boolean completed);
    @Query("SELECT tp FROM TrainingProgram tp JOIN tp.participants p WHERE p.id = :userId")
    List<TrainingProgram> findByParticipantId(@Param("userId") int userId);
    List<TrainingProgram> findByParticipantsContains(Employee employee);

}
