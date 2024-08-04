package bizworks.backend.controllers;

import bizworks.backend.dtos.TrainingProgramDTO;
import bizworks.backend.models.TrainingProgram;
import bizworks.backend.services.TrainingProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/training-programs")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainingProgramController {

    @Autowired
    private TrainingProgramService trainingProgramService;

    @GetMapping
    public ResponseEntity<List<TrainingProgramDTO>> getAllTrainingPrograms() {
        List<TrainingProgramDTO> programs = trainingProgramService.getAllTrainingPrograms();
        return ResponseEntity.ok(programs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> getTrainingProgramById(@PathVariable Long id) {
        TrainingProgramDTO trainingProgramDTO = trainingProgramService.getTrainingProgramById(id);
        return ResponseEntity.ok(trainingProgramDTO);
    }

    @PostMapping
    public ResponseEntity<TrainingProgramDTO> createTrainingProgram(
            @RequestBody TrainingProgramDTO trainingProgramDTO) {
        Optional<TrainingProgram> createdProgramOpt = trainingProgramService.saveTrainingProgram(trainingProgramDTO);
        if (createdProgramOpt.isPresent()) {
            return new ResponseEntity<>(trainingProgramService.convertToDTO(createdProgramOpt.get()),
                    HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO> updateTrainingProgram(@PathVariable Long id,
            @RequestBody TrainingProgramDTO trainingProgramDTO) {
        TrainingProgram updatedProgram = trainingProgramService.updateTrainingProgram(id, trainingProgramDTO);
        return ResponseEntity.ok(trainingProgramService.convertToDTO(updatedProgram));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainingProgram(@PathVariable Long id) {
        trainingProgramService.deleteTrainingProgram(id);
        return ResponseEntity.noContent().build();
    }
}
