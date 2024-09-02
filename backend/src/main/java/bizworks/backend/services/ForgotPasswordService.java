package bizworks.backend.services;

import bizworks.backend.models.ForgotPassword;
import bizworks.backend.models.User;
import bizworks.backend.repositories.ForgotPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ForgotPasswordService {
    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    public ForgotPassword findForgotPasswordByUserId(Long user_id){
        return forgotPasswordRepository.findForgotPasswordByUserId(user_id).orElseThrow();
    }

    public void delete(Long id){
        forgotPasswordRepository.deleteById(id);
    }

    public ForgotPassword createVerifyAccount(User user){
        ForgotPassword forgotPassword = new ForgotPassword();
        forgotPassword.setVerificationCode(generateVerificationCode());
        forgotPassword.setUser(user);
        forgotPassword.setExpirationTime(LocalDateTime.now().plusMinutes(5));
        return forgotPasswordRepository.save(forgotPassword);
    }

    public ForgotPassword updateVerificationCode(User user) {
        ForgotPassword forgotPassword = forgotPasswordRepository.findForgotPasswordByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Forgot password request not found"));

        forgotPassword.setVerificationCode(generateVerificationCode());
        forgotPassword.setExpirationTime(LocalDateTime.now().plusMinutes(5));
        return forgotPasswordRepository.save(forgotPassword);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}

