package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.TrainingProgramDTO;
import bizworks.backend.models.Employee;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingProgramService {

    @Autowired
    private TrainingProgramRepository trainingProgramRepository;

    @Autowired
    private EmployeeRepository employeeRepository; // Để lấy danh sách Employee từ ID

    public List<TrainingProgram> getAllTrainingPrograms() {
        return trainingProgramRepository.findAll();
    }

    public TrainingProgram createTrainingProgram(TrainingProgramDTO dto) {
        TrainingProgram trainingProgram = new TrainingProgram();
        trainingProgram.setTitle(dto.getTitle());
        trainingProgram.setDescription(dto.getDescription());
        trainingProgram.setStartDate(dto.getStartDate());
        trainingProgram.setEndDate(dto.getEndDate());

        // Lấy danh sách Employee từ participantIds
        List<Employee> participants = employeeRepository.findAllById(dto.getParticipantIds());
        trainingProgram.setParticipants(participants);

        return trainingProgramRepository.save(trainingProgram);
    }

    public TrainingProgram updateTrainingProgram(Long id, TrainingProgramDTO dto) {
        TrainingProgram existingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TrainingProgram not found"));

        existingProgram.setTitle(dto.getTitle());
        existingProgram.setDescription(dto.getDescription());
        existingProgram.setStartDate(dto.getStartDate());
        existingProgram.setEndDate(dto.getEndDate());

        // Cập nhật danh sách Employee tham gia
        List<Employee> participants = employeeRepository.findAllById(dto.getParticipantIds());
        existingProgram.setParticipants(participants);

        return trainingProgramRepository.save(existingProgram);
    }

    public void deleteTrainingProgram(Long id) {
        trainingProgramRepository.deleteById(id);
    }
}
