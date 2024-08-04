package bizworks.backend.services;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import bizworks.backend.repository.DepartmentRepository;
import bizworks.backend.repository.EmployeeRepository;
import bizworks.backend.repository.PositionRepository;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public String getEmployeeFullNameById(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .map(Employee::getFullname)
                .orElse("N/A");
    }

    public Optional<Employee> findById(Long id) {
        return employeeRepository.findByIdWithPositionAndDepartment(id);
    }

    public EmployeeDTO save(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();
        employee.setId(employeeDTO.getId());
        employee.setFullname(employeeDTO.getFullname());
//        employee.setDob(employeeDTO.getDob());
        employee.setAddress(employeeDTO.getAddress());
        employee.setGender(employeeDTO.getGender());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setAvatar(employeeDTO.getAvatar());
        employee.setStartDate(employeeDTO.getStartDate());
        employee.setEndDate(employeeDTO.getEndDate());

        if (employeeDTO.getPositionId() != null) {
            Position position = positionRepository.findById(employeeDTO.getPositionId())
                    .orElseThrow(() -> new EntityNotFoundException("Position not found"));
            employee.setPosition(position);
        }

        if (employeeDTO.getDepartmentId() != null) {
            Department department = departmentRepository.findById(employeeDTO.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));
            employee.setDepartment(department);
        }

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    public EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFullname(employee.getFullname());
        dto.setDob(employee.getDob());
        dto.setAddress(employee.getAddress());
        dto.setGender(employee.getGender());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setAvatar(employee.getAvatar());
        dto.setStartDate(employee.getStartDate());
        dto.setEndDate(employee.getEndDate());

        if (employee.getPosition() != null) {
            dto.setPositionId(employee.getPosition().getId());
            dto.setPositionName(employee.getPosition().getPositionName());
        }

        if (employee.getDepartment() != null) {
            dto.setDepartmentId(employee.getDepartment().getId());
            dto.setDepartmentName(employee.getDepartment().getDepartmentName());
        }

        return dto;
    }

    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email).orElseThrow();
    }
}
