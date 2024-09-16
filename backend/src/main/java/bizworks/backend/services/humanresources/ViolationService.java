package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.dtos.ViolationTypeDTO;
import bizworks.backend.models.Employee;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        checkRole(currentUser, Arrays.asList("LEADER", "MANAGE", "ADMIN"));

        // Lấy thông tin employee
        Violation violation = new Violation();
        Employee employee = employeeRepository.findById(dto.getEmployee().getId()).orElse(null);
        if (employee == null) {
            throw new IllegalArgumentException("Employee not found.");
        }

        // Kiểm tra role của employee dựa trên vai trò của currentUser
        if ("LEADER".equals(currentUser.getRole())) {
            // LEADER chỉ được tạo vi phạm cho employee có role là EMPLOYEE
            if (!"EMPLOYEE".equals(employee.getUser().getRole())) {
                throw new AccessDeniedException("Leader can only create violations for employees with role EMPLOYEE.");
            }
            violation.setStatus("Pending");
        } else if ("MANAGE".equals(currentUser.getRole())) {
            // MANAGE chỉ được tạo vi phạm cho EMPLOYEE và LEADER, không được tạo cho ADMIN
            String employeeRole = employee.getUser().getRole();
            if (!"EMPLOYEE".equals(employeeRole) && !"LEADER".equals(employeeRole)) {
                throw new AccessDeniedException("Manage can only create violations for EMPLOYEE or LEADER.");
            }
            violation.setStatus("Approved");
        } else if ("ADMIN".equals(currentUser.getRole())) {
            // ADMIN có quyền tạo cho tất cả các role
            violation.setStatus("Approved");
        }

        // Tiếp tục gán các thông tin còn lại cho violation
        violation.setEmployee(employee);
        violation.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
        violation.setViolationDate(dto.getViolationDate());
        violation.setDescription(dto.getDescription());
        violation.setCreatedDate(LocalDateTime.now());
        violation.setUpdatedAt(LocalDateTime.now());

        // Lưu vi phạm
        Violation saved = violationRepository.save(violation);

        // Gửi email nếu là MANAGE hoặc ADMIN
        if ("MANAGE".equals(currentUser.getRole()) || "ADMIN".equals(currentUser.getRole())) {
            sendViolationEmail(saved, "created");
        }

        // Cập nhật lương cho employee
        updateSalaryForEmployee(saved.getEmployee().getId());

        return convertToViolationDTO(saved);
    }

    public ViolationDTO updateViolation(Long id, ViolationDTO dto) {
        // Lấy thông tin người dùng hiện tại
        User currentUser = authenticationService.getCurrentUser();

        // Kiểm tra quyền hạn của người dùng
        checkRole(currentUser, Arrays.asList("LEADER", "MANAGE", "ADMIN"));

        return violationRepository.findById(id)
                .map(v -> {
                    boolean hasChanges = false;

                    // Cập nhật các trường tùy thuộc vào vai trò người dùng
                    if (currentUser.getRole().equals("LEADER")) {
                        // LEADER không thể thay đổi trạng thái
                        if (dto.getEmployee() != null && !dto.getEmployee().equals(v.getEmployee())) {
                            v.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
                            hasChanges = true;
                        }
                        if (dto.getViolationType() != null && !dto.getViolationType().equals(v.getViolationType())) {
                            v.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
                            hasChanges = true;
                        }
                        if (dto.getViolationDate() != null && !dto.getViolationDate().equals(v.getViolationDate())) {
                            v.setViolationDate(dto.getViolationDate());
                            hasChanges = true;
                        }
                        if (dto.getDescription() != null && !dto.getDescription().equals(v.getDescription())) {
                            v.setDescription(dto.getDescription());
                            hasChanges = true;
                        }
                        // Không cho phép LEADER cập nhật status
                        v.setStatus(v.getStatus()); // Giữ nguyên status hiện tại
                    } else {
                        // ADMIN và MANAGE có thể cập nhật tất cả các trường
                        if (dto.getEmployee() != null && !dto.getEmployee().equals(v.getEmployee())) {
                            v.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
                            hasChanges = true;
                        }
                        if (dto.getViolationType() != null && !dto.getViolationType().equals(v.getViolationType())) {
                            v.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
                            hasChanges = true;
                        }
                        if (dto.getViolationDate() != null && !dto.getViolationDate().equals(v.getViolationDate())) {
                            v.setViolationDate(dto.getViolationDate());
                            hasChanges = true;
                        }
                        if (dto.getDescription() != null && !dto.getDescription().equals(v.getDescription())) {
                            v.setDescription(dto.getDescription());
                            hasChanges = true;
                        }
                        if (dto.getStatus() != null && !dto.getStatus().equals(v.getStatus())) {
                            v.setStatus(dto.getStatus());
                            hasChanges = true;
                        }
                    }
                    v.setUpdatedAt(LocalDateTime.now());

                    if (hasChanges) {
                        // Nếu có thay đổi, lưu cập nhật và gửi email
                        Violation updated = violationRepository.save(v);

                        // Gửi email thông báo về việc cập nhật vi phạm
                        sendViolationEmail(updated, "updated");

                        // Cập nhật lương cho nhân viên liên quan
                        updateSalaryForEmployee(updated.getEmployee().getId());

                        return convertToViolationDTO(updated);
                    } else {
                        // Nếu không có thay đổi, trả về thông tin hiện tại
                        return convertToViolationDTO(v);
                    }
                })
                .orElse(null);
    }



    private void checkRole(User user, List<String> allowedRoles) {
        if (user == null) {
            throw new AccessDeniedException("User is not authenticated.");
        }
        if (!allowedRoles.contains(user.getRole())) {
            throw new AccessDeniedException("User does not have the required permissions. Required roles: " + allowedRoles);
        }
    }

    public void updateSalaryForEmployee(Long employeeId) {
        Optional<Salary> latestSalaryOpt = salaryRepository.findTopByEmployeeIdOrderByDateSalaryDesc(employeeId);

        if (latestSalaryOpt.isPresent()) {
            Salary latestSalary = latestSalaryOpt.get();

            // Lấy danh sách vi phạm của nhân viên đã được duyệt trong cùng tháng và năm của bản ghi lương
            List<Violation> violations = violationRepository.findByEmployeeId(employeeId).stream()
                    .filter(v -> "Approved".equals(v.getStatus()))
                    .filter(v -> v.getViolationDate().getMonthValue() == latestSalary.getMonth() &&
                            v.getViolationDate().getYear() == latestSalary.getYear())
                    .collect(Collectors.toList());

            // Tính tổng tiền vi phạm
            double totalViolationMoney = violations.stream()
                    .mapToDouble(v -> v.getViolationType().getViolationMoney())
                    .sum();

            // Cập nhật các khoản khấu trừ và tổng lương
            latestSalary.setDeductions(totalViolationMoney);
            latestSalary.setTotalSalary(calculateTotalSalary(latestSalary));

            // Lưu bản ghi lương đã cập nhật
            salaryRepository.save(latestSalary);
        }
    }

    private double calculateTotalSalary(Salary salary) {
        return salary.getBasicSalary()
                + salary.getBonusSalary()
                + salary.getOvertimeSalary()
                + salary.getAllowances()
                - salary.getDeductions()
                - salary.getAdvanceSalary();
    }

    public List<ViolationDTO> getAllViolations() {
        User currentUser = authenticationService.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User is not authenticated.");
        }

        if ("EMPLOYEE".equals(currentUser.getRole())) {
            // Nếu vai trò là employee, chỉ lấy những violation của employee đó
            return violationRepository.findByEmployeeId(currentUser.getEmployee().getId()).stream()
                    .map(this::convertToViolationDTO)
                    .collect(Collectors.toList());
        } else if ("LEADER".equals(currentUser.getRole())) {
            // Nếu vai trò là leader, chỉ lấy những violation của employee có role là EMPLOYEE
            return violationRepository.findByEmployeeUserRole("EMPLOYEE").stream()
                    .map(this::convertToViolationDTO)
                    .collect(Collectors.toList());
        } else if ("MANAGE".equals(currentUser.getRole())) {
            // Nếu vai trò là manage, lấy những violation của cả employee và leader
            return violationRepository.findByEmployeeUserRoleIn(Arrays.asList("EMPLOYEE", "LEADER")).stream()
                    .map(this::convertToViolationDTO)
                    .collect(Collectors.toList());
        } else if ("ADMIN".equals(currentUser.getRole())) {
            // Nếu vai trò là admin, trả về tất cả violation
            return violationRepository.findAll().stream()
                    .map(this::convertToViolationDTO)
                    .collect(Collectors.toList());
        } else {
            throw new AccessDeniedException("You do not have permission to view violations.");
        }
    }


    public ViolationDTO getViolationById(Long id) {
        return violationRepository.findById(id)
                .map(this::convertToViolationDTO)
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
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

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
                + "<td style=\"padding: 8px; border: 1px solid #ddd;\">" + violation.getDescription() + "</td>"
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
                violation.getDescription(),
                violation.getStatus(),
                violation.getCreatedDate(),
                violation.getUpdatedAt()
        );
    }
}
