package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

}
