package bizworks.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceReportDTO {
    private String totalWorkTimeInWeek;
    private String totalWorkTimeInMonth;
    private String totalOvertimeInMonth;
}
