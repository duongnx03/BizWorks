package bizworks.backend.repositories;

import bizworks.backend.models.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByEmployeeFullnameContaining(String fullname);
    List<Violation> findByEmployeeId(Long employeeId);
    List<Violation> findByViolationTypeId(Long violationTypeId);

}
