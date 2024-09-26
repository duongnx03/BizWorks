package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.TrainingProgramDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import bizworks.backend.models.hrdepartment.AttendanceTrainingProgram;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.UserRepository;
import bizworks.backend.repositories.hrdepartment.AttendanceTrainingProgramRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramRepository;
import bizworks.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    private NotificationService notificationService; // Dịch vụ gửi thông báo

    public List<TrainingProgramDTO> getAllTrainingPrograms() {
        List<TrainingProgram> allPrograms = trainingProgramRepository.findAll();
        return allPrograms.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public TrainingProgram getTrainingProgramById(Long id) {
        return trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
    }

    public void recordAttendance(Long programId, Long employeeId, LocalDate attendanceDate) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Kiểm tra xem nhân viên đã điểm danh cho ngày này chưa
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
    public void notifyParticipants(TrainingProgram trainingProgram) {
        List<Employee> participants = trainingProgram.getParticipants();

        for (Employee participant : participants) {
            User user = userRepository.findById(participant.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String message = createNotificationMessage(trainingProgram, user.getRole());
            // Gửi email thay vì gọi sendNotification
            notificationService.sendNotification(user.getEmail(), "Thông báo chương trình đào tạo", message);
        }
    }

    private String createNotificationMessage(TrainingProgram trainingProgram, String role) {
        StringBuilder message = new StringBuilder();
        message.append("Kính gửi ").append(role).append(",\n\n");
        message.append("Chúng tôi xin thông báo về chương trình đào tạo: ").append(trainingProgram.getTitle()).append("\n");
        message.append("Mô tả: ").append(trainingProgram.getDescription()).append("\n");
        message.append("Thời gian: ").append(trainingProgram.getStartDate()).append(" đến ").append(trainingProgram.getEndDate()).append("\n");
        message.append("Địa điểm: [Địa điểm cụ thể]\n");
        message.append("Xin vui lòng tham gia chương trình.\n\n");
        message.append("Trân trọng,\n");
        message.append("[Tên công ty]");
        return message.toString();
    }

    private String generateNotificationMessage(TrainingProgram trainingProgram, String role) {
        StringBuilder message = new StringBuilder();
        message.append("Kính gửi ").append(role).append(",\n\n");
        message.append("Chúng tôi xin thông báo về chương trình đào tạo: ").append(trainingProgram.getTitle()).append("\n");
        message.append("Mô tả: ").append(trainingProgram.getDescription()).append("\n");
        message.append("Thời gian: ").append(trainingProgram.getStartDate()).append(" đến ").append(trainingProgram.getEndDate()).append("\n");
        message.append("Địa điểm: [Địa điểm cụ thể]\n");
        message.append("Xin vui lòng tham gia chương trình.\n\n");
        message.append("Trân trọng,\n");
        message.append("[Tên công ty]");
        return message.toString();
    }

    public TrainingProgram createTrainingProgram(TrainingProgramDTO dto) {
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setTitle(dto.getTitle());
        trainingProgram.setDescription(dto.getDescription());
        trainingProgram.setStartDate(dto.getStartDate());
        trainingProgram.setEndDate(dto.getEndDate());
        List<Employee> participants = new ArrayList<>();
        if (dto.getParticipantIds() != null && !dto.getParticipantIds().isEmpty()) {
            participants.addAll(employeeRepository.findAllById(dto.getParticipantIds()));
        }
        List<User> leaders = userRepository.findByRole("LEADER");
        List<User> managers = userRepository.findByRole("MANAGER");
        List<Employee> leaderParticipants = employeeRepository.findAllByUserIdIn(
                leaders.stream().map(User::getId).collect(Collectors.toList())
        );
        List<Employee> managerParticipants = employeeRepository.findAllByUserIdIn(
                managers.stream().map(User::getId).collect(Collectors.toList())
        );
        participants.addAll(leaderParticipants);
        participants.addAll(managerParticipants);
        Set<Employee> uniqueParticipants = new HashSet<>(participants);
        trainingProgram.setParticipants(new ArrayList<>(uniqueParticipants));
        TrainingProgram savedProgram = trainingProgramRepository.save(trainingProgram);
        sendEmailToParticipants(savedProgram);

        return savedProgram;
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

    private void sendEmailToParticipants(TrainingProgram trainingProgram) {
        List<Employee> participants = trainingProgram.getParticipants();

        for (Employee participant : participants) {
            User user = userRepository.findById(participant.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String message = generateNotificationMessage(trainingProgram, user.getRole());
            notificationService.sendNotification(user.getEmail(), "Thông báo chương trình đào tạo", message);
        }
    }
    public List<User> getLeaders() {
        return userRepository.findByRole("LEADER");
    }

    public List<User> getManagers() {
        return userRepository.findByRole("MANAGE");
    }

    public TrainingProgram updateTrainingProgram(Long id, TrainingProgramDTO dto) {
        TrainingProgram existingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TrainingProgram not found"));

        existingProgram.setTitle(dto.getTitle());
        existingProgram.setDescription(dto.getDescription());
        existingProgram.setStartDate(dto.getStartDate());
        existingProgram.setEndDate(dto.getEndDate());

        return trainingProgramRepository.save(existingProgram);
    }

    public void deleteTrainingProgram(Long id) {
        trainingProgramRepository.deleteById(id);
    }

    public TrainingProgramDTO convertToDTO(TrainingProgram trainingProgram) {
        List<Long> participantIds = trainingProgram.getParticipants()
                .stream()
                .map(Employee::getId)
                .collect(Collectors.toList());

        return new TrainingProgramDTO(
                trainingProgram.getId(),
                trainingProgram.getTitle(),
                trainingProgram.getDescription(),
                trainingProgram.getStartDate(),
                trainingProgram.getEndDate(),
                participantIds
        );
    }
}
