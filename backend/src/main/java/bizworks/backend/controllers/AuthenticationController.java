package bizworks.backend.controllers;

import bizworks.backend.dtos.*;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(
            @ModelAttribute UserDTO request,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(bindingResult));
        }
        try {
            authenticationService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "User registered successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<?>> authenticate(
            @Valid @RequestBody AuthenticationRequest request,
            BindingResult bindingResult,
            HttpServletResponse response
    ) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(bindingResult));
        }
        try {
            AuthenticationResponse authResponse = authenticationService.authenticate(request, response);
            return ResponseEntity.ok(ApiResponse.success(authResponse.getRole(), "User authenticated successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.errorServer(ex.getMessage(), "INVALID_CREDENTIALS"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestParam String email) {
        try {
            authenticationService.forgotPassword(email);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Send verification code successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            authenticationService.logout(request, response);
            return ResponseEntity.ok(ApiResponse.success(null, "User logged out successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<?>> reset(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            authenticationService.reset(forgotPasswordDTO);
            return ResponseEntity.ok().body(ApiResponse.success(null, "Reset password successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        try {
            authenticationService.resetPassword(resetPasswordDTO);
            return ResponseEntity.ok().body(ApiResponse.success(null, "Reset password successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        try {
            authenticationService.changePassword(changePasswordDTO);
            return ResponseEntity.ok().body(ApiResponse.success(null, "Change password successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<?>> approve(@PathVariable("id") Long id){
        try{
            authenticationService.approveCreateEmp(id);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Approved create request."));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<ApiResponse<?>> reject(@PathVariable("id") Long id, @RequestParam("reason") String reason){
        try{
            authenticationService.rejectCreateEmp(id, reason);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Approved create request."));
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getLocalizedMessage(), "ERROR_SERVER"));
        }
    }
}
