package bizworks.backend.controllers;

import bizworks.backend.dtos.SalaryDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.services.accountant.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalaryDTO>> createSalary(@RequestBody SalaryDTO dto) {
        return salaryService.createSalary(dto);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalaryDTO>>> getAllSalaries() {
        return salaryService.getAllSalaries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SalaryDTO>> getSalaryById(@PathVariable Long id) {
        return salaryService.getSalaryById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SalaryDTO>> updateSalary(@PathVariable Long id, @RequestBody SalaryDTO dto) {
        return salaryService.updateSalary(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSalary(@PathVariable Long id) {
        return salaryService.deleteSalary(id);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<SalaryDTO>>> searchSalaries(@RequestParam String employeeName) {
        return salaryService.searchSalariesByEmployeeName(employeeName);
    }

    @GetMapping("/search-by-month-year")
    public ResponseEntity<ApiResponse<List<SalaryDTO>>> searchSalariesByMonthAndYear(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return salaryService.searchSalariesByMonthAndYear(month, year);
    }

    @GetMapping("/search-by-date")
    public ResponseEntity<ApiResponse<List<SalaryDTO>>> searchSalariesByDate(
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate) {
        return salaryService.searchSalariesByDateRange(fromDate, toDate);
    }

    @GetMapping("/search-by-code/{salaryCode}")
    public ResponseEntity<ApiResponse<SalaryDTO>> getSalaryByCode(@PathVariable String salaryCode) {
        return salaryService.getSalaryBySalaryCode(salaryCode);
    }
}
