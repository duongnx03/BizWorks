package aptech.project.controllers;

import aptech.project.dtos.*;
import aptech.project.helpers.ApiResponse;
import aptech.project.models.*;
import aptech.project.services.*;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private VerifyAccountService verifyAccountService;

    @Autowired
    private MailService mailService;

    @Autowired
    private PositionService positionService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(
            @Valid @RequestBody UserDTO request,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest().body(ApiResponse.badRequest(bindingResult));
            }
            UserDTO registeredUser = authenticationService.register(request);
            User user = authenticationService.findByEmail(registeredUser.getEmail());
            Department department = departmentService.getDepartmentById(request.getDepartment_id()).orElseThrow();
            Position position = positionService.getPositionById(request.getPosition_id()).orElseThrow();
            Employee employee = new Employee();
            employee.setFullname(request.getFullname());
            employee.setDob(null);
            employee.setAddress(null);
            employee.setGender(null);
            employee.setEmail(request.getEmail());
            employee.setPhone(null);
            employee.setAvatar(null);
            employee.setStartDate(LocalDate.now());
            employee.setEndDate(null);
            employee.setDepartment(department);
            employee.setPosition(position);
            employee.setUser(user);
            Employee empCreate = employeeService.save(employee);
            if (empCreate == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Error when creating new employee", "BAD_REQUEST"));
            }
            VerifyAccount verifyAccount = verifyAccountService.createVerifyAccount(user);
            if (verifyAccount == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Error generating account verification code", "BAD_REQUEST"));
            }
            sendVerificationEmail(request.getEmail(), request.getFullname(), verifyAccount.getVerificationCode());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(registeredUser, "User registered successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(
            @Valid @RequestBody AuthenticationRequest request,
            BindingResult bindingResult,
            HttpServletResponse response
    ) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(bindingResult));
        }
        try {
            AuthenticationResponse authResponse = authenticationService.authenticate(request);
            Cookie cookie = new Cookie("access_token", authResponse.getToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(3600); // Thời gian sống của cookie (1 giờ)
            response.addCookie(cookie);
            return ResponseEntity.ok(ApiResponse.success(null, "User authenticated successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestParam String email) {
        try {
            User user = authenticationService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(email, "User not found"));
            } else {
                ForgotPassword forgotPassword = forgotPasswordService.createVerifyAccount(user);
                sendVerificationForgotPassword(user.getEmail(), forgotPassword.getVerificationCode());
                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(forgotPassword, "Send verification code successfully"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<?>> reset(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            User userExisted = authenticationService.findByEmail(forgotPasswordDTO.getEmail());
            if (userExisted == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.notfound(forgotPasswordDTO.getEmail(), "User not found"));
            } else {
                ForgotPassword forgotPassword = forgotPasswordService.findForgotPasswordByUserId(userExisted.getId());
                if(forgotPassword.getVerificationCode().equals(forgotPasswordDTO.getVerificationCode())){
                    User user = new User();
                    user.setId(userExisted.getId());
                    user.setEmail(userExisted.getEmail());
                    user.setPassword(passwordEncoder.encode(forgotPasswordDTO.getNewPassword()));
                    user.setRole(userExisted.getRole());
                    authenticationService.save(user);
                    forgotPasswordService.delete(forgotPassword.getId());
                    return ResponseEntity.ok().body(ApiResponse.success(null, "Reset password successfully"));
                }else{
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.errorServer("Invalid verification code", "BAD_REQUEST"));
                }
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User userExisted = authenticationService.findByEmail(email);
            User user = new User();
            user.setId(userExisted.getId());
            user.setEmail(user.getEmail());
            user.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
            user.setRole(userExisted.getRole());
            authenticationService.save(user);
            return ResponseEntity.ok().body(ApiResponse.success(null, "Reset password successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVERS"));
        }
    }

    private void sendVerificationForgotPassword(String email, String verificationCode) {
        String subject = "Forgot Password";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #4CAF50;'>Forgot Password</h2>"
                + "<p>Dear " + email + ",</p>"
                + "<p>Here is the code to reset new password:</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #FF5722;'>" + verificationCode + "</p>"
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

    private void sendVerificationEmail(String email, String fullname, String verificationCode) {
        String subject = "Account Verification";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #4CAF50;'>Account Verification</h2>"
                + "<p>Dear " + fullname + ",</p>"
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
