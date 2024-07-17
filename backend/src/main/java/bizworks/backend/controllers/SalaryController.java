package bizworks.backend.controllers;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Salary;
import bizworks.backend.repository.SalaryRepository;
import bizworks.backend.services.SalaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {
    private SalaryService salaryService;
    private SalaryRepository SalaryRepository;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
        this.SalaryRepository = SalaryRepository;
    }

    @PostMapping("")
    public ResponseEntity<Salary> saveOrUpdateSalary(@RequestBody Salary salary) {
        Salary savedSalary = salaryService.saveOrUpdateSalary(salary);
        return new ResponseEntity<>(savedSalary, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<Salary>> getAllSalaries() {
        List<Salary> salaries = salaryService.getAllSalaries();
        return new ResponseEntity<>(salaries, HttpStatus.OK);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Salary>> getSalariesByEmployee(@PathVariable Long employeeId) {
        Employee employee = new Employee();
        employee.setId(employeeId);
        List<Salary> salaries = salaryService.getSalariesByEmployee(employee);
        return new ResponseEntity<>(salaries, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
