package bizworks.backend.services;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.SalaryDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.Salary;
import bizworks.backend.models.Violation;
import bizworks.backend.repository.EmployeeRepository;
import bizworks.backend.repository.SalaryRepository;
import bizworks.backend.repository.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;
    private final ViolationRepository violationRepository;

    @Autowired
    public SalaryService(SalaryRepository salaryRepository , EmployeeRepository employeeRepository, ViolationRepository violationRepository) {
        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
        this.violationRepository = violationRepository;
    }

    public SalaryDTO createSalary(SalaryDTO dto) {
        Salary salary = new Salary();
        salary.setSalaryCode(generateSalaryCode()); // Tạo mã tự động cho phiếu lương
        salary.setMonth(dto.getMonth());
        salary.setYear(dto.getYear());
        salary.setBasicSalary(dto.getBasicSalary());
        salary.setBonusSalary(dto.getBonusSalary());
        salary.setOvertimeSalary(dto.getOvertimeSalary());
        salary.setAllowances(dto.getAllowances());

        List<Violation> violations = violationRepository.findByEmployeeId(dto.getEmployee().getId());
        double totalViolationMoney = violations.stream()
                .mapToDouble(v -> v.getViolationType().getViolationMoney())
                .sum();

        // Gán tổng tiền vi phạm vào trường deductions
        salary.setDeductions(totalViolationMoney);

        // Tính tổng lương
        salary.setTotalSalary(calculateTotalSalary(salary));
        salary.setDateSalary(LocalDateTime.now()); // Ngày nhận lương
        salary.setCreatedAt(LocalDateTime.now()); // Ngày tạo bản ghi
        salary.setUpdatedAt(LocalDateTime.now()); // Ngày cập nhật bản ghi

        Employee employee = employeeRepository.findById(dto.getEmployee().getId()).orElse(null);
        salary.setEmployee(employee);

        Salary saved = salaryRepository.save(salary);
        return convertToDTO(saved);
    }


    public List<SalaryDTO> getAllSalaries() {
        List<Salary> salaries = salaryRepository.findAll();
        return salaries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SalaryDTO getSalaryById(Long id) {
        Optional<Salary> salary = salaryRepository.findById(id);
        return salary.map(this::convertToDTO).orElse(null);
    }

    public SalaryDTO updateSalary(Long id, SalaryDTO dto) {
        Optional<Salary> optional = salaryRepository.findById(id);
        if (optional.isPresent()) {
            Salary s = optional.get();
            s.setSalaryCode(dto.getSalaryCode()); // Có thể cần thay đổi mã lương
            s.setMonth(dto.getMonth());
            s.setYear(dto.getYear());
            s.setBasicSalary(dto.getBasicSalary());
            s.setBonusSalary(dto.getBonusSalary());
            s.setOvertimeSalary(dto.getOvertimeSalary());
            s.setAllowances(dto.getAllowances());

            List<Violation> violations = violationRepository.findByEmployeeId(dto.getEmployee().getId());
            double totalViolationMoney = violations.stream()
                    .mapToDouble(v -> v.getViolationType().getViolationMoney())
                    .sum();
            s.setDeductions(totalViolationMoney);

            // Tính tổng lương
            s.setTotalSalary(calculateTotalSalary(s));
            s.setUpdatedAt(LocalDateTime.now()); // Cập nhật ngày giờ
            Salary updated = salaryRepository.save(s);
            return convertToDTO(updated);
        }
        return null;
    }


    public void deleteSalary(Long id) {
        salaryRepository.deleteById(id);
    }

    public List<SalaryDTO> searchSalariesByEmployeeName(String employeeName) {
        List<Salary> salaries = salaryRepository.findByEmployeeFullnameContaining(employeeName); // Đã sửa ở đây
        return salaries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public List<SalaryDTO> searchSalariesByMonthAndYear(Integer month, Integer year) {
        List<Salary> salaries = salaryRepository.findByMonthAndYear(month, year);
        return salaries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SalaryDTO> searchSalariesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Salary> salaries = salaryRepository.findByDateSalaryBetween(startDate, endDate);
        return salaries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private double calculateTotalSalary(Salary salary) {
        return salary.getBasicSalary()
                + salary.getBonusSalary()
                + salary.getOvertimeSalary()
                + salary.getAllowances()
                - salary.getDeductions();
    }

    private SalaryDTO convertToDTO(Salary salary) {
        Employee employee = salary.getEmployee();
        EmployeeDTO employeeDTO = (employee != null)
                ? new EmployeeDTO(employee.getId(), employee.getFullname(), employee.getEmail())
                : null;        return new SalaryDTO(
                salary.getId(),
                salary.getSalaryCode(),
                salary.getMonth(),
                salary.getYear(),
                salary.getBasicSalary(),
                salary.getBonusSalary(),
                salary.getOvertimeSalary(),
                salary.getAllowances(),
                salary.getDeductions(),
                salary.getTotalSalary(),
                Date.from(salary.getDateSalary().atZone(java.time.ZoneId.systemDefault()).toInstant()),
                employeeDTO,
                Date.from(salary.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant()),
                Date.from(salary.getUpdatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant())
        );
    }

    private String generateSalaryCode() {
        // Logic to generate unique salary code
        return "SAL-" + System.currentTimeMillis(); // Ví dụ đơn giản
    }
}
