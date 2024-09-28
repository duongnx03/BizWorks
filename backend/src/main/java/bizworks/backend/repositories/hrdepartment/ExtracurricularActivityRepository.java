package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.hrdepartment.ExtracurricularActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtracurricularActivityRepository extends JpaRepository<ExtracurricularActivity, Long> {
    // You can add custom query methods here if needed
}
