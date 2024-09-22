package bizworks.backend.dtos;

import bizworks.backend.models.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String empCode;
    private String fullname;
    private LocalDate dob;
    private String address;
    private String gender;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long positionId; // ID of the position
    private String positionName; // Optionally, position name
    private Long departmentId; // ID of the department
    private String departmentName; // Optionally, department name
    private List<Long> developmentProjectIds; // List of development project IDs
    private List<Long> operationalActivityIds; // List of operational activity IDs
    private List<Long> strategicPlanIds; // List of strategic plan IDs

    public EmployeeDTO(Long id,String empCode, String fullname, String email, String phone, String avatar, LocalDate startDate, String departmentName, String positionName) {
        this.id = id;
        this.empCode = empCode;
        this.fullname = fullname;
        this.email = email;
        this.phone = phone;
        this.avatar = avatar;
        this.startDate = startDate;
        this.departmentName = departmentName;
        this.positionName = positionName;
    }

 public EmployeeDTO(Long id, String fullname) {
     this.id = id;
     this.fullname = fullname;
 }
    public static EmployeeDTO from(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFullname(employee.getFullname());
        dto.setDob(employee.getDob());
        dto.setAddress(employee.getAddress());
        dto.setGender(employee.getGender());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setAvatar(employee.getAvatar());
        dto.setStartDate(employee.getStartDate());
        dto.setEndDate(employee.getEndDate());
        dto.setPositionId(employee.getPosition() != null ? employee.getPosition().getId() : null);
        dto.setPositionName(employee.getPosition() != null ? employee.getPosition().getPositionName() : null);
        dto.setDepartmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null);
        dto.setDepartmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null);

        return dto;
    }
}
