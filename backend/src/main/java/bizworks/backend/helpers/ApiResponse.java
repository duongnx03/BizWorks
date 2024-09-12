package bizworks.backend.helpers;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private String message;
    private String status;
    private List<String> errors;

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(data, message, "SUCCESS", null);
    }

    public static <T> ApiResponse<T> notfound(T data, String message) {
        return new ApiResponse<>(data, message, "NOT_FOUND", null);
    }

    public static <T> ApiResponse<T> badRequest(String message) {
        return new ApiResponse<>(null, message, "BAD REQUEST", null);
    }

    public static <T> ApiResponse<T> badRequest(BindingResult bindingResult) {
        List<String> errorsBadRequest = bindingResult.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        return new ApiResponse<>(null, "Validation errors", "BAD REQUEST", errorsBadRequest);
    }

    public static <T> ApiResponse<T> errorClient(T data, String message, String status) {
        return new ApiResponse<>(data, message, status, null);
    }


    public static <T> ApiResponse<T> errorServer(String message, String status) {
        return new ApiResponse<>(null, message, status, null);
    }

    public static <T> ApiResponse<T> forbidden(String message) {
        return new ApiResponse<>(null, message, "FORBIDDEN", null);
    }

}