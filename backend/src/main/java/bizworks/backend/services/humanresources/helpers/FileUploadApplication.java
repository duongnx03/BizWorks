package bizworks.backend.services.humanresources.helpers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadApplication {

    @Value("${upload.folder}")
    private String uploadFolder;

    public String storeImage(String subFolder, MultipartFile multipartFile) throws IOException {
        // Xác định thư mục lưu trữ cụ thể
        String exactSubFolder = uploadFolder + File.separator + subFolder;
        Path directoryPath = Paths.get(exactSubFolder);

        // Tạo thư mục nếu chưa tồn tại
        if (Files.notExists(directoryPath)) {
            try {
                Files.createDirectories(directoryPath);
            } catch (IOException e) {
                throw new IOException("Failed to create directory: " + exactSubFolder, e);
            }
        }

        // Tạo tên tệp tin với UUID để đảm bảo tính duy nhất
        String fileName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
        Path destination = directoryPath.resolve(fileName);

        // Lưu tệp tin
        try {
            Files.copy(multipartFile.getInputStream(), destination);
        } catch (IOException e) {
            throw new IOException("Failed to store file: " + fileName, e);
        }

        // Trả về tên tệp tin đã lưu
        return fileName;
    }
    public Path loadFile(String fileName) {
        return Paths.get(uploadFolder).resolve(fileName).normalize();
    }
}
