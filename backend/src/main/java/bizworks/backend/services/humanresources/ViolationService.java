package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.dtos.ViolationTypeDTO;
import bizworks.backend.models.Salary;
import bizworks.backend.models.Violation;
import bizworks.backend.repository.EmployeeRepository;
import bizworks.backend.repository.SalaryRepository;
import bizworks.backend.repository.ViolationRepository;
import bizworks.backend.repository.ViolationTypeRepository;
import bizworks.backend.services.MailService;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ViolationService {
    private final ViolationRepository violationRepository;
    private final EmployeeRepository employeeRepository;
    private final ViolationTypeRepository violationTypeRepository;
    private final SalaryRepository salaryRepository;

    private final MailService mailService;

    public ViolationService(ViolationRepository violationRepository,
                            EmployeeRepository employeeRepository,
                            ViolationTypeRepository violationTypeRepository,
                            SalaryRepository salaryRepository,
                            MailService mailService) {
        this.violationRepository = violationRepository;
        this.employeeRepository = employeeRepository;
        this.violationTypeRepository = violationTypeRepository;
        this.salaryRepository = salaryRepository;
        this.mailService = mailService;
    }

    public ViolationDTO createViolation(ViolationDTO dto) {
        Violation violation = new Violation();

        // Tìm Employee và ViolationType từ DTO
        violation.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
        violation.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));

        // Thiết lập các thuộc tính khác
        violation.setViolationDate(dto.getViolationDate());
        violation.setReason(dto.getReason());
        violation.setStatus("New");

        // Lưu đối tượng Violation vào cơ sở dữ liệu
        Violation saved = violationRepository.save(violation);

        sendViolationEmail(saved, "created");

        // Cập nhật lương cho nhân viên sau khi tạo vi phạm
        updateSalaryForEmployee(saved.getEmployee().getId());

        // Tạo và trả về ViolationDTO
        return new ViolationDTO(
                saved.getId(),
                new EmployeeDTO(saved.getEmployee().getId(), saved.getEmployee().getFullname(), saved.getEmployee().getEmail(), saved.getEmployee().getPhone(), saved.getEmployee().getAvatar(),saved.getEmployee().getStartDate(),saved.getEmployee().getDepartment().getDepartmentName(),saved.getEmployee().getPosition().getPositionName()), // Trả về EmployeeDTO
                new ViolationTypeDTO(saved.getViolationType().getId(), saved.getViolationType().getType(), saved.getViolationType().getViolationMoney()), // Trả về ViolationTypeDTO
                saved.getViolationDate(),
                saved.getReason(),
                saved.getStatus());
    }

    public void updateSalaryForEmployee(Long employeeId) {
        Optional<Salary> latestSalaryOpt = salaryRepository.findTopByEmployeeIdOrderByDateSalaryDesc(employeeId);

        if (latestSalaryOpt.isPresent()) {
            Salary latestSalary = latestSalaryOpt.get();

            // Tính toán lại deductions
            List<Violation> violations = violationRepository.findByEmployeeId(employeeId);
            double totalViolationMoney = violations.stream()
                    .mapToDouble(v -> v.getViolationType().getViolationMoney())
                    .sum();

            // Cập nhật deductions
            latestSalary.setDeductions(totalViolationMoney);
            latestSalary.setTotalSalary(calculateTotalSalary(latestSalary)); // Tính lại tổng lương

            salaryRepository.save(latestSalary); // Lưu cập nhật
        }
    }


    private double calculateTotalSalary(Salary salary) {
        return salary.getBasicSalary()
                + salary.getBonusSalary()
                + salary.getOvertimeSalary()
                + salary.getAllowances()
                - salary.getDeductions();
    }

    public List<ViolationDTO> getAllViolations() {
        List<Violation> violations = violationRepository.findAll();
        return violations.stream()
                .map(v -> new ViolationDTO(
                        v.getId(),
                        v.getEmployee() != null ? new EmployeeDTO(v.getEmployee().getId(), v.getEmployee().getFullname(), v.getEmployee().getEmail(), v.getEmployee().getPhone(), v.getEmployee().getAvatar(), v.getEmployee().getStartDate(), v.getEmployee().getDepartment() != null ? v.getEmployee().getDepartment().getDepartmentName() : null, v.getEmployee().getPosition() != null ? v.getEmployee().getPosition().getPositionName() : null) : null,
                        v.getViolationType() != null ? new ViolationTypeDTO(v.getViolationType().getId(), v.getViolationType().getType(), v.getViolationType().getViolationMoney()) : null,
                        v.getViolationDate(),
                        v.getReason(),
                        v.getStatus()))
                .collect(Collectors.toList());
    }

    public ViolationDTO getViolationById(Long id) {
        Optional<Violation> violation = violationRepository.findById(id);
        if (violation.isPresent()) {
            Violation v = violation.get();
            return new ViolationDTO(
                    v.getId(),
                    new EmployeeDTO(v.getEmployee().getId()), // Trả về EmployeeDTO
                    new ViolationTypeDTO(v.getViolationType().getId(), v.getViolationType().getType(), v.getViolationType().getViolationMoney()), // Trả về ViolationTypeDTO
                    v.getViolationDate(),
                    v.getReason(),
                    v.getStatus());
        }
        return null;
    }

    public ViolationDTO updateViolation(Long id, ViolationDTO dto) {
        Optional<Violation> optional = violationRepository.findById(id);
        if (optional.isPresent()) {
            Violation v = optional.get();
            v.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
            v.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
            v.setViolationDate(dto.getViolationDate());
            v.setReason(dto.getReason());
            v.setStatus(dto.getStatus());
            Violation updated = violationRepository.save(v);

            sendViolationEmail(v, "updated");
            updateSalaryForEmployee(updated.getEmployee().getId());
            return new ViolationDTO(
                    updated.getId(),
                    new EmployeeDTO(updated.getEmployee().getId(), updated.getEmployee().getFullname(),updated.getEmployee().getEmail(),updated.getEmployee().getPhone(),updated.getEmployee().getAvatar(),updated.getEmployee().getStartDate(),updated.getEmployee().getDepartment().getDepartmentName(),updated.getEmployee().getPosition().getPositionName()), // Trả về EmployeeDTO
                    new ViolationTypeDTO(updated.getViolationType().getId(), updated.getViolationType().getType(), updated.getViolationType().getViolationMoney()), // Trả về ViolationTypeDTO
                    updated.getViolationDate(),
                    updated.getReason(),
                    updated.getStatus());
        }
        return null; // Handle as needed
    }

    public void deleteViolation(Long id) {
        Optional<Violation> violationOpt = violationRepository.findById(id);
        if (violationOpt.isPresent()) {
            Violation violation = violationOpt.get();
            Long employeeId = violation.getEmployee().getId();
            violationRepository.deleteById(id);

            // Cập nhật lương cho nhân viên sau khi xoá vi phạm
            updateSalaryForEmployee(employeeId);
        }
    }


    public List<ViolationDTO> searchViolationsByEmployeeName(String employeeName) {
        // Tìm tất cả các vi phạm mà nhân viên có tên chứa employeeName
        List<Violation> violations = violationRepository.findByEmployeeFullnameContaining(employeeName);
        return violations.stream()
                .map(v -> new ViolationDTO(
                        v.getId(),
                        new EmployeeDTO(v.getEmployee().getId(), v.getEmployee().getFullname(), v.getEmployee().getEmail(), v.getEmployee().getPhone(), v.getEmployee().getAvatar(), v.getEmployee().getStartDate(), v.getEmployee().getDepartment().getDepartmentName(),v.getEmployee().getPosition().getPositionName()), // Trả về EmployeeDTO
                        new ViolationTypeDTO(v.getViolationType().getId(), v.getViolationType().getType(), v.getViolationType().getViolationMoney()), // Trả về ViolationTypeDTO
                        v.getViolationDate(),
                        v.getReason(),
                        v.getStatus()))
                .collect(Collectors.toList());
    }

    public List<ViolationDTO> sortViolationsByDate(Sort.Direction direction) {
        List<Violation> violations = violationRepository.findAll(Sort.by(direction, "violationDate"));
        return violations.stream()
                .map(v -> new ViolationDTO(
                        v.getId(),
                        new EmployeeDTO(v.getEmployee().getId()), // Trả về EmployeeDTO
                        new ViolationTypeDTO(v.getViolationType().getId(), v.getViolationType().getType(), v.getViolationType().getViolationMoney()), // Trả về ViolationTypeDTO
                        v.getViolationDate(),
                        v.getReason(),
                        v.getStatus()))
                .collect(Collectors.toList());
    }

    public void updateViolationStatus(Long id, String status) {
        Optional<Violation> optional = violationRepository.findById(id);
        if (optional.isPresent()) {
            Violation violation = optional.get();
            violation.setStatus(status);
            violationRepository.save(violation);
            sendViolationEmail(violation, "status updated");

            // Cập nhật lương cho nhân viên sau khi thay đổi trạng thái vi phạm
            updateSalaryForEmployee(violation.getEmployee().getId());
        }
    }

    private void sendViolationEmail(Violation violation, String action) {
        String to = violation.getEmployee().getEmail();
        String subject = "Violation " + action;
        String content = "<div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6;\">"
                + "<h2 style=\"color: #4CAF50;\">Dear " + violation.getEmployee().getFullname() + ",</h2>"
                + "<p>A violation has been <strong>" + action + "</strong>.</p>"
                + "<h3 style=\"color: #2196F3;\">Violation Details:</h3>"
                + "<table style=\"width: 100%; border-collapse: collapse;\">"
                + "<tr>"
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\"><strong>Violation Money:</strong></td>"
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\">" + violation.getViolationType().getViolationMoney() + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\"><strong>Description:</strong></td>"
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\">" + violation.getReason() + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\"><strong>Status:</strong></td>"
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\">" + violation.getStatus() + "</td>"
                + "</tr>"
                + "</table>"
                + "<p style=\"margin-top: 20px;\">Please contact the administrator for more information.</p>"
                + "<p>Best regards,</p>"
                + "<p style=\"color: #999;\">Bizworks Team</p>"
                + "</div>";

        try {
            mailService.sendEmail(to, subject, content);
        } catch (MessagingException e) {
            e.printStackTrace(); // Handle email sending error
        }
    }

}
