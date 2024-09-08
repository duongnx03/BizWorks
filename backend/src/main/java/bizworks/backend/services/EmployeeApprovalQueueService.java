package bizworks.backend.services;

import bizworks.backend.dtos.EmployeeApprovalQueueDTO;
import bizworks.backend.dtos.EmployeeResponseDTO;
import bizworks.backend.dtos.UserResponseDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.EmployeeApprovalQueue;
import bizworks.backend.models.User;
import bizworks.backend.repositories.EmployeeApprovalQueueRepository;
import bizworks.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeApprovalQueueService {
    private final EmployeeApprovalQueueRepository employeeApprovalQueueRepository;
    private final UserRepository userRepository;

    public boolean existsByEmail(String email){
        return employeeApprovalQueueRepository.existsByEmail(email);
    }

    public void save(EmployeeApprovalQueue employeeApprovalQueue){
        employeeApprovalQueueRepository.save(employeeApprovalQueue);
    }

    public List<EmployeeApprovalQueueDTO> findAll(){
        List<EmployeeApprovalQueue> employeeApprovalQueues = employeeApprovalQueueRepository.findAll();
        return employeeApprovalQueues.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EmployeeApprovalQueue> findBySender(){
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long sender = user.getId();
        return employeeApprovalQueueRepository.findEmployeeApprovalQueueBySenderId(sender);
    }

    public List<EmployeeApprovalQueue> findByCensor(){
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long censor = user.getId();
        return employeeApprovalQueueRepository.findEmployeeApprovalQueueByCensorId(censor);
    }

    public EmployeeApprovalQueue findById(Long id){
        return employeeApprovalQueueRepository.findById(id).orElseThrow();
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public EmployeeApprovalQueueDTO convertToDTO(EmployeeApprovalQueue employeeApprovalQueue){
        EmployeeApprovalQueueDTO employeeApprovalQueueDTO = new EmployeeApprovalQueueDTO();
        employeeApprovalQueueDTO.setId(employeeApprovalQueue.getId());
        employeeApprovalQueueDTO.setEmail(employeeApprovalQueue.getEmail());
        employeeApprovalQueueDTO.setEmpCode(employeeApprovalQueue.getEmpCode());
        employeeApprovalQueueDTO.setFullname(employeeApprovalQueue.getFullname());
        employeeApprovalQueueDTO.setAvatar(employeeApprovalQueue.getAvatar());
        employeeApprovalQueueDTO.setStartDate(employeeApprovalQueue.getStartDate());
        employeeApprovalQueueDTO.setDepartmentId(employeeApprovalQueue.getDepartmentId());
        employeeApprovalQueueDTO.setDepartmentName(employeeApprovalQueue.getDepartmentName());
        employeeApprovalQueueDTO.setPositionId(employeeApprovalQueue.getPositionId());
        employeeApprovalQueueDTO.setPositionName(employeeApprovalQueue.getPositionName());
        employeeApprovalQueueDTO.setStatus(employeeApprovalQueue.getStatus());
        employeeApprovalQueueDTO.setDescription(employeeApprovalQueue.getDescription());
        employeeApprovalQueueDTO.setSender(convertToUserDTO(employeeApprovalQueue.getSender()));
        employeeApprovalQueueDTO.setCensor(convertToUserDTO(employeeApprovalQueue.getCensor()));
        employeeApprovalQueueDTO.setCreatedAt(employeeApprovalQueue.getCreatedAt());
        if(employeeApprovalQueue.getUpdatedAt() == null){
            employeeApprovalQueueDTO.setUpdatedAt(null);
        }else{
            employeeApprovalQueueDTO.setUpdatedAt(employeeApprovalQueue.getUpdatedAt());
        }
        return employeeApprovalQueueDTO;
    }

    private UserResponseDTO convertToUserDTO(User user){
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setEmployee(convertToEmployeeDTO(user.getEmployee()));
        return userResponseDTO;
    }

    private EmployeeResponseDTO convertToEmployeeDTO(Employee employee) {
        EmployeeResponseDTO employeeDTO = new EmployeeResponseDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setEmpCode(employee.getEmpCode());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setGender(employee.getGender());
        employeeDTO.setDepartment(employee.getDepartment().getName());
        employeeDTO.setPosition(employee.getPosition().getPositionName());
        return employeeDTO;
    }
}

