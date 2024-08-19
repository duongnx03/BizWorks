package bizworks.backend.services;

import bizworks.backend.dtos.VerifyAccountDTO;
import bizworks.backend.models.User;
import bizworks.backend.models.VerifyAccount;
import bizworks.backend.repository.VerifyAccountRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VerifyAccountService {
    @Autowired
    private VerifyAccountRepository verifyAccountRepository;

    @Autowired
    private MailService mailService;

    public VerifyAccount createVerifyAccount(User user) {
        VerifyAccount verifyAccount = new VerifyAccount();
        verifyAccount.setVerify(false);
        verifyAccount.setVerificationCode(generateVerificationCode());
        verifyAccount.setCreatedAt(LocalDateTime.now());
        verifyAccount.setUser(user);

        return verifyAccountRepository.save(verifyAccount);
    }

    public VerifyAccount resendVerificationCode(VerifyAccount verifyAccount) {
        verifyAccount.setCreatedAt(LocalDateTime.now());
        verifyAccount.setVerificationCode(generateVerificationCode());
        return verifyAccountRepository.save(verifyAccount);
    }

    public void save(VerifyAccount verifyAccount) {
        verifyAccountRepository.save(verifyAccount);
    }

    public VerifyAccount findByUserId(Long userId) {
        return verifyAccountRepository.findByUserId(userId).orElseThrow();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public boolean isAccountVerified(User user) {
        VerifyAccount verifyAccount = findByUserId(user.getId());
        return verifyAccount != null && verifyAccount.isVerify();
    }

    public boolean isVerificationCodeValid(VerifyAccount verifyAccount, VerifyAccountDTO verifyAccountDTO) {
        LocalDateTime createdAt = verifyAccount.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(createdAt, now);

        return duration.toMinutes() <= 50 && verifyAccount.getVerificationCode().equals(verifyAccountDTO.getVerificationCode());
    }

    public void updateVerificationStatus(VerifyAccount verifyAccount, User user) {
        verifyAccount.setVerify(true);
        verifyAccount.setUser(user);
        save(verifyAccount);
    }

    public void sendVerificationEmail(String email, String verificationCode) throws MessagingException {
        String subject = "Account Verification";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #4CAF50;'>Account Verification</h2>"
                + "<p>Dear " + email + ",</p>"
                + "<p>Welcome to BizWorks. Please use the following verification code to verify your account:</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #FF5722;'>" + verificationCode + "</p>"
                + "<p>This code will expire in 5 minutes.</p>"
                + "<p>Best regards,<br>BizWorks</p>"
                + "</body>"
                + "</html>";

        mailService.sendEmail(email, subject, content);
    }
}
