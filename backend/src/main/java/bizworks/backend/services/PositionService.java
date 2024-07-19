package com.example.projects.services;


import com.example.projects.dtos.PositionDTO;
import com.example.projects.models.Department;
import com.example.projects.models.Position;
import com.example.projects.repositories.DepartmentRepository;
import com.example.projects.repositories.PositionRepository;
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
                    .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + positionDTO.getDepartmentId()));
            position.setDepartment(department);
        } else if (positionDTO.getDepartmentName() != null) {
            Department department = departmentRepository.findByDepartmentName(positionDTO.getDepartmentName())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found with name: " + positionDTO.getDepartmentName()));
            position.setDepartment(department);
        }

        return positionRepository.save(position);
    }
    public void deletePosition(Long id) {
        positionRepository.deleteById(id);
    }

    public Position updatePosition(Long id, Position positionDetails) {
        Position position = positionRepository.findById(id).orElseThrow(() -> new RuntimeException("Position not found"));
        position.setPositionName(positionDetails.getPositionName());
        position.setEmployees(positionDetails.getEmployees());
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

        return dto;
    }
}
