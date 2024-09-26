package bizworks.backend.services;

import bizworks.backend.dtos.PositionDTO;
import bizworks.backend.models.*;
import bizworks.backend.repositories.DepartmentRepository;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.PositionRepository;
import bizworks.backend.repositories.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PositionService {

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Position findById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found with id " + id));
    }

    public List<Position> getAllPositions() {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));
        return positionRepository.findAll();
    }

    public List<Position> getPositionsByDepartmentId(Long departmentId) {
        return positionRepository.findByDepartmentId(departmentId);
    }

    public List<PositionDTO> findByDepartment(Long departmentId) {
        List<Position> positions = positionRepository.findByDepartmentId(departmentId);
        return positions.stream()
                .map(PositionDTO::from)
                .collect(Collectors.toList());
    }

    public PositionDTO convertToDTO(Position position) {
        return PositionDTO.from(position);
    }

    public Position createPosition(PositionDTO positionDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER", "ADMIN"));
        Position position = new Position();
        position.setPositionName(positionDTO.getPositionName());
        position.setDescription(positionDTO.getDescription());
        position.setBasicSalary(positionDTO.getBasicSalary());
        if (positionDTO.getDepartment() != null && positionDTO.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(positionDTO.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            position.setDepartment(department);
        }

        return positionRepository.save(position);
    }

    public Position updatePosition(Long id, PositionDTO positionDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER", "ADMIN"));
        Position position = findById(id);
        updatePositionFields(position, positionDTO);
        return positionRepository.save(position);
    }

    private void updatePositionFields(Position position, PositionDTO positionDTO) {
        position.setPositionName(positionDTO.getPositionName());
        position.setDescription(positionDTO.getDescription());
        if (positionDTO.getBasicSalary() != null && !positionDTO.getBasicSalary().equals(position.getBasicSalary())) {
            position.setBasicSalary(positionDTO.getBasicSalary());
            updateSalariesForPosition(position);
        }
        if (positionDTO.getDepartment() != null && positionDTO.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(positionDTO.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            position.setDepartment(department);
        }
    }

    public void updateSalariesForPosition(Position position) {
        List<Employee> employees = employeeRepository.findByPositionId(position.getId());
        for (Employee employee : employees) {
            List<Salary> salaries = salaryRepository.findByEmployeeId(employee.getId());
            for (Salary salary : salaries) {
                salary.setBasicSalary(position.getBasicSalary());
                salary.calculateTotalSalary(); // Tính lại tổng lương
                salaryRepository.save(salary);
            }
        }
    }

    public void deletePosition(Long id) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER", "ADMIN"));
        Position position = findById(id);
        for (Employee employee : position.getEmployees()) {
            employee.setPosition(null);
            employeeService.save(employee);
        }
        positionRepository.deleteById(id);
    }

    public void assignPositionToEmployee(Long positionId, Long employeeId) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER", "ADMIN"));
        Position position = findById(positionId);
        Employee employee = employeeService.findById(employeeId);
        employee.setPosition(position);
        employeeService.save(employee);
    }

    private void checkRole(User user, List<String> roles) {
        if (user == null || !roles.contains(user.getRole())) {
            throw new RuntimeException("User does not have the required role");
        }
    }
}
