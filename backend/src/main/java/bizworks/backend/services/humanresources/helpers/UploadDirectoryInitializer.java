package bizworks.backend.services.humanresources.helpers;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class UploadDirectoryInitializer {

    @Value("${upload.folder}")
    private String uploadFolder;

    @PostConstruct
    public void init() {
        // Xác định thư mục chính để lưu trữ
        Path uploadPath = Paths.get(uploadFolder);

        // Tạo thư mục nếu chưa tồn tại
        if (Files.notExists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory: " + uploadPath.toString());
            } catch (IOException e) {
                System.err.println("Failed to create upload directory: " + e.getMessage());
            }
        } else {
            System.out.println("Upload directory already exists: " + uploadPath.toString());
        }
    }
}
