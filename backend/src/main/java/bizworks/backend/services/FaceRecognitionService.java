package bizworks.backend.services;

import bizworks.backend.helpers.FileUpload;
import bizworks.backend.models.Employee;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FaceRecognitionService {
    private final EmployeeService employeeService;
    private final FileUpload fileUpload;
    private final RestTemplate restTemplate;

    @Value("${faceplusplus.api.key}")
    private String apiKey;

    @Value("${faceplusplus.api.secret}")
    private String apiSecret;

    private final String subFolder = "avatars";


    public boolean verifyEmployeeFace(String email, MultipartFile faceImage) throws IOException {
        // Tìm nhân viên và lấy URL của ảnh đã lưu từ cơ sở dữ liệu
        Employee employee = employeeService.findByEmail(email);
        String storedImageUrl = employee.getAvatar();

        // Chuyển đổi URL thành đường dẫn hệ thống
        String storedImagePath = storedImageUrl
                .replace("http://localhost:8080/uploads/avatars/", "\\Bizworks\\backend\\uploads\\avatars\\")
                .replace("/", File.separator);

        // Lưu ảnh mới tạm thời để so sánh
        String uploadedImageFileName = fileUpload.storeImage(subFolder, faceImage);
        String uploadedImagePath = "\\Bizworks\\backend\\uploads\\" + subFolder + File.separator + uploadedImageFileName;

        // So sánh ảnh đã lưu với ảnh mới tải lên
        boolean isMatch = compareFacesWithFacepp(storedImagePath, uploadedImagePath);

        // Xóa ảnh tạm sau khi so sánh
        fileUpload.deleteImage(uploadedImagePath);

        return isMatch;
    }

    private boolean compareFacesWithFacepp(String storedImagePath, String uploadedImagePath) throws IOException {
        String url = "https://api-us.faceplusplus.com/facepp/v3/compare";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Tạo body request
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("api_key", apiKey);
        body.add("api_secret", apiSecret);
        body.add("image_file1", new FileSystemResource(storedImagePath));
        body.add("image_file2", new FileSystemResource(uploadedImagePath));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            // Phân tích JSON và kiểm tra kết quả so sánh
            String responseBody = response.getBody();
            System.out.println("Response Body: " + responseBody);
            // Thực hiện phân tích JSON để lấy điểm số tương đồng
            double similarity = extractSimilarityScore(responseBody);
            System.out.println("Similarity Score: " + similarity);
            return similarity > 80.0; // Điều chỉnh ngưỡng theo yêu cầu của bạn
        } else {
            throw new RuntimeException("Failed to compare faces: " + response.getStatusCode());
        }
    }

    private double extractSimilarityScore(String responseBody) throws IOException {
        // Tạo đối tượng ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();

        // Phân tích phản hồi JSON thành JsonNode
        JsonNode rootNode = objectMapper.readTree(responseBody);

        // Lấy điểm số tương đồng từ phản hồi
        JsonNode confidenceNode = rootNode.path("confidence");

        // Trả về điểm số tương đồng (confidence) dưới dạng double
        return confidenceNode.asDouble();
    }
}


