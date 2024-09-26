package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.TrainingContentDTO;
import bizworks.backend.models.hrdepartment.TrainingContent;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.repositories.hrdepartment.TrainingContentRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingContentService {

    @Autowired
    private TrainingContentRepository trainingContentRepository;

    @Autowired
    private TrainingProgramRepository trainingProgramRepository;

    public TrainingContent createTrainingContent(TrainingContentDTO dto) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(dto.getTrainingProgramId())
                .orElseThrow(() -> new RuntimeException("Training Program not found"));

        TrainingContent trainingContent = new TrainingContent();
        trainingContent.setTitle(dto.getTitle());
        trainingContent.setCoreKnowledge(dto.getCoreKnowledge());
        trainingContent.setSoftSkills(dto.getSoftSkills());
        trainingContent.setProfessionalSkills(dto.getProfessionalSkills());
        trainingContent.setTrainingProgram(trainingProgram);

        return trainingContentRepository.save(trainingContent);
    }

    public List<TrainingContentDTO> getTrainingContentsByProgramId(Long programId) {
        List<TrainingContent> contents = trainingContentRepository.findByTrainingProgramId(programId);
        return contents.stream()
                .map(content -> new TrainingContentDTO(content.getId(), content.getTitle(), content.getCoreKnowledge(),
                        content.getSoftSkills(), content.getProfessionalSkills(), content.getTrainingProgram().getId()))
                .collect(Collectors.toList());
    }
}
