package bizworks.backend.services;

import bizworks.backend.dtos.AllowanceDTO;
import bizworks.backend.dtos.AssignAllowanceToEmployeeDTO;
import bizworks.backend.dtos.EmployeeAllowanceDTO;
import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.models.Allowance;
import bizworks.backend.models.Employee;
import bizworks.backend.models.EmployeeAllowance;
import bizworks.backend.repositories.AllowanceRepository;
import bizworks.backend.repositories.EmployeeAllowanceRepository;
import bizworks.backend.repositories.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AllowanceService {
    @Autowired
    private AllowanceRepository allowanceRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeAllowanceRepository employeeAllowanceRepository;

    public Allowance createAllowance(AllowanceDTO allowanceDTO) {
        Allowance allowance = new Allowance();
        allowance.setName(allowanceDTO.getName());
        allowance.setAmount(allowanceDTO.getAmount());
        allowance.setDescription(allowanceDTO.getDescription());
        allowance.setMonth(allowanceDTO.getMonth());
        allowance.setYear(allowanceDTO.getYear());
        allowance.setStatus(allowanceDTO.getStatus());
        allowance.setCreatedAt(LocalDateTime.now());
        allowance.setUpdatedAt(LocalDateTime.now());
        return allowanceRepository.save(allowance);
    }

    public EmployeeAllowanceDTO assignAllowanceToEmployees(AssignAllowanceToEmployeeDTO dto) {
        Allowance allowance = allowanceRepository.findById(dto.getAllowanceId())
                .orElseThrow(() -> new EntityNotFoundException("Allowance not found"));

        List<Long> employeeIds = dto.getEmployeeIds();
        List<EmployeeDTO> assignedEmployees = new ArrayList<>();

        for (Long employeeId : employeeIds) {
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

            // Check if the EmployeeAllowance already exists
            if (employeeAllowanceRepository.existsByEmployeeAndAllowance(employee, allowance)) {
                continue; // Skip if already assigned
            }

            // Create a new EmployeeAllowance
            EmployeeAllowance employeeAllowance = new EmployeeAllowance();
            employeeAllowance.setEmployee(employee);
            employeeAllowance.setAllowance(allowance);
            employeeAllowance.setCreatedAt(LocalDateTime.now());
            employeeAllowance.setUpdatedAt(LocalDateTime.now());

            // Save to the database
            employeeAllowanceRepository.save(employeeAllowance);

            // Create an EmployeeDTO for the assigned employee
            EmployeeDTO employeeDTO = EmployeeDTO.from(employee);
            assignedEmployees.add(employeeDTO);
        }

        // Create and return the EmployeeAllowanceDTO
        return new EmployeeAllowanceDTO(allowance.getId(), allowance.getId(), assignedEmployees, LocalDateTime.now(), LocalDateTime.now());
    }


}
