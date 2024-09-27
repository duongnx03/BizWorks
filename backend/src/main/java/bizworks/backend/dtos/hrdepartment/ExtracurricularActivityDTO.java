package bizworks.backend.dtos.hrdepartment;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ExtracurricularActivityDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private List<Long> participantIds; // List of employee IDs participating
    private boolean completed;
}
