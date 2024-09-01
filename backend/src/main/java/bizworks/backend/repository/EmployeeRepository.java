package bizworks.backend.repository;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import bizworks.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByUser(User user);
    List<Employee> findByPositionId(Long positionId);

}

