package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findByCompleted(boolean completed);

}
