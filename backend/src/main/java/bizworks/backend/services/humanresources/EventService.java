package bizworks.backend.services.humanresources;

import bizworks.backend.dtos.EventDTO;
import bizworks.backend.helpers.FileUpload;
import bizworks.backend.models.Event;
import bizworks.backend.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final FileUpload fileUpload;

    public void createEvent(EventDTO eventDTO, MultipartFile file) throws IOException {
        // Tải lên hình ảnh và nhận lại tên hình ảnh
        String imageName = fileUpload.storeImage("events", file);
        String imageUrl = "http://localhost:8080/uploads/events/" + imageName; // Cập nhật URL hình ảnh theo yêu cầu

        // Tạo sự kiện mới
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDate(eventDTO.getDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setDescription(eventDTO.getDescription());
        event.setImageUrl(imageUrl);
        event.setStatus("ACTIVE"); // Trạng thái mặc định
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());

        // Lưu sự kiện vào cơ sở dữ liệu
        eventRepository.save(event);
    }
}
