package bizworks.backend.repositories;

import bizworks.backend.models.EmployeeApprovalQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeApprovalQueueRepository extends JpaRepository<EmployeeApprovalQueue, Long> {
    boolean existsByEmail(String email);
    List<EmployeeApprovalQueue> findEmployeeApprovalQueueByCensor(Long censor);
    List<EmployeeApprovalQueue> findEmployeeApprovalQueueBySender(Long sender);
    List<EmployeeApprovalQueue> findEmployeeApprovalQueueByIsManageShow(Long id);
}

