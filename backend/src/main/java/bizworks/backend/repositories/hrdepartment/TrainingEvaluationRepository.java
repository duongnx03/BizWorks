package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.TrainingEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingEvaluationRepository extends JpaRepository<TrainingEvaluation, Long> {
    List<TrainingEvaluation> findByTrainingProgramId(Long trainingProgramId);
    List<TrainingEvaluation> findByEmployeeId(Long employeeId);
    boolean existsByTrainingProgramIdAndEmployeeId(Long trainingProgramId, Long employeeId);

}
