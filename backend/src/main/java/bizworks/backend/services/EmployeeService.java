package bizworks.backend.services;

import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.EmployeeUpdateDTO;
import bizworks.backend.helpers.FileUpload;
import bizworks.backend.models.Department;
import bizworks.backend.models.Employee;
import bizworks.backend.models.User;
import bizworks.backend.repositories.DepartmentRepository;
import bizworks.backend.repositories.EmployeeRepository;
import bizworks.backend.repositories.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private FileUpload fileUpload;

    private String rootUrl = "http://localhost:8080/";
    private String subFolder = "avatars";
    private String uploadFolder = "uploads";
    private String urlImage = rootUrl + uploadFolder + File.separator + subFolder;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public Employee findById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public EmployeeDTO getEmployeeByEmail(String email) {
        Employee employee = findByEmail(email);
        return convertToDTO(employee);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = findById(id);
        return convertToDTO(employee);
    }

    public Employee updateEmployee(String email, EmployeeUpdateDTO request) throws IOException {
        Employee employeeExisted = findByEmail(email);

        if (request.getFileImage() != null && !request.getFileImage().isEmpty()) {
            // Delete old image
            String oldImagePath = employeeExisted.getAvatar();
            if (oldImagePath != null) {
                fileUpload.deleteImage(oldImagePath.substring(rootUrl.length()));
            }
            // Save new image
            String imageName = fileUpload.storeImage(subFolder, request.getFileImage());
            String exactImageUrl = urlImage + File.separator + imageName;
            request.setAvatar(exactImageUrl.replace("\\", "/"));
        } else {
            request.setAvatar(employeeExisted.getAvatar());
        }

        // Update employee information
        employeeExisted.setDob(request.getDob());
        employeeExisted.setGender(request.getGender());
        employeeExisted.setPhone(request.getPhone());
        employeeExisted.setAddress(request.getAddress());
        employeeExisted.setAvatar(request.getAvatar());

        return save(employeeExisted);
    }

    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    public EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setGender(employee.getGender());
        if(employee.getDepartment() != null || employee.getPosition() != null){
            employeeDTO.setDepartment(employee.getDepartment().getName());
            employeeDTO.setPosition(employee.getPosition().getPositionName());
        }else{
            employeeDTO.setDepartment(null);
            employeeDTO.setPosition(null);
        }
        return employeeDTO;
    }
    public Employee findByUser(User user) {
        return employeeRepository.findByUser(user).orElse(null);
    }
    public boolean isEmployeeInHRDepartment(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Department hrDepartment = departmentRepository.findByName("HR Department")
                .orElseThrow(() -> new RuntimeException("HR Department not found"));

        return hrDepartment.getId().equals(employee.getDepartment().getId());
    }
}

