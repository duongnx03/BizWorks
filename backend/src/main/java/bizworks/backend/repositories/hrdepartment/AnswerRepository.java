package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    boolean existsByExamIdAndEmployeeId(Long examId, Long employeeId);
    List<Answer> findByExamIdAndEmployeeId(Long examId, Long employeeId);
}
