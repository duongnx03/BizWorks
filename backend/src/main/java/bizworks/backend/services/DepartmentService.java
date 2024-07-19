package com.example.projects.services;

import com.example.projects.dtos.DepartmentDTO;
import com.example.projects.dtos.PositionDTO;
import com.example.projects.models.Department;
import com.example.projects.models.Position;
import com.example.projects.repositories.DepartmentRepository;
import com.example.projects.repositories.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Department saveDepartment(DepartmentDTO departmentDTO) {
        Department department = new Department();
        department.setDepartmentName(departmentDTO.getDepartmentName());
        return departmentRepository.save(department);
    }
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        department.setDepartmentName(departmentDetails.getDepartmentName());
        department.setPositions(departmentDetails.getPositions());
        department.setEmployees(departmentDetails.getEmployees());
        return departmentRepository.save(department);
    }
    public DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getDepartmentName());

        // Set positions information
        if (department.getPositions() != null) {
            List<PositionDTO> positionDTOs = department.getPositions().stream()
                    .map(position -> {
                        PositionDTO positionDTO = new PositionDTO();
                        positionDTO.setId(position.getId());
                        positionDTO.setPositionName(position.getPositionName());

                        // Set department information for each position
                        if (position.getDepartment() != null) {
                            positionDTO.setDepartmentId(position.getDepartment().getId());
                            positionDTO.setDepartmentName(position.getDepartment().getDepartmentName());
                        }

                        return positionDTO;
                    })
                    .collect(Collectors.toList());
            dto.setPositions(positionDTOs);
        }

        return dto;
    }

}
