package com.example.bizwebsite.services;

import com.example.bizwebsite.dtos.DepartmentDTO;
import com.example.bizwebsite.dtos.EmployeeDTO;
import com.example.bizwebsite.dtos.PositionDTO;
import com.example.bizwebsite.models.Department;
import com.example.bizwebsite.models.TrainingProgram;
import com.example.bizwebsite.repositories.DepartmentRepository;
import com.example.bizwebsite.repositories.EmployeeRepository;
import com.example.bizwebsite.repositories.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository; // Cần có repository cho Position
    @Autowired
    private EmployeeRepository employeeRepository; // Cần có repository cho Employee

    // Method to fetch all departments and convert them to DTOs
    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Method to fetch a department by its ID
    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Department saveDepartment(DepartmentDTO departmentDTO) {
        // Check if department with the same name already exists
        Optional<Department> existingDepartment = departmentRepository
                .findByDepartmentName(departmentDTO.getDepartmentName());
        if (existingDepartment.isPresent()) {
            throw new RuntimeException("Department with name " + departmentDTO.getDepartmentName() + " already exists");
        }

        // Create new department
        Department department = new Department();
        department.setDepartmentName(departmentDTO.getDepartmentName());
        return departmentRepository.save(department);
    }

    // Method to delete a department by its ID
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));

        // Check if there are associated training programs and delete them
        List<TrainingProgram> trainingPrograms = department.getTrainingPrograms();
        if (!trainingPrograms.isEmpty()) {

        }

        // Delete the department
        departmentRepository.delete(department);
    }

    // Method to update an existing department
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // Update department details
        department.setDepartmentName(departmentDetails.getDepartmentName());
        department.setPositions(departmentDetails.getPositions());
        department.setEmployees(departmentDetails.getEmployees());

        return departmentRepository.save(department);
    }

    public DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getDepartmentName());

        // Map positions to PositionDTOs
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

                        // Set employee information for each position
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
                            positionDTO.setEmployee(employeeDTO);
                        }

                        return positionDTO;
                    })
                    .collect(Collectors.toList());
            dto.setPositions(positionDTOs);
        }

        return dto;
    }
}
