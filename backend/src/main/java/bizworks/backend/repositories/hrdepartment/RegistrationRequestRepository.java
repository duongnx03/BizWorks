package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.RegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
}
