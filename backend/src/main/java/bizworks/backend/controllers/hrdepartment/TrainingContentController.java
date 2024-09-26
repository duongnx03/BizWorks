package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.TrainingContentDTO;
import bizworks.backend.dtos.hrdepartment.UpdateTrainingContentStatusDTO;
import bizworks.backend.models.hrdepartment.TrainingContent;
import bizworks.backend.services.humanresources.TrainingContentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-contents")
public class TrainingContentController {

    @Autowired
    private TrainingContentService trainingContentService;

    @PostMapping
    public ResponseEntity<TrainingContent> createTrainingContent(@Valid @RequestBody TrainingContentDTO dto) {
        TrainingContent createdContent = trainingContentService.createTrainingContent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContent);
    }
    @GetMapping("/program/{programId}")
    public ResponseEntity<List<TrainingContentDTO>> getTrainingContentsByProgramId(@PathVariable Long programId) {
        return ResponseEntity.ok(trainingContentService.getTrainingContentsByProgramId(programId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TrainingContent> updateTrainingContentStatus(
            @PathVariable Long id,
            @RequestBody UpdateTrainingContentStatusDTO statusDTO) {

        TrainingContent updatedContent = trainingContentService.updateTrainingContentStatus(id, statusDTO);
        return ResponseEntity.ok(updatedContent);
    }

}
