package com.example.bizwebsite.services;

import com.example.bizwebsite.dtos.EmployeeDTO;
import com.example.bizwebsite.dtos.PositionDTO;
import com.example.bizwebsite.models.Department;
import com.example.bizwebsite.models.Employee;
import com.example.bizwebsite.models.Position;
import com.example.bizwebsite.repositories.DepartmentRepository;
import com.example.bizwebsite.repositories.EmployeeRepository;
import com.example.bizwebsite.repositories.PositionRepository;
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
        List<Position> positions = positionRepository.findAll();
        return positions.stream()
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
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Department not found with id: " + positionDTO.getDepartmentId()));
            position.setDepartment(department);
        } else if (positionDTO.getDepartmentName() != null) {
            Department department = departmentRepository.findByDepartmentName(positionDTO.getDepartmentName())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Department not found with name: " + positionDTO.getDepartmentName()));
            position.setDepartment(department);
        }

        if (positionDTO.getEmployee() != null && positionDTO.getEmployee().getId() != null) {
            Employee employee = employeeRepository.findById(positionDTO.getEmployee().getId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Employee not found with id: " + positionDTO.getEmployee().getId()));
            position.setEmployee(employee);
        }

        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {
        positionRepository.deleteById(id);
    }

    public Position updatePosition(Long id, Position positionDetails) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
        position.setPositionName(positionDetails.getPositionName());
        position.setEmployee(positionDetails.getEmployee());
        position.setDepartment(positionDetails.getDepartment());
        return positionRepository.save(position);
    }

    private PositionDTO convertToDTO(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());

        // Set department information
        if (position.getDepartment() != null) {
            dto.setDepartmentId(position.getDepartment().getId());
            dto.setDepartmentName(position.getDepartment().getDepartmentName());
        }

        // Set employee information
        if (position.getEmployee() != null) {
            EmployeeDTO employeeDTO = new EmployeeDTO();
            employeeDTO.setId(position.getEmployee().getId());
            employeeDTO.setFullname(position.getEmployee().getFullname());
            employeeDTO.setDob(position.getEmployee().getDob());
            employeeDTO.setAddress(position.getEmployee().getAddress());
            employeeDTO.setGender(position.getEmployee().getGender());
            employeeDTO.setEmail(position.getEmployee().getEmail());
            employeeDTO.setPhone(position.getEmployee().getPhone());
            employeeDTO.setAvatar(position.getEmployee().getAvatar());
            employeeDTO.setStartDate(position.getEmployee().getStartDate());
            employeeDTO.setEndDate(position.getEmployee().getEndDate());
            dto.setEmployee(employeeDTO);
        }

        return dto;
    }
}
