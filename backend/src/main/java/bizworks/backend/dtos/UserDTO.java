package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String fullname;
    private String email;
    private LocalDate startDate;
    private Long department_id;
    private Long position_id;
    private MultipartFile fileImage;
}
