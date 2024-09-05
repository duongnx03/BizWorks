package bizworks.backend.controllers;

import bizworks.backend.dtos.VerifyAccountDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.models.User;
import bizworks.backend.models.VerifyAccount;
import bizworks.backend.services.AuthenticationService;
import bizworks.backend.services.VerifyAccountService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerifyAccountController {
    private final AuthenticationService authenticationService;
    private final VerifyAccountService verifyAccountService;

    @GetMapping("/check-verify")
    public ResponseEntity<ApiResponse<?>> checkVerify() {
        try {
            String email = getCurrentUserEmail();
            User user = authenticationService.findByEmail(email);
            boolean isVerified = verifyAccountService.isAccountVerified(user);

            if (isVerified) {
                return ResponseEntity.ok().body(ApiResponse.success(true, "Verified account"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Unverified account", "BAD_REQUEST"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVERS"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<?>> verify(@RequestBody VerifyAccountDTO verifyAccountDTO) {
        try {
            String email = getCurrentUserEmail();
            User user = authenticationService.findByEmail(email);
            VerifyAccount verifyAccount = verifyAccountService.findByUserId(user.getId());

            if (verifyAccount == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(null, "Verify Account not found"));
            }

            if (verifyAccountService.isVerificationCodeValid(verifyAccount, verifyAccountDTO)) {
                verifyAccountService.updateVerificationStatus(verifyAccount, user);
                return ResponseEntity.ok().body(ApiResponse.success(null, "Account verified successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Invalid or expired verification code", "BAD_REQUEST"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<?>> resendVerifyCode() {
        try {
            String email = getCurrentUserEmail();
            User user = authenticationService.findByEmail(email);
            VerifyAccount verifyAccount = verifyAccountService.findByUserId(user.getId());

            if (verifyAccount == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(null, "Verify Account not found"));
            }

            VerifyAccount resend = verifyAccountService.resendVerificationCode(verifyAccount);
            verifyAccountService.sendVerificationEmail(user.getEmail(), resend.getVerificationCode());
            return ResponseEntity.ok().body(ApiResponse.success(null, "Resend verify code successfully"));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(e.getMessage(), "EMAIL_SEND_ERROR"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
