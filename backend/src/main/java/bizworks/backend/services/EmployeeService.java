package aptech.project.services;

import aptech.project.models.Employee;
import aptech.project.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee save(Employee employee){
        return employeeRepository.save(employee);
    }

    public Employee findByEmail(String email){
        return employeeRepository.findByEmail(email).orElseThrow();
    }
}
