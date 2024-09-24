package bizworks.backend.controllers;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.EmployeeResponseDTO;
import bizworks.backend.dtos.EmployeeUpdateDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.Employee;
import bizworks.backend.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    @PostMapping("/batch")
    public ResponseEntity<List<Employee>> getEmployeesByIds(@RequestBody List<Long> ids) {
        List<Employee> employees = employeeService.findAllByIds(ids);
        return ResponseEntity.ok(employees);
    }
    @GetMapping("/human-resources")
    public ResponseEntity<List<EmployeeDTO>> getHumanResourcesEmployees() {
        List<Employee> employees = employeeService.getEmployeesByDepartment("Human Resources");
        List<EmployeeDTO> employeeDTOs = employees.stream()
                .map(employee -> new EmployeeDTO(employee.getId(), employee.getFullname()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(employeeDTOs);
    }
    @GetMapping("/getAllEmployees")
    public ResponseEntity<ApiResponse<?>> findAll() {
        try {
            List<Employee> employees = employeeService.findAll();
            if (employees == null || employees.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(null, "Empty Employee"));
            }
            // Chuyển đổi danh sách Employee sang danh sách EmployeeDTO khi cần
            List<EmployeeResponseDTO> employeeDTOs = employees.stream().map(employeeService::convertToDTO).collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeDTOs, "Get All Employees successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getEmployee")
    public ResponseEntity<ApiResponse<?>> getEmployeeByEmail() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            EmployeeResponseDTO employeeDTO = employeeService.getEmployeeByEmail(email);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeDTO, "Get employee successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getEmployeeById/{id}")
    public ResponseEntity<ApiResponse<?>> getEmployeeById(@PathVariable Long id) {
        try {
            EmployeeResponseDTO employeeDTO = employeeService.getEmployeeById(id);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeDTO, "Get employee successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PutMapping("/updateEmployee")
    public ResponseEntity<ApiResponse<?>> updateEmployee(
            @RequestBody EmployeeUpdateDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest().body(ApiResponse.badRequest(bindingResult));
            }

            employeeService.updateEmployee(request);

            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Update successful"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @GetMapping("/getEmployeesByRole")
    public ResponseEntity<ApiResponse<?>> getEmployeesByRole() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String role = authentication.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .findFirst()
                    .orElse("EMPLOYEE");
            List<Employee> employees;
            switch (role) {
                case "ADMIN":
                    employees = employeeService.findByRoleIn(List.of("MANAGE", "LEADER", "EMPLOYEE"));
                    break;
                case "MANAGE":
                    employees = employeeService.findByRoleIn(List.of("LEADER", "EMPLOYEE"));
                    break;
                case "LEADER":
                    employees = employeeService.findByRole("EMPLOYEE");
                    break;
                default:
                    employees = List.of(); // Default to empty list if role is unknown
                    break;
            }
            List<EmployeeResponseDTO> employeeDTOs = employees.stream().map(employeeService::convertToDTO).collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(employeeDTOs, "Get Employees by Role successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}