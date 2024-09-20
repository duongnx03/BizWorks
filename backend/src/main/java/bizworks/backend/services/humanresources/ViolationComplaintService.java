package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.ViolationComplaintDTO;
import bizworks.backend.dtos.ViolationDTO;
import bizworks.backend.models.ViolationComplaint;
import bizworks.backend.repositories.ViolationComplaintRepository;
import bizworks.backend.repositories.ViolationRepository;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.services.AuthenticationService;
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

    public ViolationComplaintService(ViolationComplaintRepository violationComplaintRepository,
                                     ViolationRepository violationRepository,
                                     EmployeeRepository employeeRepository,
                                     AuthenticationService authenticationService) {
        this.violationComplaintRepository = violationComplaintRepository;
        this.violationRepository = violationRepository;
        this.employeeRepository = employeeRepository;
        this.authenticationService = authenticationService;
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
                    c.setDescription(dto.getDescription());
                    c.setStatus(dto.getStatus());
                    c.setUpdatedAt(LocalDateTime.now());

                    ViolationComplaint updated = violationComplaintRepository.save(c);
                    return convertToViolationComplaintDTO(updated);
                })
                .orElse(null);
    }

    public ViolationComplaintDTO updateStatus(Long id, String newStatus) {
        return violationComplaintRepository.findById(id)
                .map(c -> {
                    c.setStatus(newStatus);
                    c.setUpdatedAt(LocalDateTime.now());

                    ViolationComplaint updated = violationComplaintRepository.save(c);
                    return convertToViolationComplaintDTO(updated);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found."));
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
