package bizworks.backend.repository;

import bizworks.backend.models.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViolationTypeRepository extends JpaRepository<ViolationType, Long> {

}
