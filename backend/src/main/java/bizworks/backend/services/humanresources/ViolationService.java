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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        checkRole(currentUser, Arrays.asList("EMPLOYEE", "LEADER", "MANAGE", "ADMIN"));

        // Kiểm tra nhân viên
        Employee employee = employeeRepository.findById(dto.getEmployee().getId()).orElse(null);
        if (employee == null) {
            throw new IllegalArgumentException("Employee not found.");
        }

        if ("LEADER".equals(currentUser.getRole())) {
            // LEADER chỉ được tạo vi phạm cho employee có role là EMPLOYEE
            if (!"EMPLOYEE".equals(employee.getUser().getRole())) {
                throw new AccessDeniedException("Leader can only create violations for employees with role EMPLOYEE.");
            }
        } else if ("MANAGE".equals(currentUser.getRole())) {
            // MANAGE chỉ được tạo vi phạm cho EMPLOYEE và LEADER, không được tạo cho ADMIN
            String employeeRole = employee.getUser().getRole();
            if (!"EMPLOYEE".equals(employeeRole) && !"LEADER".equals(employeeRole)) {
                throw new AccessDeniedException("Manage can only create violations for EMPLOYEE or LEADER.");
            }
        }
        List<Long> violationTypeIds = Arrays.asList(1L, 2L, 3L);
        LocalDate violationDate = dto.getViolationDate();

        if (!canCreateViolation(employee.getId(), violationTypeIds, violationDate)) {
            throw new IllegalArgumentException("Employee already has a violation of this type for the selected date.");
        }

        // Tạo mới vi phạm
        Violation violation = new Violation();
        violation.setStatus("Pending");
        violation.setEmployee(employee);
        violation.setViolationType(violationTypeRepository.findById(dto.getViolationType().getId()).orElse(null));
        violation.setViolationDate(dto.getViolationDate());
        violation.setDescription(dto.getDescription());
        violation.setCreatedAt(LocalDateTime.now());
        violation.setUpdatedAt(LocalDateTime.now());

        // Lưu vi phạm
        Violation saved = violationRepository.save(violation);
        sendViolationEmail(saved, "created");
        updateSalaryForEmployee(saved.getEmployee().getId());

        return convertToViolationDTO(saved);
    }

    private boolean canCreateViolation(Long employeeId, List<Long> violationTypeIds, LocalDate violationDate) {
        List<Violation> existingViolations = violationRepository.findByEmployeeIdAndViolationDateAndViolationTypeIdIn(
                employeeId, violationDate, violationTypeIds);

        return existingViolations.isEmpty();
    }


    @Scheduled(fixedRate = 3600000) // 1 giờ (3600000 ms)
    public void autoApprovePendingViolations() {
        List<Violation> pendingViolations = violationRepository.findByStatus("Pending");

        for (Violation violation : pendingViolations) {
            if (violation.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
                // Cập nhật trạng thái thành "Approved"
                violation.setStatus("Approved");
                violation.setUpdatedAt(LocalDateTime.now());
                violationRepository.save(violation);

                // Cập nhật lương và gửi email thông báo nếu cần
                updateSalaryForEmployee(violation.getEmployee().getId());
                sendViolationEmail(violation, "auto-approved");
            }
        }
    }

    public ViolationDTO updateViolation(Long id, ViolationDTO dto) {
        User currentUser = authenticationService.getCurrentUser();
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
                            // Kiểm tra số lần cập nhật status
                            if (v.getUpdateCount() < 2) {
                                v.setStatus(dto.getStatus());
                                v.setUpdateCount(v.getUpdateCount() + 1); // Tăng số lần cập nhật
                                hasChanges = true;
                            } else {
                                throw new IllegalArgumentException("Violation status can only be updated a maximum of two times.");
                            }
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

    public List<ViolationDTO> getAllViolationsByUser() {
        // Lấy thông tin user đang đăng nhập
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Tìm employee dựa trên email (username)
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Trả về các violation của employee
        return violationRepository.findByEmployeeId(employee.getId()).stream()
                .map(this::convertToViolationDTO)
                .collect(Collectors.toList());
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

                    // Kiểm tra số lần cập nhật trạng thái
                    if (violation.getUpdateCount() >= 2) {
                        throw new IllegalArgumentException("Violation status can only be updated a maximum of two times.");
                    }
                    // Nếu trạng thái hiện tại và trạng thái mới giống nhau, bỏ qua cập nhật
                    if (currentStatus.equals(status)) {
                        throw new RuntimeException("Violation is already in the '" + status + "' status.");
                    }

                    // Tiếp tục nếu trạng thái không trùng
                    violation.setStatus(status);
                    violation.setUpdateCount(violation.getUpdateCount() + 1);  // Tăng số lần cập nhật
                    violation.setUpdatedAt(LocalDateTime.now());  // Cập nhật thời gian chỉnh sửa
                    violationRepository.save(violation);

                    // Cập nhật email và lương nếu cần
                    sendViolationEmail(violation, "status updated");
                    updateSalaryForEmployee(violation.getEmployee().getId());
                });
    }


    private void sendViolationEmail(Violation violation, String action) {
        String to = violation.getEmployee().getEmail();
        String subject = "Your Violation has been " + action;

        // Chọn màu sắc dựa trên trạng thái
        String statusColor;
        switch (violation.getStatus()) {
            case "Pending":
                statusColor = "#f9c74f"; // Màu vàng
                break;
            case "Approved":
                statusColor = "#f94144"; // Màu đỏ
                break;
            case "Rejected":
                statusColor = "#43aa8b"; // Màu xanh lá
                break;
            default:
                statusColor = "#4CAF50"; // Mặc định là màu xanh
        }

        String content = "<div style=\"max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;\">"
                + "<div style=\"background-color: #f79e45; padding: 20px; text-align: center; color: white;\">"
                + "<h1>Bizworks Notification</h1>"
                + "<p style=\"font-size: 18px;\">A violation has been <strong>" + action + "</strong>.</p>"
                + "</div>"
                + "<div style=\"padding: 20px;\">"
                + "<h2 style=\"color: #f79e45;\">Dear " + violation.getEmployee().getFullname() + ",</h2>"
                + "<p>We would like to inform you that a violation has been <strong>" + action + "</strong>.</p>"
                + "<h3 style=\"color: #2196F3;\">Violation Details:</h3>"
                + "<table style=\"width: 100%; border-collapse: collapse; margin-top: 10px;\">"
                + "<tr style=\"background-color: #f2f2f2;\">"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Violation Type:</strong></td>"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\">" + violation.getViolationType().getType() + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Violation Money:</strong></td>"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\">" + violation.getViolationType().getViolationMoney() + "$" + "</td>"
                + "</tr>"
                + "<tr style=\"background-color: #f2f2f2;\">"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Description:</strong></td>"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\">" + violation.getDescription() + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Status:</strong></td>"
                + "<td style=\"padding: 10px; border: 1px solid #ddd; color: " + statusColor + ";\"><strong>" + violation.getStatus() + "</strong></td>"
                + "</tr>"
                + "</table>"
                + "<p style=\"margin-top: 20px;\">If you have any questions, please do not hesitate to contact us.</p>"
                + "<p>Best regards,</p>"
                + "<p style=\"color: #999;\">Bizworks Team</p>"
                + "</div>"
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
                violation.getCreatedAt(),
                violation.getUpdatedAt()
        );
    }
}
