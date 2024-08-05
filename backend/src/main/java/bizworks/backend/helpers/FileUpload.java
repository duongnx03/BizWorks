package bizworks.backend.helpers;

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
public class FileUpload {
    @Value("${upload.folder}")
    private String uploadFolder;

    public String storeImage(String subFolder, MultipartFile multipartFile) throws IOException {
        String exactSubFolder = uploadFolder + File.separator +subFolder;
        File directory = new File(exactSubFolder);
        if(!directory.exists()){
            directory.mkdirs();
        }
        String fileName = UUID.randomUUID().toString()+ "_" + multipartFile.getOriginalFilename();
        Path destination = Path.of(exactSubFolder, fileName);
        Files.copy(multipartFile.getInputStream(), destination);
        return fileName;
    }

    public void deleteImage(String imageExisted){
        try{
            Path imageDelete = Paths.get(imageExisted);
            Files.delete(imageDelete);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


}
