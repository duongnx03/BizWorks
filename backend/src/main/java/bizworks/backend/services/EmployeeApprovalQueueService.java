package bizworks.backend.services;

import bizworks.backend.models.EmployeeApprovalQueue;
import bizworks.backend.models.User;
import bizworks.backend.repositories.EmployeeApprovalQueueRepository;
import bizworks.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeApprovalQueueService {
    private final EmployeeApprovalQueueRepository employeeApprovalQueueRepository;
    private final EmployeeService employeeService;
    private final UserRepository userRepository;

    public boolean existsByEmail(String email){
        return employeeApprovalQueueRepository.existsByEmail(email);
    }

    public void save(EmployeeApprovalQueue employeeApprovalQueue){
        employeeApprovalQueueRepository.save(employeeApprovalQueue);
    }

    public List<EmployeeApprovalQueue> findBySender(){
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long sender = user.getId();
        return employeeApprovalQueueRepository.findEmployeeApprovalQueueBySender(sender);
    }

    public List<EmployeeApprovalQueue> findByCensor(){
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long censor = user.getId();
        System.out.println("censor: "+censor);
        return employeeApprovalQueueRepository.findEmployeeApprovalQueueByCensor(censor);
    }

    public List<EmployeeApprovalQueue> findByIsManageShow(){
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Long isManageShow = user.getEmployee().getId();
        return employeeApprovalQueueRepository.findEmployeeApprovalQueueByIsManageShow(isManageShow);
    }

    public EmployeeApprovalQueue findById(Long id){
        return employeeApprovalQueueRepository.findById(id).orElseThrow();
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}

