package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.dtos.ViolationTypeDTO;
import bizworks.backend.models.Salary;
import bizworks.backend.models.User;
import bizworks.backend.models.Violation;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.SalaryRepository;
import bizworks.backend.repositories.ViolationRepository;
import bizworks.backend.repositories.ViolationTypeRepository;
import bizworks.backend.services.AuthenticationService;
import bizworks.backend.services.MailService;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
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

    private final AuthenticationService authenticationService;

    public ViolationService(ViolationRepository violationRepository,
                            EmployeeRepository employeeRepository,
                            ViolationTypeRepository violationTypeRepository,
                            SalaryRepository salaryRepository,
                            MailService mailService,
                            AuthenticationService authenticationService) {
        this.violationRepository = violationRepository;
        this.employeeRepository = employeeRepository;
        this.violationTypeRepository = violationTypeRepository;
        this.salaryRepository = salaryRepository;
        this.mailService = mailService;
        this.authenticationService = authenticationService;
    }
    public ViolationDTO createViolation(ViolationDTO dto) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("LEADER", "MANAGE"));

        Violation violation = new Violation();
        violation.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
        violation.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
        violation.setViolationDate(dto.getViolationDate());
        violation.setReason(dto.getReason());
        violation.setStatus("Pending");

        Violation saved = violationRepository.save(violation);

//        sendViolationEmail(saved, "created");
        updateSalaryForEmployee(saved.getEmployee().getId());

        return convertToViolationDTO(saved);
    }

    private void checkRole(User user, List<String> allowedRoles) {
        if (user == null) {
            throw new RuntimeException("User is not authenticated.");
        }
        if (!allowedRoles.contains(user.getRole())) {
            throw new RuntimeException("User does not have the required permissions. Required roles: " + allowedRoles);
        }
    }

    public void updateSalaryForEmployee(Long employeeId) {
        Optional<Salary> latestSalaryOpt = salaryRepository.findTopByEmployeeIdOrderByDateSalaryDesc(employeeId);

        if (latestSalaryOpt.isPresent()) {
            Salary latestSalary = latestSalaryOpt.get();

            // Lấy danh sách vi phạm của nhân viên với trạng thái New hoặc Approved
            List<Violation> violations = violationRepository.findByEmployeeId(employeeId).stream()
                    .filter(v -> "Approved".equals(v.getStatus()))
                    .collect(Collectors.toList());

            // Tính tổng tiền vi phạm
            double totalViolationMoney = violations.stream()
                    .mapToDouble(v -> v.getViolationType().getViolationMoney())
                    .sum();

            latestSalary.setDeductions(totalViolationMoney);
            latestSalary.setTotalSalary(calculateTotalSalary(latestSalary));

            salaryRepository.save(latestSalary);
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
        return violationRepository.findAll().stream()
                .map(this::convertToViolationDTO)
                .collect(Collectors.toList());
    }

    public ViolationDTO getViolationById(Long id) {
        return violationRepository.findById(id)
                .map(this::convertToViolationDTO)
                .orElse(null);
    }

    public ViolationDTO updateViolation(Long id, ViolationDTO dto) {
        return violationRepository.findById(id)
                .map(v -> {
                    v.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
                    v.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
                    v.setViolationDate(dto.getViolationDate());
                    v.setReason(dto.getReason());
                    v.setStatus(dto.getStatus());
                    Violation updated = violationRepository.save(v);

                    sendViolationEmail(updated, "updated");
                    updateSalaryForEmployee(updated.getEmployee().getId());
                    return convertToViolationDTO(updated);
                })
                .orElse(null);
    }

    public void deleteViolation(Long id) {
        violationRepository.findById(id)
                .ifPresent(violation -> {
                    Long employeeId = violation.getEmployee().getId();
                    violationRepository.deleteById(id);
                    updateSalaryForEmployee(employeeId);
                });
    }

    public List<ViolationDTO> searchViolationsByEmployeeName(String employeeName) {
        return violationRepository.findByEmployeeFullnameContaining(employeeName).stream()
                .map(this::convertToViolationDTO)
                .collect(Collectors.toList());
    }

    public List<ViolationDTO> sortViolationsByDate(Sort.Direction direction) {
        return violationRepository.findAll(Sort.by(direction, "violationDate")).stream()
                .map(this::convertToViolationDTO)
                .collect(Collectors.toList());
    }

    public void updateViolationStatus(Long id, String status) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE"));

        violationRepository.findById(id)
                .ifPresent(violation -> {
                    String currentStatus = violation.getStatus();

                    // Nếu trạng thái hiện tại và trạng thái mới giống nhau, bỏ qua cập nhật
                    if (currentStatus.equals(status)) {
                        throw new RuntimeException("Violation is already in the '" + status + "' status.");
                    }

                    // Tiếp tục nếu trạng thái không trùng
                    violation.setStatus(status);
                    violationRepository.save(violation);

                    // Cập nhật email và lương nếu cần
                    sendViolationEmail(violation, "status updated");
                    updateSalaryForEmployee(violation.getEmployee().getId());
                });
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

    private ViolationDTO convertToViolationDTO(Violation violation) {
        return new ViolationDTO(
                violation.getId(),
                violation.getEmployee() != null ? new EmployeeDTO(
                        violation.getEmployee().getId(),
                        violation.getEmployee().getEmpCode(),
                        violation.getEmployee().getFullname(),
                        violation.getEmployee().getEmail(),
                        violation.getEmployee().getPhone(),
                        violation.getEmployee().getAvatar(),
                        violation.getEmployee().getStartDate(),
                        violation.getEmployee().getDepartment() != null ? violation.getEmployee().getDepartment().getName() : null,
                        violation.getEmployee().getPosition() != null ? violation.getEmployee().getPosition().getPositionName() : null
                ) : null,
                violation.getViolationType() != null ? new ViolationTypeDTO(
                        violation.getViolationType().getId(),
                        violation.getViolationType().getType(),
                        violation.getViolationType().getViolationMoney()
                ) : null,
                violation.getViolationDate(),
                violation.getReason(),
                violation.getStatus()
        );
    }
}
