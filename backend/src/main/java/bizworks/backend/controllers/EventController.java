package bizworks.backend.controllers;

import bizworks.backend.dtos.EventDTO;
import bizworks.backend.helpers.ApiResponse;
import bizworks.backend.services.humanresources.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createEvent(
            @Valid @RequestPart("event") EventDTO eventDTO,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            eventService.createEvent(eventDTO, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Event created successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.errorServer(ex.getMessage(), "ERROR_SERVER"));
        }
    }
}