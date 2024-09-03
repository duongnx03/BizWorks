package bizworks.backend.services;

import bizworks.backend.dtos.PositionDTO;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import bizworks.backend.models.User;
import bizworks.backend.repositories.PositionRepository;
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
    private AuthenticationService authenticationService;

    @Autowired
    private EmployeeService employeeService;

    public Position findById(Long id) {
        Optional<Position> optionalPosition = positionRepository.findById(id);
        if (optionalPosition.isPresent()) {
            return optionalPosition.get();
        } else {
            throw new RuntimeException("Position not found with id " + id);
        }
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
                .map(position -> {
                    PositionDTO dto = PositionDTO.from(position);
                    dto.setEmployees(position.getEmployees().stream()
                            .map(Employee::getFullname)
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Position createPosition(PositionDTO positionDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER")); // Kiểm tra vai trò
        Position position = new Position();
        position.setPositionName(positionDTO.getPositionName());
        position.setDescription(positionDTO.getDescription());
        return positionRepository.save(position);
    }
    public Position updatePosition(Long id, PositionDTO positionDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "Leader"));
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
        position.setPositionName(positionDTO.getPositionName());
        position.setDescription(positionDTO.getDescription());
        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "Leader"));
        positionRepository.deleteById(id);
    }

    public void assignPositionToEmployee(Long positionId, Long employeeId) {
        User currentUser = authenticationService.getCurrentUser();
        System.out.println("Current User: " + currentUser.getEmail() + " with role: " + currentUser.getRole());
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER")); // Kiểm tra vai trò của người dùng
        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new RuntimeException("Position not found"));
        System.out.println("Found Position: " + position.getPositionName());
        Employee employee = employeeService.findById(employeeId);
        System.out.println("Found Employee: " + employee.getFullname());
        employee.setPosition(position);
        employeeService.save(employee);
    }
    public List<Position> listAllPositions() {
        return positionRepository.findAll();
    }

    public Position getPositionById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
    }

    private void checkRole(User user, List<String> allowedRoles) {
        if (!allowedRoles.contains(user.getRole())) {
            throw new RuntimeException("User does not have the required permissions.");
        }
    }
}
