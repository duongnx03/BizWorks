package bizworks.backend.repositories;

import bizworks.backend.models.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByDepartmentId(Long departmentId);

    @Query("SELECT p FROM Position p LEFT JOIN FETCH p.employee WHERE p.department.id = :departmentId")
    List<Position> findByDepartmentIdWithEmployee(@Param("departmentId") Long departmentId);
}
