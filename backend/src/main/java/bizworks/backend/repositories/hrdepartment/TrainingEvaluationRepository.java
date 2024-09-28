package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.TrainingEvaluation;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingEvaluationRepository extends JpaRepository<TrainingEvaluation, Long> {
    List<TrainingEvaluation> findByTrainingProgram(TrainingProgram trainingProgram);
}
