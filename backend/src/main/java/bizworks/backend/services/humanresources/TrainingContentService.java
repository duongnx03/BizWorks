package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.hrdepartment.TrainingContentDTO;
import bizworks.backend.dtos.hrdepartment.UpdateTrainingContentStatusDTO;
import bizworks.backend.models.hrdepartment.TrainingContent;
import bizworks.backend.models.hrdepartment.TrainingProgram;
import bizworks.backend.repositories.hrdepartment.TrainingContentRepository;
import bizworks.backend.repositories.hrdepartment.TrainingProgramRepository;
import jakarta.persistence.EntityNotFoundException;
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
                .orElseThrow(() -> new EntityNotFoundException("Training Program not found"));

        TrainingContent trainingContent = new TrainingContent();
        trainingContent.setTitle(dto.getTitle());
        trainingContent.setCoreKnowledge(dto.getCoreKnowledge());
        trainingContent.setCoreKnowledgeStatus(dto.getCoreKnowledgeStatus());
        trainingContent.setSoftSkills(dto.getSoftSkills());
        trainingContent.setSoftSkillsStatus(dto.getSoftSkillsStatus());
        trainingContent.setProfessionalSkills(dto.getProfessionalSkills());
        trainingContent.setProfessionalSkillsStatus(dto.getProfessionalSkillsStatus());
        trainingContent.setTrainingProgram(trainingProgram);

        return trainingContentRepository.save(trainingContent);
    }
    public List<TrainingContentDTO> getTrainingContentsByProgramId(Long programId) {
        List<TrainingContent> contents = trainingContentRepository.findByTrainingProgramId(programId);
        return contents.stream()
                .map(content -> new TrainingContentDTO(content.getId(), content.getTitle(), content.getCoreKnowledge(),
                        content.getCoreKnowledgeStatus(), content.getSoftSkills(), content.getSoftSkillsStatus(),
                        content.getProfessionalSkills(), content.getProfessionalSkillsStatus(),
                        content.getTrainingProgram().getId()))
                .collect(Collectors.toList());
    }
    public TrainingContent updateTrainingContentStatus(Long id, UpdateTrainingContentStatusDTO statusDTO) {
        TrainingContent trainingContent = trainingContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training Content not found"));
        if (statusDTO.getCoreKnowledgeStatus() != null) {
            trainingContent.setCoreKnowledgeStatus(statusDTO.getCoreKnowledgeStatus());
        }
        if (statusDTO.getSoftSkillsStatus() != null) {
            trainingContent.setSoftSkillsStatus(statusDTO.getSoftSkillsStatus());
        }
        if (statusDTO.getProfessionalSkillsStatus() != null) {
            trainingContent.setProfessionalSkillsStatus(statusDTO.getProfessionalSkillsStatus());
        }
        return trainingContentRepository.save(trainingContent);
    }
}
