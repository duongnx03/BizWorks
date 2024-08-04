package bizworks.backend.services;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.PositionDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import bizworks.backend.repository.DepartmentRepository;
import bizworks.backend.repository.EmployeeRepository;
import bizworks.backend.repository.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private EmployeeRepository employeeRepository;

    public List<PositionDTO> getAllPositions() {
        return positionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PositionDTO> getPositionsByDepartment(Long departmentId) {
        return positionRepository.findByDepartmentId(departmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Position> getPositionById(Long id) {
        return positionRepository.findById(id);
    }

    public Position savePosition(PositionDTO positionDTO) {
        Position position = new Position();
        position.setPositionName(positionDTO.getPositionName());

        if (positionDTO.getDepartmentId() != null) {
            Department department = departmentRepository.findById(positionDTO.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));
            position.setDepartment(department);
        }

        if (positionDTO.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(positionDTO.getEmployeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
            position.setEmployee(employee);
            // Save employee if necessary (if employee is new or changed)
            employeeRepository.save(employee);
        }

        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Position not found with id: " + id));

        if (position.getEmployee() != null) {
            position.getEmployee().setPosition(null);
            employeeRepository.save(position.getEmployee());
        }

        positionRepository.deleteById(id);
    }

    public Position updatePosition(Long id, PositionDTO positionDTO) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Position not found with id: " + id));

        position.setPositionName(positionDTO.getPositionName());

        if (positionDTO.getDepartmentId() != null) {
            Department department = departmentRepository.findById(positionDTO.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));
            position.setDepartment(department);
        } else {
            position.setDepartment(null);
        }

        if (positionDTO.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(positionDTO.getEmployeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
            position.setEmployee(employee);
            employee.setPosition(position);
            employeeRepository.save(employee);
        } else {
            position.setEmployee(null);
        }

        return positionRepository.save(position);
    }

    // Change this method to public
    public PositionDTO convertToDTO(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());

        if (position.getDepartment() != null) {
            dto.setDepartmentId(position.getDepartment().getId());
            dto.setDepartmentName(position.getDepartment().getDepartmentName());
        }

        if (position.getEmployee() != null) {
            EmployeeDTO employeeDTO = new EmployeeDTO();
            employeeDTO.setId(position.getEmployee().getId());
            employeeDTO.setFullname(position.getEmployee().getFullname());
            dto.setEmployee(employeeDTO);
        }

        return dto;
    }
}
