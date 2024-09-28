package bizworks.backend.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignAllowanceToEmployeeDTO {

    private Long allowanceId; // ID của allowance
    private List<Long> employeeIds; // Danh sách ID của các nhân viên được gán allowance
}

