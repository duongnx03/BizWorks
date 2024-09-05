package bizworks.backend.services;

import bizworks.backend.dtos.PositionDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import bizworks.backend.models.User;
import bizworks.backend.repositories.DepartmentRepository;
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
    private DepartmentRepository departmentRepository;

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

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));

        position.setPositionName(positionDTO.getPositionName());
        position.setDescription(positionDTO.getDescription());

        if (positionDTO.getDepartment() != null && positionDTO.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(positionDTO.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            position.setDepartment(department);
        }

        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER", "ADMIN"));
        positionRepository.deleteById(id);
    }

    public void assignPositionToEmployee(Long positionId, Long employeeId) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "LEADER", "ADMIN"));

        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new RuntimeException("Position not found"));

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
