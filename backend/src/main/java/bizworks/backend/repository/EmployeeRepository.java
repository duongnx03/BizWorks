package bizworks.backend.repository;

import bizworks.backend.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findById(Long id);

    Employee save(Employee employee);

    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.position LEFT JOIN FETCH e.department WHERE e.id = :id")
    Optional<Employee> findByIdWithPositionAndDepartment(@Param("id") Long id);

    @Query("SELECT e FROM Employee e WHERE e.position.positionName = :positionName")
    List<Employee> findByPositionName(@Param("positionName") String positionName);

}
