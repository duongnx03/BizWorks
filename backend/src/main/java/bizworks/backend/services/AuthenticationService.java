package bizworks.backend.services;
import bizworks.backend.dtos.*;
import bizworks.backend.models.*;
import bizworks.backend.repository.ForgotPasswordRepository;
import bizworks.backend.repository.RefreshTokenRepository;
import bizworks.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

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
    private ForgotPasswordRepository forgotPasswordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDTO register(UserDTO request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);

        Department department = departmentService.getDepartmentById(request.getDepartment_id());
        Position position = positionService.getPositionById(request.getPosition_id()).orElseThrow();
        Employee employee = new Employee();
        employee.setFullname(request.getFullname());
        employee.setDob(null);
        employee.setAddress(null);
        employee.setGender(null);
        employee.setEmail(request.getEmail());
        employee.setPhone(null);
        employee.setAvatar(null);
        employee.setStartDate(request.getStartDate());
        employee.setEndDate(null);
        employee.setDepartment(department);
        employee.setPosition(position);
        employee.setUser(user);
        employeeService.save(employee);

        VerifyAccount verifyAccount = verifyAccountService.createVerifyAccount(user);
        sendVerificationEmail(request.getEmail(), request.getFullname(), verifyAccount.getVerificationCode());

        return request;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.createRefreshToken(user);

            Cookie accessTokenCookie = new Cookie("access_token", jwtToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(true);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(3600);
            response.addCookie(accessTokenCookie);

            Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(864000);
            response.addCookie(refreshTokenCookie);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .role(user.getRole())
                    .build();
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }

    public String refresh(String refreshToken, HttpServletResponse response) {
        if (jwtService.isRefreshTokenValid(refreshToken)) {
            Claims claims = jwtService.extractAllClaims(refreshToken);
            String username = claims.getSubject();
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails != null) {
                String newAccessToken = jwtService.generateToken(userDetails);

                Cookie accessTokenCookie = new Cookie("access_token", newAccessToken);
                accessTokenCookie.setHttpOnly(true);
                accessTokenCookie.setSecure(true);
                accessTokenCookie.setPath("/");
                accessTokenCookie.setMaxAge(3600);
                response.addCookie(accessTokenCookie);

                return newAccessToken;
            }
        }
        throw new RuntimeException("Invalid refresh token");
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        ForgotPassword forgotPassword;
        Optional<ForgotPassword> existingForgotPassword = forgotPasswordRepository.findForgotPasswordByUserId(user.getId());

        if (existingForgotPassword.isPresent()) {
            forgotPassword = forgotPasswordService.updateVerificationCode(user);
        } else {
            forgotPassword = forgotPasswordService.createVerifyAccount(user);
        }

        sendVerificationForgotPassword(user.getEmail(), forgotPassword.getVerificationCode());
    }

    public void reset(ForgotPasswordDTO forgotPasswordDTO) {
        User userExisted = userRepository.findByEmail(forgotPasswordDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ForgotPassword forgotPassword = forgotPasswordService.findForgotPasswordByUserId(userExisted.getId());

        if (forgotPassword.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        if (forgotPassword.getVerificationCode().equals(forgotPasswordDTO.getVerificationCode())) {
            userExisted.setPassword(passwordEncoder.encode(forgotPasswordDTO.getNewPassword()));
            userRepository.save(userExisted);
            forgotPasswordService.delete(forgotPassword.getId());
        } else {
            throw new RuntimeException("Invalid verification code");
        }
    }

    public void logout(HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String email = authentication.getName();
            var user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                refreshTokenRepository.deleteByUser(user);
            }
        }

        Cookie accessTokenCookie = new Cookie("access_token", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refresh_token", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }

    public void resetPassword(ResetPasswordDTO resetPasswordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User userExisted = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        userExisted.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        userRepository.save(userExisted);
    }

    private void sendVerificationForgotPassword(String email, String verificationCode) {
        String subject = "Forgot Password";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #4CAF50;'>Forgot Password</h2>"
                + "<p>Dear " + email + ",</p>"
                + "<p>Here is the code to reset your new password:</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #FF5722;'>" + verificationCode + "</p>"
                + "<p>This code will expire in 5 minute.</p>"
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
                + "<p>This code will expire in 5 minute.</p>"
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
