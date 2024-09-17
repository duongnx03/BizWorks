package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.RejectedJobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RejectedJobApplicationRepository extends JpaRepository<RejectedJobApplication, Long> {
}
