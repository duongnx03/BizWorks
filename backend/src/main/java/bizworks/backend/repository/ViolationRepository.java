package bizworks.backend.repository;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByEmployee(Employee employee);
}
