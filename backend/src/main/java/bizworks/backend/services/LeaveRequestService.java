/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Service.java to edit this template
 */
package bizworks.backend.services;

import bizworks.backend.dtos.LeaveRequestDTO;
import bizworks.backend.dtos.LeaveType;
import bizworks.backend.dtos.SearchDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.LeaveRequest;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.LeaveRequestRepository;
import jakarta.mail.MessagingException;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 *
 * @author PC
 */
@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private MailService mailService;

    public List<LeaveRequestDTO> getAllLeaveRequests() {
        return leaveRequestRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<LeaveRequestDTO> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<LeaveRequestDTO> allLeaveRequestsByEmployee(Long empId) {
        return leaveRequestRepository.findByEmployeeId(empId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LeaveRequestDTO sendLeaveRequest(LeaveRequestDTO leaveRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        int maxDays = getMaxDaysForLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));

        long requestedDays = ChronoUnit.DAYS.between(
                leaveRequestDTO.getStartDate().toInstant(),
                leaveRequestDTO.getEndDate().toInstant()
        );

        if (requestedDays > maxDays) {
            throw new IllegalArgumentException("Cannot request more than " + maxDays + " days for " + leaveRequestDTO.getLeaveType());
        }

        LeaveRequest leaveRequest = convertToEntity(leaveRequestDTO);
        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus("Pending");

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        return convertToDTO(leaveRequest);
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository
                .findById(id)
                .orElse(null);
        if (leaveRequest == null) {
            return null;
        }
        leaveRequest.setStatus("Approved");
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        
        try {
            String subject = "Leave Request Approved";
            String content = String.format(
                "Dear %s,<br><br>"
                        + "Your leave request from %s to %s has been approved.<br><br>"
                        + "Best regards,<br>"
                        + "BizWorks.",
                leaveRequest.getEmployee().getFullname(),
                leaveRequest.getStartDate().toString(),
                leaveRequest.getEndDate().toString()
            );
            mailService.sendEmail(leaveRequest.getEmployee().getEmail(), subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return savedRequest;
    }

    public LeaveRequest rejectLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository
                .findById(id)
                .orElse(null);
        if (leaveRequest == null) {
            return null;
        }
        leaveRequest.setStatus("Rejected");
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        // Send rejection email
        try {
            String subject = "Leave Request Rejected";
            String content = String.format(
                "Dear %s,<br><br>"
                        + "Your leave request from %s to %s has been rejected.<br><br>"
                        + "Best regards,<br>"
                        + "BizWorks.",
                leaveRequest.getEmployee().getFullname(),
                leaveRequest.getStartDate().toString(),
                leaveRequest.getEndDate().toString()
            );
            mailService.sendEmail(leaveRequest.getEmployee().getEmail(), subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return savedRequest;
    }

    public Optional<Integer> calculateRemainingLeaveDays(Long emp_id) {
        Employee employee = employeeRepository.findById(emp_id).orElse(null);
        if (employee == null) {
            return Optional.empty();
        }

        int totalLeaveDays = 20; // Assume 20 leave days per year
        int usedLeaveDays = leaveRequestRepository.findByEmployeeId(emp_id)
                .stream()
                .filter(lr -> lr.getStatus().equals("Approved"))
                .filter(lr -> !isExcludedLeaveType(lr.getLeaveType()))
                .mapToInt(lr -> (int) ChronoUnit.DAYS.between(lr.getStartDate().toInstant(), lr.getEndDate().toInstant()))
                .sum();

        return Optional.of(totalLeaveDays - usedLeaveDays);
    }

    private int getMaxDaysForLeaveType(LeaveType leaveType) {
        switch (leaveType) {
            case SICK:
                return 10;
            case MATERNITY:
                return 90;
            case PERSONAL:
                return 5;
            case BEREAVEMENT:
                return 3;
            case MARRIAGE:
                return 5;
            case CIVIC_DUTY:
                return 10;
            case OTHER:
                return Integer.MAX_VALUE;
            default:
                return 0;
        }
    }

    private boolean isExcludedLeaveType(LeaveType leaveType) {
        return leaveType == LeaveType.SICK
                || leaveType == LeaveType.MATERNITY
                || leaveType == LeaveType.PERSONAL
                || leaveType == LeaveType.BEREAVEMENT
                || leaveType == LeaveType.MARRIAGE
                || leaveType == LeaveType.CIVIC_DUTY;
    }

    private LeaveRequestDTO convertToDTO(LeaveRequest leaveRequest) {
        return new LeaveRequestDTO(
                leaveRequest.getId(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getLeaveType().name(),
                leaveRequest.getReason(),
                leaveRequest.getStatus(),
                leaveRequest.getEmployee() != null ? leaveRequest.getEmployee().getFullname() : "Unknown Employee",
                leaveRequest.getEmployee() != null ? leaveRequest.getEmployee().getId() : null
        );
    }

    private LeaveRequest convertToEntity(LeaveRequestDTO leaveRequestDTO) {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStartDate(leaveRequestDTO.getStartDate());
        leaveRequest.setEndDate(leaveRequestDTO.getEndDate());
        leaveRequest.setLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));
        leaveRequest.setReason(leaveRequestDTO.getReason());
        return leaveRequest;
    }

    public List<LeaveRequestDTO> searchLeaveRequests(SearchDTO searchDto) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();

        return leaveRequests.stream()
                .filter(leaveRequest -> filterByDate(leaveRequest, searchDto))
                .filter(leaveRequest -> filterByLeaveType(leaveRequest, searchDto))
                .filter(leaveRequest -> filterByEmployeeName(leaveRequest, searchDto))
                .filter(leaveRequest -> filterByStatus(leaveRequest, searchDto))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private boolean filterByDate(LeaveRequest leaveRequest, SearchDTO searchDto) {
        if (searchDto.getStartDate() != null && searchDto.getEndDate() != null) {
            return !leaveRequest.getStartDate().before(searchDto.getStartDate())
                    && !leaveRequest.getEndDate().after(searchDto.getEndDate());
        } else if (searchDto.getStartDate() != null) {
            return !leaveRequest.getStartDate().before(searchDto.getStartDate());
        } else if (searchDto.getEndDate() != null) {
            return !leaveRequest.getEndDate().after(searchDto.getEndDate());
        }
        return true;
    }

    private boolean filterByLeaveType(LeaveRequest leaveRequest, SearchDTO searchDto) {
        if (searchDto.getLeaveType() != null && !searchDto.getLeaveType().isEmpty()) {
            return leaveRequest.getLeaveType().name().equalsIgnoreCase(searchDto.getLeaveType());
        }
        return true;
    }

    private boolean filterByEmployeeName(LeaveRequest leaveRequest, SearchDTO searchDto) {
        if (searchDto.getEmployeeName() != null && !searchDto.getEmployeeName().isEmpty()) {
            return leaveRequest.getEmployee().getFullname().equalsIgnoreCase(searchDto.getEmployeeName());
        }
        return true;
    }

    private boolean filterByStatus(LeaveRequest leaveRequest, SearchDTO searchDto) {
        if (searchDto.getStatus() != null && !searchDto.getStatus().isEmpty()) {
            return leaveRequest.getStatus().equalsIgnoreCase(searchDto.getStatus());
        }
        return true;
    }
}
