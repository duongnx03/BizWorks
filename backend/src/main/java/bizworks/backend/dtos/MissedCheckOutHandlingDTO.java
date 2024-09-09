package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MissedCheckOutHandlingDTO {
    private Long id;
    private String description;
    private String status;
    private AttendanceDTO attendanceDTO;
}
