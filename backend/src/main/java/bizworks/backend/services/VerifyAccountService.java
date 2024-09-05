package bizworks.backend.services;

import bizworks.backend.dtos.VerifyAccountDTO;
import bizworks.backend.models.User;
import bizworks.backend.models.VerifyAccount;
import bizworks.backend.repositories.VerifyAccountRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.stream.Collectors;

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

        return duration.toHours() <= 24 && verifyAccount.getVerificationCode().equals(verifyAccountDTO.getVerificationCode());
    }

    public void updateVerificationStatus(VerifyAccount verifyAccount, User user) {
        verifyAccount.setVerify(true);
        verifyAccount.setUser(user);
        save(verifyAccount);
    }

    public void sendVerificationEmail(String email, String verificationCode) throws MessagingException {
        String subject = "Account Verification";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #4CAF50; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Account Verification</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + email + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Welcome to BizWorks. Please use the following verification code to verify your account:</p>"
                + "<div style='text-align: center; margin: 20px 0;'>"
                + verificationCode.chars()
                .mapToObj(c -> "<span style='display: inline-block; width: 50px; height: 50px; margin: 0 10px; border-radius: 5px; border: 2px solid #4CAF50; background-color: #E8F5E9; line-height: 50px; text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50;'>"
                        + (char) c + "</span>")
                .collect(Collectors .joining())
                + "</div>"
                + "<p style='font-size: 16px; line-height: 1.5;'>This code will expire in 5 minutes.</p>"
                + "<p>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>"
                + "<p style='margin: 0;'>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        mailService.sendEmail(email, subject, content);
    }
}
