package bizworks.backend.controllers;

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
            @ModelAttribute EmployeeUpdateDTO request,
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
}
