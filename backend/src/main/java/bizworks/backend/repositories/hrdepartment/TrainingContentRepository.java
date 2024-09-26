package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.TrainingContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingContentRepository extends JpaRepository<TrainingContent, Long> {
    List<TrainingContent> findByTrainingProgramId(Long trainingProgramId); // To fetch content by training program
}
