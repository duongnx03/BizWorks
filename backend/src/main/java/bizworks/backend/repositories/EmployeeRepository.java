package bizworks.backend.repositories;

import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
    List<Employee> findAllByUserIdIn(List<Long> userIds); // Adjust the parameter type if needed
    List<Employee> findByStartDateAfter(LocalDate date); // Define the method
    @Query("SELECT e FROM Employee e JOIN e.user u WHERE u.role = :role")
    List<Employee> findByUserRole(@Param("role") String role);
    @Query("SELECT e FROM Employee e WHERE e.user.role = 'EMPLOYEE' AND e.startDate > :thresholdDate")
    List<Employee> findNewEmployees(@Param("thresholdDate") LocalDate thresholdDate);
    @Query("SELECT e.id FROM Employee e WHERE e.user.id = :userId")
    Long findEmployeeIdByUserId(@Param("userId") Long userId);
}
