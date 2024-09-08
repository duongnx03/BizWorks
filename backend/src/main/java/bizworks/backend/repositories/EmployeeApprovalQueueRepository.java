package bizworks.backend.repositories;

import bizworks.backend.models.EmployeeApprovalQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeApprovalQueueRepository extends JpaRepository<EmployeeApprovalQueue, Long> {
    boolean existsByEmail(String email);
    List<EmployeeApprovalQueue> findEmployeeApprovalQueueByCensorId(Long id);
    List<EmployeeApprovalQueue> findEmployeeApprovalQueueBySenderId(Long id);
}

