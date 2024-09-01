package bizworks.backend.helpers;

public class ApiResponseDepartment<T> {
    private String status;
    private String message;
    private T data;
    private String error;

    // Constructors
    public ApiResponseDepartment() {
    }

    public ApiResponseDepartment(String status, String message, T data, String error) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    // Static methods to create ApiResponse instances
    public static <T> ApiResponseDepartment<T> success(T data, String message) {
        return new ApiResponseDepartment<>("SUCCESS", message, data, null);
    }

    public static <T> ApiResponseDepartment<T> badRequest(String errorMessages, String errorType) {
        return new ApiResponseDepartment<>("BAD_REQUEST", errorMessages, null, errorType);
    }

    public static <T> ApiResponseDepartment<T> errorServer(String error, String message) {
        return new ApiResponseDepartment<>("ERROR_SERVER", message, null, error);
    }

    public static <T> ApiResponseDepartment<T> notFound(String message, String error) {
        return new ApiResponseDepartment<>("NOT_FOUND", message, null, error);
    }
}
