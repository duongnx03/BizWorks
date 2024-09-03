package bizworks.backend.repositories;

import bizworks.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmployeeId(Long employeeId);
    List<User> findByRoleAndEmployeeDepartmentName(String role, String departmentName);

}
