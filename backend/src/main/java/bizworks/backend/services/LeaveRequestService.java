package bizworks.backend.services;

import bizworks.backend.dtos.*;
import bizworks.backend.models.*;
import bizworks.backend.repositories.*;
import jakarta.mail.MessagingException;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
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
        leaveRequest.setLeaderStatus("Pending");

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        return convertToDTO(leaveRequest);
    }


    public LeaveRequest leaderApproveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setLeaderStatus("Approved");
        leaveRequest.setStatus("Pending");  // Pending for Admin approval
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public LeaveRequest leaderRejectLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setLeaderStatus("Rejected");
        leaveRequest.setStatus("Rejected");
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        sendRejectionEmail(savedRequest, "Your leave request has been rejected by your team leader.");

        return savedRequest;
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setStatus("Approved");
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        sendApprovalEmail(savedRequest, "Your leave request has been approved by the admin.");

        return savedRequest;
    }

    public LeaveRequest rejectLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setStatus("Rejected");
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);

        sendRejectionEmail(savedRequest, "Your leave request has been rejected by the admin.");

        return savedRequest;
    }

    public List<LeaveRequestDTO> getLeaveRequestsForLeader() {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();
        return leaveRequests.stream()
            .filter(request -> 
                "Pending".equals(request.getStatus()) || 
                        "Rejected".equals(request.getStatus()) ||
                        "Approved".equals(request.getStatus()) 
//                "Rejected".equals(request.getLeaderStatus()) ||
//                ("Approved".equals(request.getLeaderStatus()) && "Approved".equals(request.getStatus())) || 
//                ("Approved".equals(request.getLeaderStatus()) && "Rejected".equals(request.getStatus())) ||
//                ("Approved".equals(request.getLeaderStatus()) && "Pending".equals(request.getStatus()))
            )
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getLeaveRequestsForAdmin() {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();
        return leaveRequests.stream()
            .filter(request -> 
                ("Approved".equals(request.getLeaderStatus()) && "Pending".equals(request.getStatus())) ||
                ("Approved".equals(request.getLeaderStatus()) && "Approved".equals(request.getStatus())) ||
                ("Approved".equals(request.getLeaderStatus()) && "Rejected".equals(request.getStatus())))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }


    private void sendApprovalEmail(LeaveRequest leaveRequest, String approvalMessage) {
        try {
            String subject = "Leave Request Approved";
            String content = String.format(
                    "Dear %s,<br><br>"
                    + "%s<br><br>"
                    + "<strong>Details:</strong><br>"
                    + "From: <strong>%s</strong><br>"
                    + "To: <strong>%s</strong><br>"
                    + "Reason: <strong>%s</strong><br><br>"
                    + "Best regards,<br>"
                    + "<em>BizWorks</em>.",
                    leaveRequest.getEmployee().getFullname(),
                    approvalMessage,
                    leaveRequest.getStartDate().toString(),
                    leaveRequest.getEndDate().toString(),
                    leaveRequest.getReason()
            );
            mailService.sendEmail(leaveRequest.getEmployee().getEmail(), subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private void sendRejectionEmail(LeaveRequest leaveRequest, String rejectionReason) {
        try {
            String subject = "Leave Request Rejected";
            String content = String.format(
                    "Dear %s,<br><br>"
                    + "%s<br><br>"
                    + "<strong>Details:</strong><br>"
                    + "From: <strong>%s</strong><br>"
                    + "To: <strong>%s</strong><br>"
                    + "Reason: <strong>%s</strong><br><br>"
                    + "Best regards,<br>"
                    + "<em>BizWorks</em>.",
                    leaveRequest.getEmployee().getFullname(),
                    rejectionReason,
                    leaveRequest.getStartDate().toString(),
                    leaveRequest.getEndDate().toString(),
                    leaveRequest.getReason()
            );
            mailService.sendEmail(leaveRequest.getEmployee().getEmail(), subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
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
        return LeaveRequestDTO.builder()
            .id(leaveRequest.getId())
            .startDate(leaveRequest.getStartDate())
            .endDate(leaveRequest.getEndDate())
            .leaveType(leaveRequest.getLeaveType().toString())
            .reason(leaveRequest.getReason())
            .createdAt(leaveRequest.getCreatedAt())
            .status(leaveRequest.getStatus())
            .leaderStatus(leaveRequest.getLeaderStatus())
            .employeeName(leaveRequest.getEmployee().getFullname())
            .employeeId(leaveRequest.getEmployee().getId())
            .build();
    }

    private LeaveRequest convertToEntity(LeaveRequestDTO leaveRequestDTO) {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStartDate(leaveRequestDTO.getStartDate());
        leaveRequest.setEndDate(leaveRequestDTO.getEndDate());
        leaveRequest.setLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));
        leaveRequest.setReason(leaveRequestDTO.getReason());
        return leaveRequest;
    }

    public List<LeaveRequestDTO> searchLeaveRequestsForLeader(SearchDTO searchDto) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();

        return leaveRequests.stream()
                .filter(request -> 
                        "Pending".equals(request.getStatus()) || 
//                        "Rejected".equals(request.getStatus()) || 
//                        "Approved".equals(request.getStatus()) 
                    "Rejected".equals(request.getLeaderStatus()) ||
                    ("Approved".equals(request.getLeaderStatus()) && "Approved".equals(request.getStatus())) || 
                    ("Approved".equals(request.getLeaderStatus()) && "Rejected".equals(request.getStatus())) ||
                    ("Approved".equals(request.getLeaderStatus()) && "Pending".equals(request.getStatus()))
                )
                .filter(request -> filterByDate(request, searchDto))
                .filter(request -> filterByLeaveType(request, searchDto))
                .filter(request -> filterByEmployeeName(request, searchDto))
                .filter(request -> filterByStatusForLeader(request, searchDto))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> searchLeaveRequestsForAdmin(SearchDTO searchDto) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();

        return leaveRequests.stream()
                .filter(request -> 
                    ("Approved".equals(request.getLeaderStatus()) && "Pending".equals(request.getStatus())) ||
                    ("Approved".equals(request.getLeaderStatus()) && "Approved".equals(request.getStatus())) ||
                    ("Approved".equals(request.getLeaderStatus()) && "Rejected".equals(request.getStatus()))
                )
                .filter(request -> filterByDate(request, searchDto))
                .filter(request -> filterByLeaveType(request, searchDto))
                .filter(request -> filterByEmployeeName(request, searchDto))
                .filter(request -> filterByStatusForAdmin(request, searchDto))
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
        return searchDto.getLeaveType() == null || 
               searchDto.getLeaveType().isEmpty() || 
               leaveRequest.getLeaveType().name().equalsIgnoreCase(searchDto.getLeaveType());
    }

    private boolean filterByEmployeeName(LeaveRequest leaveRequest, SearchDTO searchDto) {
        return searchDto.getEmployeeName() == null || 
               searchDto.getEmployeeName().isEmpty() || 
               leaveRequest.getEmployee().getFullname().toLowerCase().contains(searchDto.getEmployeeName().toLowerCase());
    }

    private boolean filterByStatusForLeader(LeaveRequest leaveRequest, SearchDTO searchDto) {
        return searchDto.getStatus() == null || 
               searchDto.getStatus().isEmpty() || 
               leaveRequest.getLeaderStatus().equalsIgnoreCase(searchDto.getStatus());
    }

    private boolean filterByStatusForAdmin(LeaveRequest leaveRequest, SearchDTO searchDto) {
        return searchDto.getStatus() == null || 
               searchDto.getStatus().isEmpty() || 
               leaveRequest.getStatus().equalsIgnoreCase(searchDto.getStatus());
    }
    
    public Map<String, Long> calculateTotalLeaveDaysForLeader(List<LeaveRequestDTO> leaveRequests) {
        Map<String, Long> leaveDaysPerEmployee = new HashMap<>();
        for (LeaveRequestDTO request : leaveRequests) {
            if (isVisibleToLeader(request)) {
                long days = ChronoUnit.DAYS.between(request.getStartDate().toInstant(), request.getEndDate().toInstant());
                leaveDaysPerEmployee.merge(request.getEmployeeName(), days, Long::sum);
            }
        }
        return leaveDaysPerEmployee;
    }

    public Map<String, Long> calculateTotalLeaveDaysForAdmin(List<LeaveRequestDTO> leaveRequests) {
        Map<String, Long> leaveDaysPerEmployee = new HashMap<>();
        for (LeaveRequestDTO request : leaveRequests) {
            if (isVisibleToAdmin(request)) {
                long days = ChronoUnit.DAYS.between(request.getStartDate().toInstant(), request.getEndDate().toInstant());
                leaveDaysPerEmployee.merge(request.getEmployeeName(), days, Long::sum);
            }
        }
        return leaveDaysPerEmployee;
    }

    public Map<String, Long> countLeaveRequestsByTypeForLeader(List<LeaveRequestDTO> leaveRequests) {
        Map<String, Long> leaveTypeCounts = new HashMap<>();
        for (LeaveRequestDTO request : leaveRequests) {
            if (isVisibleToLeader(request)) {
                leaveTypeCounts.merge(request.getLeaveType(), 1L, Long::sum);
            }
        }
        return leaveTypeCounts;
    }

    public Map<String, Long> countLeaveRequestsByTypeForAdmin(List<LeaveRequestDTO> leaveRequests) {
        Map<String, Long> leaveTypeCounts = new HashMap<>();
        for (LeaveRequestDTO request : leaveRequests) {
            if (isVisibleToAdmin(request)) {
                leaveTypeCounts.merge(request.getLeaveType(), 1L, Long::sum);
            }
        }
        return leaveTypeCounts;
    }

    private boolean isVisibleToLeader(LeaveRequestDTO request) {
        return "Pending".equals(request.getStatus()) || 
//               "Approved".equals(request.getStatus()) ||
//               "Rejected".equals(request.getStatus());
                
               "Rejected".equals(request.getLeaderStatus()) ||
               ("Approved".equals(request.getLeaderStatus()) && "Approved".equals(request.getStatus())) || 
               ("Approved".equals(request.getLeaderStatus()) && "Rejected".equals(request.getStatus())) ||
               ("Approved".equals(request.getLeaderStatus()) && "Pending".equals(request.getStatus()));
    }

    private boolean isVisibleToAdmin(LeaveRequestDTO request) {
        return ("Approved".equals(request.getLeaderStatus()) && "Pending".equals(request.getStatus())) ||
               ("Approved".equals(request.getLeaderStatus()) && "Approved".equals(request.getStatus())) ||
               ("Approved".equals(request.getLeaderStatus()) && "Rejected".equals(request.getStatus()));
    }
    
    public LeaveRequestDTO updateLeaveRequest(Long id, LeaveRequestDTO leaveRequestDTO) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (!leaveRequest.getStatus().equals("Pending")) {
            throw new IllegalStateException("Only pending requests can be updated");
        }

        Date createdAt = leaveRequest.getCreatedAt();
        Date currentTime = new Date();
        long diffInMillies = Math.abs(currentTime.getTime() - createdAt.getTime());
        long diffInMinutes = TimeUnit.MINUTES.convert(diffInMillies, TimeUnit.MILLISECONDS);

        if (diffInMinutes > 60) {
            throw new IllegalStateException("Leave request can no longer be updated");
        }

        validateDateOverlap(id, leaveRequestDTO.getStartDate(), leaveRequestDTO.getEndDate());
        validateLeaveDuration(leaveRequestDTO.getLeaveType(), leaveRequestDTO.getStartDate(), leaveRequestDTO.getEndDate());
        validateFields(leaveRequestDTO);

        leaveRequest.setStartDate(leaveRequestDTO.getStartDate());
        leaveRequest.setEndDate(leaveRequestDTO.getEndDate());
        leaveRequest.setLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));
        leaveRequest.setReason(leaveRequestDTO.getReason());

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        return convertToDTO(leaveRequest);
    }

    private void validateDateOverlap(Long currentRequestId, Date newStartDate, Date newEndDate) {
        List<LeaveRequest> otherRequests = leaveRequestRepository.findAll().stream()
                .filter(request -> !request.getId().equals(currentRequestId))
                .collect(Collectors.toList());

        for (LeaveRequest request : otherRequests) {
            if (!(newEndDate.before(request.getStartDate()) || newStartDate.after(request.getEndDate()))) {
                throw new IllegalArgumentException("The new date range overlaps with existing leave requests. Please choose a start date after " + 
                    request.getEndDate().toString());
            }
        }
    }

    private void validateLeaveDuration(String leaveType, Date startDate, Date endDate) {
        long daysBetween = ChronoUnit.DAYS.between(startDate.toInstant(), endDate.toInstant()) + 1;
        int maxDays = getMaxDaysForLeaveType(LeaveType.valueOf(leaveType));

        if (daysBetween > maxDays) {
            throw new IllegalArgumentException(leaveType + " cannot exceed " + maxDays + " days");
        }
    }

    private void validateFields(LeaveRequestDTO leaveRequestDTO) {
        if (leaveRequestDTO.getStartDate() == null || leaveRequestDTO.getEndDate() == null || 
            leaveRequestDTO.getLeaveType() == null || leaveRequestDTO.getReason() == null || 
            leaveRequestDTO.getReason().trim().isEmpty()) {
            throw new IllegalArgumentException("All fields are required");
        }

        if (leaveRequestDTO.getStartDate().after(leaveRequestDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }
    }

    public List<LeaveRequestDTO> searchLeaveRequests(SearchDTO searchDto) {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();

        return leaveRequests.stream()
                .filter(leaveRequest -> filterByDatee(leaveRequest, searchDto))
                .filter(leaveRequest -> filterByLeaveTypee(leaveRequest, searchDto))
                .filter(leaveRequest -> filterByStatus(leaveRequest, searchDto))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private boolean filterByDatee(LeaveRequest leaveRequest, SearchDTO searchDto) {
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

    private boolean filterByLeaveTypee(LeaveRequest leaveRequest, SearchDTO searchDto) {
        if (searchDto.getLeaveType() != null && !searchDto.getLeaveType().isEmpty()) {
            return leaveRequest.getLeaveType().name().equalsIgnoreCase(searchDto.getLeaveType());
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

