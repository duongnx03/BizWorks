package bizworks.backend.controllers.hrdepartment;

import bizworks.backend.dtos.hrdepartment.TrainingContentDTO;
import bizworks.backend.models.hrdepartment.TrainingContent;
import bizworks.backend.services.humanresources.TrainingContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-contents")
public class TrainingContentController {

    @Autowired
    private TrainingContentService trainingContentService;

    @PostMapping
    public ResponseEntity<TrainingContent> createTrainingContent(@RequestBody TrainingContentDTO dto) {
        return ResponseEntity.status(201).body(trainingContentService.createTrainingContent(dto));
    }

    @GetMapping("/program/{programId}")
    public ResponseEntity<List<TrainingContentDTO>> getTrainingContentsByProgramId(@PathVariable Long programId) {
        return ResponseEntity.ok(trainingContentService.getTrainingContentsByProgramId(programId));
    }
}
