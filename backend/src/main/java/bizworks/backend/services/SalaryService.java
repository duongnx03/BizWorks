package bizworks.backend.services;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Salary;
import bizworks.backend.repository.SalaryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryService {
    private SalaryRepository salaryRepository;

    public SalaryService(SalaryRepository salaryRepository) {
        this.salaryRepository = salaryRepository;
    }

    public Salary saveOrUpdateSalary(Salary salary) {
        salary.setTotalSalaryMonth(salary.getBasicSalary() + salary.getAllowanceSalary() - salary.getDeductionSalary() + salary.getBonusSalary() + salary.getOvertimeSalary());
        return salaryRepository.save(salary);
    }

    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    public List<Salary> getSalariesByEmployee(Employee employee) {
        return salaryRepository.findByEmployee(employee);
    }

    public void deleteSalary(Long id) {
        salaryRepository.deleteById(id);
    }
}
