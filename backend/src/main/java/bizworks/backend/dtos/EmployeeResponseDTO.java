package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDTO {
    private Long id;
    private String empCode;
    private String fullname;
    private String email;
    private String address;
    private String phone;
    private LocalDate dob;
    private String avatar;
    private LocalDate startDate;
    private LocalDate endDate;
    private String gender;
    private String department;
    private String position;
}

