package bizworks.backend.repositories;

import bizworks.backend.models.MissedCheckOutHandling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissedCheckOutHandlingRepository extends JpaRepository<MissedCheckOutHandling, Long> {
    List<MissedCheckOutHandling> findMissedCheckOutHandlingByAttendanceEmployeeEmail(String email);
}
