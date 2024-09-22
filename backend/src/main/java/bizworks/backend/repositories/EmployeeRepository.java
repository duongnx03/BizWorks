package bizworks.backend.repositories;

import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findByDepartmentName(String name);

    boolean existsByEmail(String email);

    Optional<Employee> findByUser(User user);

    Optional<Employee> findById(Long id);

    List<Employee> findByUser_RoleIn(List<String> roles);

    // Tìm tất cả nhân viên theo vai trò
    List<Employee> findByUser_Role(String role);

    List<Employee> findByPositionId(Long positionId);
}
