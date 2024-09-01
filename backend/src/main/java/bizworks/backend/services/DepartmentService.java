package bizwebsite.example.demo.services;

import bizwebsite.example.demo.dtos.DepartmentDTO;
import bizwebsite.example.demo.models.Department;
import bizwebsite.example.demo.models.User;
import bizwebsite.example.demo.repositories.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AuthenticationService authenticationService;

    public Department findById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public List<Department> getAllDepartments() {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        return departmentRepository.findAll();
    }

    public Department createDepartment(DepartmentDTO departmentDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        Department department = new Department();
        department.setName(departmentDTO.getName());
        department.setDescription(departmentDTO.getDescription());
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, DepartmentDTO departmentDTO) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));

        if (departmentDTO.getName() == null || departmentDTO.getDescription() == null) {
            throw new IllegalArgumentException("Name and Description cannot be null");
        }

        department.setName(departmentDTO.getName());
        department.setDescription(departmentDTO.getDescription());
        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        User currentUser = authenticationService.getCurrentUser();
        checkRole(currentUser, Arrays.asList("MANAGE", "ADMIN"));

        departmentRepository.deleteById(id);
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
