package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String fullname;
    private LocalDate dob;
    private String address;
    private String gender;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate startDate;
    private LocalDate endDate;
    private String department;
    private String position;

    public EmployeeDTO(Long id, String fullname, String email, String phone, String avatar, LocalDate startDate, String department, String position) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.phone = phone;
        this.avatar = avatar;
        this.startDate = startDate;
        this.department = department;
        this.position = position;
    }

    public EmployeeDTO(Long id) {
        this.id = id;
    }
}
