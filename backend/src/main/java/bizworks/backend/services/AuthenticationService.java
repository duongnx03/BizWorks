package bizworks.backend.services;
import bizworks.backend.dtos.*;
import bizworks.backend.helpers.FileUpload;
import bizworks.backend.models.*;
import bizworks.backend.repositories.DepartmentRepository;
import bizworks.backend.repositories.ForgotPasswordRepository;
import bizworks.backend.repositories.PositionRepository;
import bizworks.backend.repositories.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final String rootUrl = "http://localhost:8080/";
    private final String subFolder = "avatars";
    private final String uploadFolder = "uploads";
    private final String urlImage = rootUrl + uploadFolder + File.separator + subFolder;
    private static final String DIGITS = "0123456789";
    private static final int CODE_LENGTH = 8;
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String SPECIAL_CHARACTERS = "!@#$%^&*()-_+=<>?";

    private static final String ALL_CHARACTERS = LOWERCASE + UPPERCASE + DIGITS + SPECIAL_CHARACTERS;
    private static final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmployeeService employeeService;
    private final VerifyAccountService verifyAccountService;
    private final MailService mailService;
    private final ForgotPasswordService forgotPasswordService;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeApprovalQueueService employeeApprovalQueueService;
    private final FileUpload fileUpload;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void register(UserDTO request) throws IOException {
        String email = getCurrentUserEmail();
        User userExisted = userRepository.findByEmail(email).orElseThrow();

        if(userExisted.getRole().equals("ADMIN")){
            if (employeeService.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }

            String password = generateRandomPassword();

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("MANAGE");
            userRepository.save(user);

            String imageName = fileUpload.storeImage(subFolder, request.getFileImage());
            String exactImageUrl = urlImage + File.separator + imageName;

            Department department = departmentRepository.findById(request.getDepartment_id()).orElseThrow();
            Position position = positionRepository.findById(request.getPosition_id()).orElseThrow();

            Employee employee = new Employee();
            employee.setFullname(request.getFullname());
            employee.setEmpCode(generateEmpCode());
            employee.setEmail(request.getEmail());
            employee.setAvatar(exactImageUrl.replace("\\", "/"));
            employee.setStartDate(request.getStartDate());
            employee.setUser(user);
            employee.setDepartment(department);
            employee.setPosition(position);
            employeeService.save(employee);

            VerifyAccount verifyAccount = verifyAccountService.createVerifyAccount(user);
            sendVerificationEmail(request.getEmail(), request.getFullname(), verifyAccount.getVerificationCode(), password);
        }else{
            Long censor;
            String description;
            Long sender;
            if (employeeApprovalQueueService.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            if(employeeService.existsByEmail(request.getEmail())){
                throw new IllegalArgumentException("Email already in use");
            }

            switch (userExisted.getRole()) {
                case "LEADER" -> {
                    censor = userRepository.findUserByRole("MANAGE").getId();
                    description = "Request to create employee";
                    sender = userExisted.getId();
                }
                case "MANAGE" -> {
                    censor = userRepository.findUserByRole("ADMIN").getId();
                    description = "Request to create leader";
                    sender = userExisted.getId();
                }
                default -> throw new IllegalStateException("Unexpected value: " + userExisted.getRole());
            }

            String imageName = fileUpload.storeImage(subFolder, request.getFileImage());
            String exactImageUrl = urlImage + File.separator + imageName;

            Department department = departmentRepository.findById(request.getDepartment_id()).orElseThrow();
            Position position = positionRepository.findById(request.getPosition_id()).orElseThrow();

            EmployeeApprovalQueue employeeApprovalQueue = new EmployeeApprovalQueue();
            employeeApprovalQueue.setFullname(request.getFullname());
            employeeApprovalQueue.setEmpCode(generateEmpCode());
            employeeApprovalQueue.setEmail(request.getEmail());
            employeeApprovalQueue.setAvatar(exactImageUrl.replace("\\", "/"));
            employeeApprovalQueue.setStartDate(request.getStartDate());
            employeeApprovalQueue.setDepartmentId(department.getId());
            employeeApprovalQueue.setDepartmentName(department.getName());
            employeeApprovalQueue.setPositionId(position.getId());
            employeeApprovalQueue.setPositionName(position.getPositionName());
            employeeApprovalQueue.setStatus("Pending");
            employeeApprovalQueue.setDescription(description);
            employeeApprovalQueue.setCensor(censor);
            employeeApprovalQueue.setSender(sender);

            employeeApprovalQueueService.save(employeeApprovalQueue);
        }
    }

    public void approveCreateEmp(Long id){
        String email = getCurrentUserEmail();
        User userExisted = userRepository.findByEmail(email).orElseThrow();
        if(userExisted.getRole().equals("MANAGE")) {
            EmployeeApprovalQueue employeeApprovalQueue = employeeApprovalQueueService.findById(id);
            Long censor = userRepository.findUserByRole("ADMIN").getId();
            employeeApprovalQueue.setCensor(censor);
            employeeApprovalQueue.setIsManageShow(userExisted.getEmployee().getId());
            employeeApprovalQueue.setDescription("Waiting for admin approval.");
            employeeApprovalQueueService.save(employeeApprovalQueue);
        }else{
            EmployeeApprovalQueue employeeApprovalQueue = employeeApprovalQueueService.findById(id);
            String role;
            User userGetRole = userRepository.findById(employeeApprovalQueue.getSender()).orElseThrow();
            switch (userGetRole.getRole()){
                case "LEADER" -> {
                    role = "EMPLOYEE";
                }
                case "MANAGE" -> {
                    role = "LEADER";
                }
                default -> throw new IllegalStateException("Unexpected value: ");
            }
            employeeApprovalQueue.setStatus("Approved");
            employeeApprovalQueue.setDescription("Approve request.");
            String password = generateRandomPassword();

            User user = new User();
            user.setEmail(employeeApprovalQueue.getEmail());
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);

            Department department = departmentRepository.findById(employeeApprovalQueue.getDepartmentId()).orElseThrow();
            Position position = positionRepository.findById(employeeApprovalQueue.getPositionId()).orElseThrow();

            Employee employee = new Employee();
            employee.setFullname(employeeApprovalQueue.getFullname());
            employee.setEmpCode(employeeApprovalQueue.getEmpCode());
            employee.setEmail(employeeApprovalQueue.getEmail());
            employee.setAvatar(employeeApprovalQueue.getAvatar());
            employee.setStartDate(employeeApprovalQueue.getStartDate());
            employee.setUser(user);
            employee.setDepartment(department);
            employee.setPosition(position);
            employeeService.save(employee);

            VerifyAccount verifyAccount = verifyAccountService.createVerifyAccount(user);
            sendVerificationEmail(employeeApprovalQueue.getEmail(), employeeApprovalQueue.getFullname(), verifyAccount.getVerificationCode(), password);
        }
    }

    public void rejectCreateEmp(Long id, String reason) throws MessagingException {
        String email = getCurrentUserEmail();
        User userExisted = userRepository.findByEmail(email).orElseThrow();
        EmployeeApprovalQueue employeeApprovalQueue = employeeApprovalQueueService.findById(id);
        if(userExisted.getRole().equals("MANAGE")){
            employeeApprovalQueue.setIsManageShow(userExisted.getEmployee().getId());
        }
        employeeApprovalQueue.setStatus("Rejected");
        employeeApprovalQueue.setDescription(reason);
        employeeApprovalQueueService.save(employeeApprovalQueue);
        sendEmailRejected(employeeApprovalQueue.getEmail(), employeeApprovalQueue.getEmpCode(), employeeApprovalQueue.getFullname());
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

            RefreshToken refreshTokenSave = new RefreshToken();
            refreshTokenSave.setToken(refreshToken);
            refreshTokenSave.setUser(user);
            refreshTokenSave.setExpiryDate(Instant.now().plusMillis(86400000));
            refreshTokenService.save(refreshTokenSave);

            Cookie accessTokenCookie = new Cookie("access_token", jwtToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(true);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(864000);
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

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        String refreshToken = Arrays.stream(cookies)
                .filter(cookie -> "refresh_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findAny()
                .orElse(null);
        refreshTokenService.removeToken(refreshToken);

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
        String email = getCurrentUserEmail();
        User userExisted = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // Mã hóa mật khẩu mới
        String newPassword = resetPasswordDTO.getNewPassword();

        // So sánh mật khẩu mới với mật khẩu hiện tại đã mã hóa
        if (passwordEncoder.matches(newPassword, userExisted.getPassword())) {
            throw new RuntimeException("New password cannot be the same as the old password");
        }

        // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
        userExisted.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userExisted);
    }

    private void sendVerificationForgotPassword(String email, String verificationCode) {
        String subject = "Forgot Password";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #4CAF50; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Forgot Password</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + email + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Here is the code to reset your new password:</p>"
                + "<div style='text-align: center; margin: 20px 0;'>"
                + verificationCode.chars()
                .mapToObj(c -> "<span style='display: inline-block; width: 50px; height: 50px; margin: 0 10px; border-radius: 5px; border: 2px solid #4CAF50; background-color: #E8F5E9; line-height: 50px; text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50;'>"
                        + (char) c + "</span>")
                .collect(Collectors.joining())
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

        try {
            mailService.sendEmail(email, subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Handle the error appropriately in a real application
        }
    }

    private void sendVerificationEmail(String email, String fullname, String verificationCode, String password) {
        String subject = "Account Verification";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #4CAF50; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Account Verification</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + fullname + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Welcome to BizWorks. Please use the following verification code to verify your account:</p>"
                + "<div style='text-align: center; margin: 20px 0;'>"
                + verificationCode.chars()
                .mapToObj(c -> "<span style='display: inline-block; width: 50px; height: 50px; margin: 0 10px; border-radius: 5px; border: 2px solid #4CAF50; background-color: #E8F5E9; line-height: 50px; text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50;'>"
                        + (char) c + "</span>")
                .collect(Collectors.joining())
                + "</div>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Below are your login details:</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>"
                + "<tr style='background-color: #f9f9f9;'>"
                + "<td style='padding: 10px; border: 1px solid #dddddd; font-weight: bold;'>Email:</td>"
                + "<td style='padding: 10px; border: 1px solid #dddddd;'>" + email + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td style='padding: 10px; border: 1px solid #dddddd; font-weight: bold;'>Password:</td>"
                + "<td style='padding: 10px; border: 1px solid #dddddd;'>" + password + "</td>"
                + "</tr>"
                + "</table>"
                + "<p style='font-size: 14px; color: #777777; margin-top: 20px;'>This code will expire in 24h.</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>"
                + "<p style='margin: 0;'>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        try {
            mailService.sendEmail(email, subject, content);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Handle the error appropriately in a real application
        }
    }

    public void sendEmailRejected(String email, String empCode, String fullname) throws MessagingException {
        String subject = "Employee Creation Request - Denied";
        String content = "<html>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background-color: #ff4c4c; color: #ffffff; padding: 20px 30px; text-align: center;'>"
                + "<h2 style='margin: 0; font-size: 24px;'>Employee Creation Request Denied</h2>"
                + "</div>"
                + "<div style='padding: 30px; color: #333333;'>"
                + "<p style='font-size: 18px;'>Dear " + empCode + " - " + fullname + ",</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We regret to inform you that your request for employee creation has not been approved at this time. After careful consideration and review of the current requirements, we have determined that the request does not meet the necessary criteria.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>We appreciate your understanding in this matter and encourage you to review any additional information that may support a future request. If you have any questions or need further clarification, please do not hesitate to reach out.</p>"
                + "<p style='font-size: 16px; line-height: 1.5;'>Thank you for your understanding and cooperation.</p>"
                + "</div>"
                + "<div style='background-color: #f4f4f4; padding: 20px 30px; text-align: center; color: #777777;'>"
                + "<p style='margin: 0;'>Best regards,<br>BizWorks</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        mailService.sendEmail(email, subject, content);
    }


    private String generateEmpCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(DIGITS.length());
            sb.append(DIGITS.charAt(index));
        }
        return sb.toString();
    }

    private String generateRandomPassword() {
        int length = 10;
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(ALL_CHARACTERS.length());
            password.append(ALL_CHARACTERS.charAt(index));
        }
        return password.toString();
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("No user is authenticated");
    }
}
