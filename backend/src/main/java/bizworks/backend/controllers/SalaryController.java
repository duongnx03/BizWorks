package bizworks.backend.controllers;

import bizworks.backend.dtos.SalaryDTO;
import bizworks.backend.services.SalaryService;
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
    public ResponseEntity<SalaryDTO> createSalary(@RequestBody SalaryDTO dto) {
        SalaryDTO created = salaryService.createSalary(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<SalaryDTO>> getAllSalaries() {
        List<SalaryDTO> salaries = salaryService.getAllSalaries();
        return ResponseEntity.ok(salaries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryDTO> getSalaryById(@PathVariable Long id) {
        SalaryDTO salary = salaryService.getSalaryById(id);
        return salary != null ? ResponseEntity.ok(salary) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryDTO> updateSalary(@PathVariable Long id, @RequestBody SalaryDTO dto) {
        SalaryDTO updated = salaryService.updateSalary(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<SalaryDTO>> searchSalaries(@RequestParam String employeeName) {
        List<SalaryDTO> salaries = salaryService.searchSalariesByEmployeeName(employeeName);
        return ResponseEntity.ok(salaries);
    }

    @GetMapping("/search-by-month-year")
    public ResponseEntity<List<SalaryDTO>> searchSalariesByMonthAndYear(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        List<SalaryDTO> salaries = salaryService.searchSalariesByMonthAndYear(month, year);
        return ResponseEntity.ok(salaries);
    }

    @GetMapping("/search-by-date")
    public ResponseEntity<List<SalaryDTO>> searchSalariesByDate(
            @RequestParam LocalDateTime fromDate,
            @RequestParam LocalDateTime toDate) {
        List<SalaryDTO> salaries = salaryService.searchSalariesByDateRange(fromDate, toDate);
        return ResponseEntity.ok(salaries);
    }
}
