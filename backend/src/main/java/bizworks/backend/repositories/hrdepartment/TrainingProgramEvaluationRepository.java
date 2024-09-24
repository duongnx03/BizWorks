package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.TrainingProgramEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingProgramEvaluationRepository extends JpaRepository<TrainingProgramEvaluation, Long> {
    List<TrainingProgramEvaluation> findByTrainingProgramId(Long trainingProgramId);

}
