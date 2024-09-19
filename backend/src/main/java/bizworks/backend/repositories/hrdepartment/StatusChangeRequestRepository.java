package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.StatusChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusChangeRequestRepository extends JpaRepository<StatusChangeRequest, Long> {
    List<StatusChangeRequest> findByApproved(boolean approved);

}
