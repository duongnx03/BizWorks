package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordDTO {
    private String email;
    private String verificationCode;
    private String newPassword;
}
