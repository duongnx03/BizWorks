package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.TrainingProgramEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrainingProgramEmployeeRepository extends JpaRepository<TrainingProgramEmployee, Long> {
    boolean existsByTrainingProgramIdAndEmployeeId(Long trainingProgramId, Long employeeId);
    @Query("SELECT t.trainingProgramId FROM TrainingProgramEmployee t WHERE t.employeeId = :employeeId")
    List<Long> findByEmployeeId(Long employeeId);
}
