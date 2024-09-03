package bizworks.backend.repositories;

import bizworks.backend.models.Position;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByDepartmentId(Long departmentId);


}
