package bizworks.backend.services;

import bizworks.backend.dtos.ViolationTypeDTO;
import bizworks.backend.models.ViolationType;
import bizworks.backend.repository.ViolationTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ViolationTypeService {

    private ViolationTypeRepository violationTypeRepository;

    public ViolationTypeService(ViolationTypeRepository violationTypeRepository) {
        this.violationTypeRepository = violationTypeRepository;
    }

    public ViolationTypeDTO createViolationType(ViolationTypeDTO dto) {
        ViolationType violationType = new ViolationType();
        violationType.setType(dto.getType());
        violationType.setViolationMoney(dto.getViolationMoney());
        ViolationType saved = violationTypeRepository.save(violationType);
        return new ViolationTypeDTO(saved.getId(), saved.getType(), saved.getViolationMoney());
    }

    public List<ViolationTypeDTO> getAllViolationTypes() {
        List<ViolationType> violationTypes = violationTypeRepository.findAll();
        return violationTypes.stream()
                .map(vt -> new ViolationTypeDTO(vt.getId(), vt.getType(), vt.getViolationMoney()))
                .toList();
    }

    public ViolationTypeDTO getViolationTypeById(Long id) {
        Optional<ViolationType> violationType = violationTypeRepository.findById(id);
        if (violationType.isPresent()) {
            ViolationType vt = violationType.get();
            return new ViolationTypeDTO(vt.getId(), vt.getType(), vt.getViolationMoney());
        }
        return null; // Handle as needed
    }

    public ViolationTypeDTO updateViolationType(Long id, ViolationTypeDTO dto) {
        Optional<ViolationType> optional = violationTypeRepository.findById(id);
        if (optional.isPresent()) {
            ViolationType vt = optional.get();
            vt.setType(dto.getType());
            vt.setViolationMoney(dto.getViolationMoney());
            ViolationType updated = violationTypeRepository.save(vt);
            return new ViolationTypeDTO(updated.getId(), updated.getType(), updated.getViolationMoney());
        }
        return null; // Handle as needed
    }

    public void deleteViolationType(Long id) {
        violationTypeRepository.deleteById(id);
    }
}
