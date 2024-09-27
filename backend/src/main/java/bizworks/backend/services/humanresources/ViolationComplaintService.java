    package bizworks.backend.services.humanresources;
    
    import bizworks.backend.dtos.EmployeeDTO;
    import bizworks.backend.dtos.ViolationComplaintDTO;
    import bizworks.backend.dtos.ViolationDTO;
    import bizworks.backend.models.ViolationComplaint;
    import bizworks.backend.repositories.ViolationComplaintRepository;
    import bizworks.backend.repositories.ViolationRepository;
    import bizworks.backend.repositories.EmployeeRepository;
    import bizworks.backend.services.AuthenticationService;
    import bizworks.backend.services.MailService;
    import jakarta.mail.MessagingException;
    import org.springframework.http.HttpStatus;
    import org.springframework.stereotype.Service;
    import org.springframework.web.server.ResponseStatusException;
    
    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;
    
    @Service
    public class ViolationComplaintService {
        private final ViolationComplaintRepository violationComplaintRepository;
        private final ViolationRepository violationRepository;
        private final EmployeeRepository employeeRepository;
        private final AuthenticationService authenticationService;
        private final ViolationService violationService; // Thêm dòng này
        private final MailService mailService;
    
        public ViolationComplaintService(ViolationComplaintRepository violationComplaintRepository,
                                         ViolationRepository violationRepository,
                                         EmployeeRepository employeeRepository,
                                         AuthenticationService authenticationService,
                                         ViolationService violationService,
                                         MailService mailService) {
            this.violationComplaintRepository = violationComplaintRepository;
            this.violationRepository = violationRepository;
            this.employeeRepository = employeeRepository;
            this.authenticationService = authenticationService;
            this.violationService = violationService;
            this.mailService = mailService;
        }
    
        public ViolationComplaintDTO createComplaint(ViolationComplaintDTO dto) {
            Optional<ViolationComplaint> existingComplaint = violationComplaintRepository
                    .findByViolationId(dto.getViolation().getId());
    
            if (existingComplaint.isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This violation already has a complaint.");
            }
    
            // Kiểm tra quyền của người dùng
            // Thực hiện kiểm tra quyền, ví dụ như đảm bảo người dùng đã đăng nhập
    
            ViolationComplaint complaint = new ViolationComplaint();
            complaint.setEmployee(employeeRepository.findById(dto.getEmployee().getId()).orElse(null));
            complaint.setViolation(violationRepository.findById(dto.getViolation().getId()).orElse(null));
            complaint.setDescription(dto.getDescription());
            complaint.setStatus("Pending");
            complaint.setCreatedAt(LocalDateTime.now());
            complaint.setUpdatedAt(LocalDateTime.now());
    
            ViolationComplaint saved = violationComplaintRepository.save(complaint);
            return convertToViolationComplaintDTO(saved);
        }
    
        public boolean existsByViolationId(Long violationId) {
            return violationComplaintRepository.existsByViolationId(violationId);
        }
    
        public ViolationComplaintDTO updateComplaint(Long id, ViolationComplaintDTO dto) {
            return violationComplaintRepository.findById(id)
                    .map(c -> {
                        if (c.getUpdateCount() >= 1) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum update limit reached for this complaint.");
                        }
    
                        c.setDescription(dto.getDescription());
                        c.setStatus(dto.getStatus());
                        c.setUpdatedAt(LocalDateTime.now());
                        c.setUpdateCount(c.getUpdateCount() + 1);
    
                        ViolationComplaint updated = violationComplaintRepository.save(c);
                        return convertToViolationComplaintDTO(updated);
                    })
                    .orElse(null);
        }
    
        public ViolationComplaintDTO updateStatus(Long id, String newStatus) {
            return violationComplaintRepository.findById(id)
                    .map(c -> {
                        if (c.getUpdateCount() >= 1) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum update limit reached for this complaint.");
                        }
    
                        c.setStatus(newStatus);
                        c.setUpdatedAt(LocalDateTime.now());
                        c.setUpdateCount(c.getUpdateCount() + 1);
    
                        String emailAction;
                        if ("Resolved".equals(newStatus)) {
                            c.getViolation().setStatus("Rejected");
                            emailAction = "accepted";
                        } else if ("Rejected".equals(newStatus)) {
                            c.getViolation().setStatus("Approved");
                            emailAction = "rejected";
                        } else {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status.");
                        }
    
                        violationRepository.save(c.getViolation());
                        violationService.updateSalaryForEmployee(c.getViolation().getEmployee().getId());
    
                        ViolationComplaint updated = violationComplaintRepository.save(c);
                        sendEmailAboutComplaint(c, emailAction);
                        return convertToViolationComplaintDTO(updated);
                    })
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found."));
        }
    
        private void sendEmailAboutComplaint(ViolationComplaint complaint, String action) {
            String to = complaint.getEmployee().getEmail();
            String subject = "Your Complaint has been " + action;
    
            // Chọn màu sắc dựa trên trạng thái
            String statusColor;
            switch (complaint.getStatus()) {
                case "Pending":
                    statusColor = "#f9c74f"; // Màu vàng
                    break;
                case "Resolved":
                    statusColor = "#43aa8b"; // Màu xanh lá
                    break;
                case "Rejected":
                    statusColor = "#f94144"; // Màu đỏ
                    break;
                default:
                    statusColor = "#4CAF50"; // Mặc định màu xanh
            }
    
            String content = "<div style=\"max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333;\">"
                    + "<div style=\"background-color: #f79e45; padding: 20px; text-align: center; color: white;\">"
                    + "<h1>Bizworks Notification</h1>"
                    + "<p style=\"font-size: 18px;\">Your complaint status has been updated</p>"
                    + "</div>"
                    + "<div style=\"padding: 20px;\">"
                    + "<h2 style=\"color: #f79e45;\">Dear " + complaint.getEmployee().getFullname() + ",</h2>"
                    + "<p>We would like to inform you that your complaint has been <strong>" + action + "</strong>.</p>"
                    + "<h3 style=\"color: #2196F3;\">Complaint Details:</h3>"
                    + "<table style=\"width: 100%; border-collapse: collapse; margin-top: 10px;\">"
                    + "<tr style=\"background-color: #f2f2f2;\">"
                    + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Violation Type:</strong></td>"
                    + "<td style=\"padding: 10px; border: 1px solid #ddd;\">" + complaint.getViolation().getViolationType().getType() + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Description:</strong></td>"
                    + "<td style=\"padding: 10px; border: 1px solid #ddd;\">" + complaint.getDescription() + "</td>"
                    + "</tr>"
                    + "<tr style=\"background-color: #f2f2f2;\">"
                    + "<td style=\"padding: 10px; border: 1px solid #ddd;\"><strong>Status:</strong></td>"
                    + "<td style=\"padding: 10px; border: 1px solid #ddd; color: " + statusColor + ";\"><strong>" + complaint.getStatus() + "</strong></td>"
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
    
        public void deleteComplaint(Long id) {
            violationComplaintRepository.deleteById(id);
        }
    
        public List<ViolationComplaintDTO> getAllComplaints() {
            return violationComplaintRepository.findAll().stream()
                    .map(this::convertToViolationComplaintDTO)
                    .collect(Collectors.toList());
        }
    
        public ViolationComplaintDTO getComplaintById(Long id) {
            return violationComplaintRepository.findById(id)
                    .map(this::convertToViolationComplaintDTO)
                    .orElse(null);
        }
    
        private ViolationComplaintDTO convertToViolationComplaintDTO(ViolationComplaint complaint) {
            return new ViolationComplaintDTO(
                    complaint.getId(),
                    complaint.getEmployee() != null ? EmployeeDTO.from(complaint.getEmployee()) : null,
                    complaint.getViolation() != null ? ViolationDTO.from(complaint.getViolation()) : null,
                    complaint.getDescription(),
                    complaint.getStatus(),
                    complaint.getCreatedAt(),
                    complaint.getUpdatedAt()
            );
        }
    
    }
