package bizworks.backend.repository;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary,Long> {
    List<Salary> findByMonthAndYear(Integer month, Integer year);
    List<Salary> findByEmployeeFullnameContaining(String fullname);
    List<Salary> findByDateSalaryBetween(LocalDateTime startDate, LocalDateTime endDate);
    Optional<Salary> findTopByEmployeeIdOrderByDateSalaryDesc(Long employeeId);
    Optional<Salary> findBySalaryCode(String salaryCode);
    boolean existsByEmployeeIdAndMonthAndYear(Long employeeId, int month, int year);
    List<Salary> findByEmployeeId(Long employeeId);
}
