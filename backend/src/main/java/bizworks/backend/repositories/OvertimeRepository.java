package bizworks.backend.repositories;

import bizworks.backend.models.Overtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OvertimeRepository extends JpaRepository<Overtime, Long> {
    Overtime findOvertimeByAttendanceIdAndStatus(Long id, String status);
    List<Overtime> findOvertimeByEmployeeEmail(String email);
    Overtime findOvertimeByAttendanceId(Long id);
    List<Overtime> findOvertimeByCensor(Long censor);
    List<Overtime> findOvertimeByIsAdminShow(Long id);
    List<Overtime> findOvertimeByIsManageShow(Long id);
    List<Overtime> findOvertimeByIsLeaderShow(Long id);
}
