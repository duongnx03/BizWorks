package bizworks.backend.repositories;

import bizworks.backend.models.Allowance;
import bizworks.backend.models.Employee;
import bizworks.backend.models.EmployeeAllowance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeAllowanceRepository extends JpaRepository<EmployeeAllowance, Long> {

    List<EmployeeAllowance> findAllByEmployee_IdAndAllowance_MonthAndAllowance_Year(Long employeeId, Integer month, Integer year);
    boolean existsByEmployeeAndAllowance(Employee employee, Allowance allowance);

}