package bizworks.backend.services;

import bizworks.backend.dtos.DepartmentDTO;
import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.dtos.PositionDTO;
import bizworks.backend.models.Department;
import bizworks.backend.models.Employee;
import bizworks.backend.models.Position;
import bizworks.backend.repository.DepartmentRepository;
import bizworks.backend.repository.EmployeeRepository;
import bizworks.backend.repository.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Method to fetch all departments and convert them to DTOs
    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Method to fetch a department by its ID
    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
        return convertToDTO(department);
    }

    public Department getById(Long id){
        return departmentRepository.findById(id).orElseThrow();
    }

    public Optional<Department> saveDepartment(DepartmentDTO departmentDTO) {
        // Kiểm tra xem phòng ban với tên đã tồn tại chưa
        Optional<Department> existingDepartment = departmentRepository
                .findByDepartmentName(departmentDTO.getDepartmentName());
        if (existingDepartment.isPresent()) {
            return Optional.empty(); // Trả về Optional.empty() nếu đã tồn tại
        }

        // Tạo mới phòng ban
        Department department = new Department();
        department.setDepartmentName(departmentDTO.getDepartmentName());
        Department savedDepartment = departmentRepository.save(department);
        return Optional.of(savedDepartment); // Trả về Optional chứa phòng ban mới tạo
    }

    // Method to update an existing department
    public Department updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));

        // Update department details
        department.setDepartmentName(departmentDTO.getDepartmentName());
        return departmentRepository.save(department);
    }

    public DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getDepartmentName());

        // Map các vị trí thành PositionDTOs
        List<PositionDTO> positionDTOs = department.getPositions().stream()
                .map(this::convertPositionToDTO)
                .collect(Collectors.toList());
        dto.setPositions(positionDTOs);

        // Map nhân viên thành EmployeeDTOs
        List<EmployeeDTO> employeeDTOs = department.getEmployees().stream()
                .map(this::convertEmployeeToDTO)
                .collect(Collectors.toList());
        dto.setEmployees(employeeDTOs);

        return dto;
    }

    private PositionDTO convertPositionToDTO(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setPositionName(position.getPositionName());

        // Set department information
        if (position.getDepartment() != null) {
            dto.setDepartmentId(position.getDepartment().getId());
            dto.setDepartmentName(position.getDepartment().getDepartmentName());
        }

        // Set employee information
        if (position.getEmployee() != null) {
            EmployeeDTO employeeDTO = convertEmployeeToDTO(position.getEmployee());
            dto.setEmployee(employeeDTO);
        }

        return dto;
    }

    private EmployeeDTO convertEmployeeToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFullname(employee.getFullname());
//        dto.setDob(employee.getDob());
        dto.setAddress(employee.getAddress());
        dto.setGender(employee.getGender());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setAvatar(employee.getAvatar());
        dto.setStartDate(employee.getStartDate());
        dto.setEndDate(employee.getEndDate());
        return dto;
    }
}
