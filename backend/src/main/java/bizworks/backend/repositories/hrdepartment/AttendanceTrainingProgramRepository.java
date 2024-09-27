package bizworks.backend.repositories.hrdepartment;

import bizworks.backend.models.Employee;
import bizworks.backend.models.hrdepartment.AttendanceTrainingProgram;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceTrainingProgramRepository extends JpaRepository<AttendanceTrainingProgram, Long> {
    List<AttendanceTrainingProgram> findByTrainingProgram(TrainingProgram trainingProgram);
    boolean existsByTrainingProgramAndEmployeeAndAttendanceDate(TrainingProgram trainingProgram, Employee employee, LocalDate attendanceDate);
    List<AttendanceTrainingProgram> findByEmployee(Employee employee);
    List<AttendanceTrainingProgram> findByEmployeeId(Long employeeId);

}