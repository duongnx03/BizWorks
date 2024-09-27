package bizworks.backend.services;

import bizworks.backend.dtos.DepartmentDTO;
import bizworks.backend.dtos.PositionDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.User;
import bizworks.backend.repositories.DepartmentRepository;
import bizworks.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    public Department findByName(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return departmentRepository.findByName(user.getEmployee().getDepartment().getName()).orElseThrow();
    }

    public Department findById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public Department createDepartment(DepartmentDTO departmentDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        Department department = new Department();
        department.setName(departmentDTO.getDepartmentName());
        department.setDescription(departmentDTO.getDescription());
        return departmentRepository.save(department);
    }
    public Department updateDepartment(Long id, DepartmentDTO departmentDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));

        if (departmentDTO.getDepartmentName() == null || departmentDTO.getDescription() == null) {
            throw new IllegalArgumentException("Name and Description cannot be null");
        }
        department.setName(departmentDTO.getDepartmentName());
        department.setDescription(departmentDTO.getDescription());
        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        departmentRepository.deleteById(id);
    }
    private DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getName());
        dto.setDescription(department.getDescription());
        // Lấy danh sách positions từ department và thêm vào DTO
        dto.setPositions(department.getPositions().stream()
                .map(PositionDTO::from)
                .collect(Collectors.toList()));

        return dto;
    }
    private void checkRole(User user, List<String> allowedRoles) {
        if (user == null) {
            throw new RuntimeException("User is not authenticated.");
        }
        if (!allowedRoles.contains(user.getRole())) {
            throw new RuntimeException("User does not have the required permissions. Required roles: " + allowedRoles);
        }
    }
}
