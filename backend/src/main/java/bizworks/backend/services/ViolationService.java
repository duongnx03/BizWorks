package bizworks.backend.services;

import bizworks.backend.models.Employee;
import bizworks.backend.models.Violation;
import bizworks.backend.repository.ViolationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViolationService {
    private ViolationRepository violationRepository;

    public ViolationService (ViolationRepository violationRepository) {
        this.violationRepository = violationRepository;
    }

    public Violation saveOrUpdateViolation(Violation violation) {

        return violationRepository.save(violation);
    }

    public List<Violation> getAllViolations() {
        return violationRepository.findAll();
    }

    public List<Violation> getViolationsByEmployee(Employee employee) {
        return violationRepository.findByEmployee(employee);
    }

    public void deleteViolation(Long id) {
        violationRepository.deleteById(id);
    }
}
