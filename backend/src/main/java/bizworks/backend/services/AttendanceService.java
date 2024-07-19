package aptech.project.services;

import aptech.project.models.Attendance;
import aptech.project.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    public Attendance save(Attendance attendance){
        return attendanceRepository.save(attendance);
    }
}
