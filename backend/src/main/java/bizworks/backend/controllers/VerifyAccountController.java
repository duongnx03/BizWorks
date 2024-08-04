package bizworks.backend.controllers;

import bizworks.backend.dtos.VerifyAccountDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.User;
import bizworks.backend.models.VerifyAccount;
import bizworks.backend.services.AuthenticationService;
import bizworks.backend.services.MailService;
import bizworks.backend.services.VerifyAccountService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/verify")
public class VerifyAccountController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private VerifyAccountService verifyAccountService;

    @Autowired
    private MailService mailService;

    @GetMapping("/check-verify")
    public ResponseEntity<ApiResponse<?>> checkVerify() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = authenticationService.findByEmail(email);
            VerifyAccount verifyAccount = verifyAccountService.findByUserId(user.getId());
            if (verifyAccount != null) {
                if (verifyAccount.isVerify()) {
                    return ResponseEntity.ok().body(ApiResponse.success(verifyAccount.isVerify(), "Verified account"));
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Unverified account", "BAD_REQUEST"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(email, "Verify Account not found"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVERS"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<?>> verify(@RequestBody VerifyAccountDTO verifyAccountDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = authenticationService.findByEmail(email);
            VerifyAccount verifyAccount = new VerifyAccount();
            VerifyAccount verifyAccountExisted = verifyAccountService.findByUserId(user.getId());
            if (verifyAccountExisted != null) {
                LocalDateTime createdAt = verifyAccountExisted.getCreatedAt();
                LocalDateTime now = LocalDateTime.now();
                Duration duration = Duration.between(createdAt, now);

                if (duration.toMinutes() > 1) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Verification code has expired", "BAD_REQUEST"));
                }
                if (verifyAccountExisted.getVerificationCode().equals(verifyAccountDTO.getVerificationCode())) {
                    verifyAccount.setId(verifyAccountExisted.getId());
                    verifyAccount.setVerify(true);
                    verifyAccount.setVerificationCode(verifyAccountExisted.getVerificationCode());
                    verifyAccount.setCreatedAt(verifyAccountExisted.getCreatedAt());
                    verifyAccount.setUser(user);
                    verifyAccountService.save(verifyAccount);
                    return ResponseEntity.ok().body(ApiResponse.success(null, "Account verified successfully"));
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Invalid verification code", "BAD_REQUEST"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(null, "Verify Account not found"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<?>> resendVerifyCode() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = authenticationService.findByEmail(email);
            VerifyAccount verifyAccount = new VerifyAccount();
            VerifyAccount verifyAccountExisted = verifyAccountService.findByUserId(user.getId());
            if (verifyAccountExisted != null) {
                verifyAccount.setId(verifyAccountExisted.getId());
                verifyAccount.setVerify(verifyAccountExisted.isVerify());
                verifyAccount.setCreatedAt(LocalDateTime.now());
                verifyAccount.setUser(user);
                VerifyAccount resend = verifyAccountService.resendVerificationCode(verifyAccount);
                sendVerificationEmail(user.getEmail(), resend.getVerificationCode());
                return ResponseEntity.ok().body(ApiResponse.success(verifyAccount, "Resend verify code successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(null, "Verify Account not found"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    private void sendVerificationEmail(String email, String verificationCode) {
        String subject = "Account Verification";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #4CAF50;'>Account Verification</h2>"
                + "<p>Dear " + email + ",</p>"
                + "<p>Welcome to BizWorks. Please use the following verification code to verify your account:</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #FF5722;'>" + verificationCode + "</p>"
                + "<p>This code will expire in 1 minutes.</p>"
                + "<p>Best regards,<br>BizWorks</p>"
                + "</body>"
                + "</html>";

        try {
            mailService.sendVerificationEmail(email, subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Handle the error appropriately in a real application
        }
    }
}
