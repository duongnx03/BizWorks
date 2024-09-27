package bizworks.backend.controllers.hrdepartment;
import bizworks.backend.dtos.AllowanceDTO;
import bizworks.backend.dtos.AssignAllowanceToEmployeeDTO;
import bizworks.backend.dtos.EmployeeAllowanceDTO;
import bizworks.backend.models.Allowance;
import bizworks.backend.models.EmployeeAllowance;
import bizworks.backend.services.AllowanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/allowances")
public class AllowanceController {

    @Autowired
    private AllowanceService allowanceService;

    // Tạo mới Allowance
    @PostMapping
    public ResponseEntity<Allowance> createAllowance(@Valid @RequestBody AllowanceDTO allowanceDTO) {
        Allowance createdAllowance = allowanceService.createAllowance(allowanceDTO);
        return new ResponseEntity<>(createdAllowance, HttpStatus.CREATED);
    }

    // Gán Allowance cho nhiều nhân viên
    @PostMapping("/assign-allowance")
    public ResponseEntity<EmployeeAllowanceDTO> assignAllowanceToEmployees(@RequestBody AssignAllowanceToEmployeeDTO dto) {
        EmployeeAllowanceDTO createdAllowanceDTO = allowanceService.assignAllowanceToEmployees(dto);
        return ResponseEntity.ok(createdAllowanceDTO);
    }

}