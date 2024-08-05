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
public class UserDTO {
    private String fullname;
    private String email;
    private String password;
    private String role;
    private Long department_id;
    private Long position_id;
    private LocalDate startDate;
}
    