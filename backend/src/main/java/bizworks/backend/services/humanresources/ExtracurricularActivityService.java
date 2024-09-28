package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.ExtracurricularActivityDTO;
import bizworks.backend.dtos.hrdepartment.RegistrationRequestDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.hrdepartment.ExtracurricularActivity;
import bizworks.backend.models.hrdepartment.RegistrationRequest;
import bizworks.backend.models.hrdepartment.RegistrationStatus;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.hrdepartment.ExtracurricularActivityRepository;
import bizworks.backend.repositories.hrdepartment.RegistrationRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExtracurricularActivityService {

    @Autowired
    private ExtracurricularActivityRepository activityRepository;

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private RegistrationRequestRepository registrationRequestRepository; // Inject the new repository
    public List<ExtracurricularActivityDTO> getAllActivities() {
        return activityRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public ExtracurricularActivityDTO createActivity(ExtracurricularActivityDTO dto) {
        ExtracurricularActivity activity = new ExtracurricularActivity();
        activity.setTitle(dto.getTitle());
        activity.setDescription(dto.getDescription());
        activity.setDate(dto.getDate());
        // Do not set participants here
        ExtracurricularActivity savedActivity = activityRepository.save(activity);
        return convertToDTO(savedActivity);
    }
    public RegistrationRequestDTO registerEmployee(Long activityId, Long employeeId) {
        ExtracurricularActivity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        RegistrationRequest request = new RegistrationRequest();
        request.setActivity(activity);
        request.setEmployee(employee);
        request.setStatus(RegistrationStatus.PENDING);

        // Save the registration request
        registrationRequestRepository.save(request);
        activity.getRegistrationRequests().add(request); // Add to the activity (optional)

        return convertToRegistrationRequestDTO(request);
    }
    public RegistrationRequestDTO approveRegistration(Long requestId) {
        // Find the request and set its status to APPROVED
        RegistrationRequest request = findRegistrationRequestById(requestId);
        request.setStatus(RegistrationStatus.APPROVED);
        return convertToRegistrationRequestDTO(request);
    }

    public RegistrationRequestDTO rejectRegistration(Long requestId) {
        // Find the request and set its status to REJECTED
        RegistrationRequest request = findRegistrationRequestById(requestId);
        request.setStatus(RegistrationStatus.REJECTED);
        return convertToRegistrationRequestDTO(request);
    }
    private ExtracurricularActivityDTO convertToDTO(ExtracurricularActivity activity) {
        ExtracurricularActivityDTO dto = new ExtracurricularActivityDTO();
        dto.setId(activity.getId());
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());
        dto.setDate(activity.getDate());
        dto.setParticipantIds(activity.getParticipants().stream()
                .map(Employee::getId)
                .collect(Collectors.toList()));
        dto.setCompleted(activity.isCompleted());
        return dto;
    }
    private RegistrationRequestDTO convertToRegistrationRequestDTO(RegistrationRequest request) {
        RegistrationRequestDTO dto = new RegistrationRequestDTO();
        dto.setId(request.getId());
        dto.setEmployeeId(request.getEmployee().getId());
        dto.setActivityId(request.getActivity().getId());
        dto.setStatus(request.getStatus());
        return dto;
    }
    private RegistrationRequest findRegistrationRequestById(Long requestId) {
        return registrationRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Registration request not found"));
    }
}
