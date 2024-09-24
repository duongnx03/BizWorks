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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public List<Employee> findAllByIds(List<Long> ids) {
        return employeeRepository.findAllById(ids);
    }
    public boolean existsByEmail(String email){
        return employeeRepository.existsByEmail(email);
    }
    public List<Employee> getEmployeesByDepartment(String departmentName) {
        return employeeRepository.findByDepartmentName(departmentName);
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

    public List<Employee> findByRoleIn(List<String> roles) {
        return employeeRepository.findByUser_RoleIn(roles);
    }

    // Tìm tất cả nhân viên theo vai trò
    public List<Employee> findByRole(String role) {
        return employeeRepository.findByUser_Role(role);
    }

    public Employee updateEmployee(EmployeeUpdateDTO request) {
        String email = getCurrentUserEmail();
        Employee employeeExisted = findByEmail(email);
        employeeExisted.setDob(request.getDob());
        employeeExisted.setGender(request.getGender());
        employeeExisted.setPhone(request.getPhone());
        employeeExisted.setAddress(request.getAddress());

        return employeeRepository.save(employeeExisted);
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
        employeeDTO.setDepartment(employee.getDepartment().getName());
        employeeDTO.setPosition(employee.getPosition().getPositionName());
        return employeeDTO;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public Employee findByUser(User user) {
        return employeeRepository.findByUser(user).orElse(null);
    }
}

