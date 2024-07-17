package bizworks.backend.repository;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary,Long> {
    List<Salary> findByEmployee(Employee employee);
}
