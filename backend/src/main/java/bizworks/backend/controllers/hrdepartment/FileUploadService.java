package bizworks.backend.controllers.hrdepartment;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    // Đường dẫn thư mục lưu trữ file
    private final String uploadDir = "uploads/";

    public FileUploadService() {
        // Tạo thư mục upload nếu chưa tồn tại
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException("Could not create upload directory", e);
            }
        }
    }

    // Phương thức lưu file
    public String storeFile(MultipartFile file) {
        try {
            // Tạo tên file mới duy nhất
            String originalFileName = file.getOriginalFilename();
            String newFileName = UUID.randomUUID().toString() + "_" + originalFileName;

            // Đường dẫn lưu trữ file
            Path targetLocation = Paths.get(uploadDir + newFileName);

            // Lưu file vào hệ thống
            Files.copy(file.getInputStream(), targetLocation);

            // Trả về URL hoặc đường dẫn của file đã upload
            return targetLocation.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
