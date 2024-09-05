package bizworks.backend.services;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.EmployeeResponseDTO;
import bizworks.backend.dtos.EmployeeUpdateDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import bizworks.backend.repositories.DepartmentRepository;
import bizworks.backend.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public boolean existsByEmail(String email){
        return employeeRepository.existsByEmail(email);
    }

    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public Employee findById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public EmployeeResponseDTO getEmployeeByEmail(String email) {
        Employee employee = findByEmail(email);
        return convertToDTO(employee);
    }

    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = findById(id);
        return convertToDTO(employee);
    }

    public Employee updateEmployee(EmployeeUpdateDTO request) {
        String email = getCurrentUserEmail();
        Employee employeeExisted = findByEmail(email);
        // Update employee information
        employeeExisted.setDob(request.getDob());
        employeeExisted.setGender(request.getGender());
        employeeExisted.setPhone(request.getPhone());
        employeeExisted.setAddress(request.getAddress());
        employeeExisted.setAvatar(request.getAvatar());

        return save(employeeExisted);
    }

    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    public EmployeeResponseDTO convertToDTO(Employee employee) {
        EmployeeResponseDTO employeeDTO = new EmployeeResponseDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setEmpCode(employee.getEmpCode());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setGender(employee.getGender());
        if (employee.getDepartment() != null || employee.getPosition() != null) {
            employeeDTO.setDepartment(employee.getDepartment().getName());
            employeeDTO.setPosition(employee.getPosition().getPositionName());
        } else {
            employeeDTO.setDepartment(null);
            employeeDTO.setPosition(null);
        }
        return employeeDTO;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public EmployeeDTO convertToEmpDTO(Employee employee) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setGender(employee.getGender());

        employeeDTO.setDepartmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null);
        employeeDTO.setDepartmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null);

        employeeDTO.setPositionId(employee.getPosition() != null ? employee.getPosition().getId() : null);
        employeeDTO.setPositionName(employee.getPosition() != null ? employee.getPosition().getPositionName() : null);

        return employeeDTO;
    }

    public Employee findByUser(User user) {
        return employeeRepository.findByUser(user).orElse(null);
    }
    public boolean isEmployeeInHRDepartment(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Department hrDepartment = departmentRepository.findByName("HR Department")
                .orElseThrow(() -> new RuntimeException("HR Department not found"));
        boolean isInHRDepartment = hrDepartment.getId().equals(employee.getDepartment().getId());
        System.out.println("Employee Department ID: " + employee.getDepartment().getId());
        System.out.println("HR Department ID: " + hrDepartment.getId());
        return isInHRDepartment;
    }
}

