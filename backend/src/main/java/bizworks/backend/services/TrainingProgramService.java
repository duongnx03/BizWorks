package com.example.bizwebsite.services;

import com.example.bizwebsite.dtos.TrainingProgramDTO;
import com.example.bizwebsite.models.Department;
import com.example.bizwebsite.models.Employee;
import com.example.bizwebsite.models.TrainingProgram;
import com.example.bizwebsite.repositories.DepartmentRepository;
import com.example.bizwebsite.repositories.EmployeeRepository;
import com.example.bizwebsite.repositories.TrainingProgramRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingProgramService {

    @Autowired
    private TrainingProgramRepository trainingProgramRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmailService emailService;

    public List<TrainingProgramDTO> getAllTrainingPrograms() {
        return trainingProgramRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TrainingProgramDTO getTrainingProgramById(Long id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Training Program not found with id: " + id));
        return convertToDTO(trainingProgram);
    }

    public Optional<TrainingProgram> saveTrainingProgram(TrainingProgramDTO trainingProgramDTO) {
        // Check if a TrainingProgram with the same name already exists
        Optional<TrainingProgram> existingProgram = trainingProgramRepository
                .findByProgramName(trainingProgramDTO.getProgramName());
        if (existingProgram.isPresent()) {
            return Optional.empty(); // Indicate that a conflict occurred
        }

        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setProgramName(trainingProgramDTO.getProgramName());
        trainingProgram.setStartDate(trainingProgramDTO.getStartDate());
        trainingProgram.setEndDate(trainingProgramDTO.getEndDate());

        if (trainingProgramDTO.getDepartmentId() != null) {
            Department department = departmentRepository.findById(trainingProgramDTO.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));
            trainingProgram.setDepartment(department);
        }

        if (trainingProgramDTO.getTrainerId() != null) {
            Employee trainer = employeeRepository.findById(trainingProgramDTO.getTrainerId())
                    .orElseThrow(() -> new EntityNotFoundException("Trainer not found"));
            trainingProgram.setTrainer(trainer);
        }

        if (trainingProgramDTO.getEmployeeIds() != null) {
            List<Employee> employees = employeeRepository.findAllById(trainingProgramDTO.getEmployeeIds());
            trainingProgram.setEmployees(employees);

            // Send HTML email notifications to employees
            for (Employee employee : employees) {
                emailService.sendHtmlEmail(
                        employee.getEmail(),
                        "Training Program Enrollment",
                        employee.getFullname(),
                        trainingProgramDTO.getProgramName(),
                        trainingProgramDTO.getStartDate().toString(),
                        trainingProgramDTO.getEndDate().toString());
            }
        }

        TrainingProgram savedProgram = trainingProgramRepository.save(trainingProgram);
        return Optional.of(savedProgram);
    }

    public TrainingProgram updateTrainingProgram(Long id, TrainingProgramDTO trainingProgramDTO) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Training Program not found with id: " + id));

        trainingProgram.setProgramName(trainingProgramDTO.getProgramName());
        trainingProgram.setStartDate(trainingProgramDTO.getStartDate());
        trainingProgram.setEndDate(trainingProgramDTO.getEndDate());

        if (trainingProgramDTO.getDepartmentId() != null) {
            Department department = departmentRepository.findById(trainingProgramDTO.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found"));
            trainingProgram.setDepartment(department);
        }

        if (trainingProgramDTO.getTrainerId() != null) {
            Employee trainer = employeeRepository.findById(trainingProgramDTO.getTrainerId())
                    .orElseThrow(() -> new EntityNotFoundException("Trainer not found"));
            trainingProgram.setTrainer(trainer);
        } else {
            trainingProgram.setTrainer(null);
        }

        if (trainingProgramDTO.getEmployeeIds() != null) {
            List<Employee> employees = employeeRepository.findAllById(trainingProgramDTO.getEmployeeIds());
            trainingProgram.setEmployees(employees);
        } else {
            trainingProgram.setEmployees(null);
        }

        return trainingProgramRepository.save(trainingProgram);
    }

    public void deleteTrainingProgram(Long id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Training Program not found with id: " + id));
        trainingProgramRepository.deleteById(id);
    }

    public TrainingProgramDTO convertToDTO(TrainingProgram trainingProgram) {
        TrainingProgramDTO dto = new TrainingProgramDTO();
        dto.setId(trainingProgram.getId());
        dto.setProgramName(trainingProgram.getProgramName());
        dto.setStartDate(trainingProgram.getStartDate());
        dto.setEndDate(trainingProgram.getEndDate());

        if (trainingProgram.getDepartment() != null) {
            dto.setDepartmentId(trainingProgram.getDepartment().getId());
            dto.setDepartmentName(trainingProgram.getDepartment().getDepartmentName());
        }

        if (trainingProgram.getTrainer() != null) {
            dto.setTrainerId(trainingProgram.getTrainer().getId());
            dto.setTrainerName(trainingProgram.getTrainer().getFullname());
        }

        if (trainingProgram.getEmployees() != null) {
            dto.setEmployeeIds(trainingProgram.getEmployees().stream()
                    .map(Employee::getId)
                    .collect(Collectors.toList()));
            dto.setEmployeeNames(trainingProgram.getEmployees().stream()
                    .map(Employee::getFullname)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
