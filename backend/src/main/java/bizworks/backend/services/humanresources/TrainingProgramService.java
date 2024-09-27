package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.TrainingProgramDTO;
import bizworks.backend.helpers.ResourceNotFoundException;
import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import bizworks.backend.models.hrdepartment.AttendanceTrainingProgram;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.UserRepository;
import bizworks.backend.repositories.hrdepartment.AttendanceTrainingProgramRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramEmployeeRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramRepository;
import bizworks.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingProgramService {
    @Autowired
    private TrainingProgramRepository trainingProgramRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AttendanceTrainingProgramRepository attendanceTrainingProgramRepository;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private TrainingProgramEmployeeRepository trainingProgramEmployeeRepository;

    public List<TrainingProgramDTO> getAllTrainingPrograms() {
        List<TrainingProgram> allPrograms = trainingProgramRepository.findAll();
        return allPrograms.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public TrainingProgramDTO getTrainingProgramById(Long id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
        return convertToDTO(trainingProgram);
    }

    public TrainingProgram findById(Long id) {
        Optional<TrainingProgram> trainingProgramOptional = trainingProgramRepository.findById(id);
        if (trainingProgramOptional.isPresent()) {
            return trainingProgramOptional.get();
        } else {
            throw new RuntimeException("Chương trình đào tạo không tồn tại với ID: " + id);
        }
    }

    public boolean isEmployeeCurrentlyEnrolled(Long employeeId) {
        List<TrainingProgram> trainingPrograms = trainingProgramRepository.findAll();
        for (TrainingProgram program : trainingPrograms) {
            if (!program.isCompleted() && program.getParticipants().stream().anyMatch(e -> e.getId().equals(employeeId))) {
                return true;
            }
        }
        return false;
    }

    public List<TrainingProgramDTO> getUncompletedTrainingPrograms() {
        List<TrainingProgram> uncompletedPrograms = trainingProgramRepository.findByCompleted(false);
        return uncompletedPrograms.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<TrainingProgramDTO> getCompletedTrainingPrograms() {
        List<TrainingProgram> completedPrograms = trainingProgramRepository.findByCompleted(true);
        return completedPrograms.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public void recordAttendance(Long programId, Long employeeId, LocalDate attendanceDate) {
        LocalDate currentDate = LocalDate.now();
        if (!attendanceDate.isEqual(currentDate)) {
            throw new RuntimeException("Attendance is only allowed for today's date");
        }

        TrainingProgram trainingProgram = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        boolean alreadyAttended = attendanceTrainingProgramRepository.existsByTrainingProgramAndEmployeeAndAttendanceDate(
                trainingProgram, employee, attendanceDate);

        if (alreadyAttended) {
            throw new RuntimeException("Employee already attended for this date");
        }

        AttendanceTrainingProgram attendance = new AttendanceTrainingProgram();
        attendance.setTrainingProgram(trainingProgram);
        attendance.setEmployee(employee);
        attendance.setAttendedAt(LocalDateTime.now());
        attendance.setAttendanceDate(attendanceDate);
        attendanceTrainingProgramRepository.save(attendance);
    }

    public List<AttendanceTrainingProgram> getAttendanceByProgramId(Long programId) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));

        return attendanceTrainingProgramRepository.findByTrainingProgram(trainingProgram);
    }

    public TrainingProgramDTO createTrainingProgram(TrainingProgramDTO dto) {
        for (Long employeeId : dto.getParticipantIds()) {
            if (isEmployeeCurrentlyEnrolled(employeeId)) {
                throw new RuntimeException("Nhân viên với ID " + employeeId + " đã tham gia vào một chương trình đào tạo khác.");
            }
        }
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setTitle(dto.getTitle());
        trainingProgram.setDescription(dto.getDescription());
        trainingProgram.setStartDate(dto.getStartDate());
        trainingProgram.setEndDate(dto.getEndDate());
        List<Employee> selectedEmployees = employeeRepository.findAllById(dto.getParticipantIds());
        trainingProgram.setParticipants(selectedEmployees);
        TrainingProgram savedProgram = trainingProgramRepository.save(trainingProgram);
        return convertToDTO(savedProgram);
    }

    public List<AttendanceTrainingProgram> getAttendanceByEmployeeId(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return attendanceTrainingProgramRepository.findByEmployee(employee);
    }

    public List<Employee> getNewEmployees() {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        return employeeRepository.findByStartDateAfter(sixMonthsAgo);
    }

    public List<User> getLeaders() {
        return userRepository.findByRole("LEADER");
    }

    public List<User> getManagers() {
        return userRepository.findByRole("MANAGE");
    }

    public TrainingProgramDTO updateTrainingProgram(Long id, TrainingProgramDTO dto) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training Program not found with ID: " + id));

        trainingProgram.setTitle(dto.getTitle());
        trainingProgram.setDescription(dto.getDescription());
        trainingProgram.setStartDate(dto.getStartDate());
        trainingProgram.setEndDate(dto.getEndDate());
        List<Employee> selectedEmployees = employeeRepository.findAllById(dto.getParticipantIds());
        trainingProgram.setParticipants(selectedEmployees);

        TrainingProgram updatedProgram = trainingProgramRepository.save(trainingProgram);
        return convertToDTO(updatedProgram);
    }

    public void deleteTrainingProgram(Long id) {
        trainingProgramRepository.deleteById(id);
    }

    public void completeTrainingProgram(Long id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training Program not found with ID: " + id));
        trainingProgram.setCompleted(true); // Đánh dấu là đã hoàn thành
        trainingProgramRepository.save(trainingProgram);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("No user is authenticated");
    }

    public List<TrainingProgramDTO> getTrainingProgramsByCurrentUser() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole().equals("ADMIN")) {
            return getUncompletedTrainingPrograms();
        } else {
            Long employeeId = employeeRepository.findEmployeeIdByUserId(currentUser.getId());
            List<Long> enrolledProgramIds = trainingProgramEmployeeRepository.findByEmployeeId(employeeId);
            return trainingProgramRepository.findAllById(enrolledProgramIds).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
    }
    public List<Employee> getParticipantsByProgramId(Long programId) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new ResourceNotFoundException("Training Program not found with ID: " + programId));
        return trainingProgram.getParticipants(); // Lấy danh sách nhân viên tham gia
    }

    public TrainingProgramDTO convertToDTO(TrainingProgram trainingProgram) {
        TrainingProgramDTO dto = new TrainingProgramDTO();
        dto.setId(trainingProgram.getId());
        dto.setTitle(trainingProgram.getTitle());
        dto.setDescription(trainingProgram.getDescription());
        dto.setStartDate(trainingProgram.getStartDate());
        dto.setEndDate(trainingProgram.getEndDate());
        dto.setParticipantIds(trainingProgram.getParticipants().stream()
                .map(Employee::getId) // Chỉ lấy ID
                .collect(Collectors.toList()));
        dto.setCompleted(trainingProgram.isCompleted());
        return dto;
    }

    public TrainingProgramDTO getCompletedTrainingProgramById(Long id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .filter(TrainingProgram::isCompleted)
                .orElseThrow(() -> new ResourceNotFoundException("Training Program not found or not completed with ID: " + id));
        return convertToDTO(trainingProgram);

    }
}
