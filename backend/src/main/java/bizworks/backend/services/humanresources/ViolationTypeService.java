package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.ViolationTypeDTO;
import bizworks.backend.models.Violation;
import bizworks.backend.models.ViolationType;
import bizworks.backend.repositories.ViolationRepository;
import bizworks.backend.repositories.ViolationTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ViolationTypeService {

    private ViolationTypeRepository violationTypeRepository;
    private ViolationRepository violationRepository;
    private ViolationService violationService;

    public ViolationTypeService(ViolationTypeRepository violationTypeRepository, ViolationRepository violationRepository, ViolationService violationService) {
        this.violationTypeRepository = violationTypeRepository;
        this.violationRepository = violationRepository;
        this.violationService = violationService;
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

            // Cập nhật tất cả các Violation liên quan
            List<Violation> relatedViolations = violationRepository.findByViolationTypeId(updated.getId());
            for (Violation violation : relatedViolations) {
                violation.setViolationType(updated);
                violationRepository.save(violation);
            }

            // Cập nhật lại Salary nếu cần
            relatedViolations.forEach(v -> violationService.updateSalaryForEmployee(v.getEmployee().getId()));

            return new ViolationTypeDTO(updated.getId(), updated.getType(), updated.getViolationMoney());
        }
        return null; // Handle as needed
    }


//    public void deleteViolationType(Long id) {
//        // Tìm tất cả các Violation liên quan
//        List<Violation> relatedViolations = violationRepository.findByViolationTypeId(id);
//
//        // Xóa các Violation liên quan và cập nhật Salary
//        for (Violation violation : relatedViolations) {
//            violationRepository.deleteById(violation.getId());
//            violationService.updateSalaryForEmployee(violation.getEmployee().getId());
//        }
//
//        violationTypeRepository.deleteById(id); // Xóa ViolationType
//    }
public void deleteViolationType(Long id) {
    // Tìm tất cả các Violation liên quan
    List<Violation> relatedViolations = violationRepository.findByViolationTypeId(id);

    // Nếu tồn tại bất kỳ Violation nào liên quan, trả về thông báo lỗi
    if (!relatedViolations.isEmpty()) {
        throw new RuntimeException("Violation type cannot be deleted because there is a related violation.");
    }

    // Nếu không có Violation nào liên quan, tiến hành xóa ViolationType
    violationTypeRepository.deleteById(id);
}


}
