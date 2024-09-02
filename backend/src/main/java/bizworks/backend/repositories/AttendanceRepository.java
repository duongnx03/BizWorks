package bizworks.backend.repositories;

import bizworks.backend.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeEmail(String email);

    List<Attendance> findByAttendanceDate(LocalDate today);

    List<Attendance> findByAttendanceDateAndStatus(LocalDate today, String status);

    Attendance findByEmployeeEmailAndAttendanceDate(String email, LocalDate attendanceDate);

    List<Attendance> findByEmployeeEmailAndAttendanceDateBetween(String email, LocalDate startDate, LocalDate endDate);
}
