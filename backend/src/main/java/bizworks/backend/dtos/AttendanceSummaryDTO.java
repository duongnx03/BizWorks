package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryDTO {
    private int totalEmployees;
    private int checkedInEmployees;
    private int absentEmployees;
    private int remaining;
}
