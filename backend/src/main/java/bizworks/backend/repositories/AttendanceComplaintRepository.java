package bizworks.backend.repositories;

import bizworks.backend.models.AttendanceComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceComplaintRepository extends JpaRepository<AttendanceComplaint, Long> {
    AttendanceComplaint findAttendanceComplaintByAttendanceId(Long attendanceId);
    List<AttendanceComplaint> findAttendanceComplaintByEmployeeEmail(String email);
    List<AttendanceComplaint> findAttendanceComplaintByCensor(Long id);
    List<AttendanceComplaint> findAttendanceComplaintByIsLeaderShow(Long id);
    List<AttendanceComplaint> findAttendanceComplaintByIsManageShow(Long id);
    List<AttendanceComplaint> findAttendanceComplaintByIsAdminShow(Long id);
}

