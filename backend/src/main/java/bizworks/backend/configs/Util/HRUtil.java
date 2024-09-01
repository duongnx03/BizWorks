package bizworks.backend.config.Util;

import bizworks.backend.models.User;
import bizworks.backend.models.Employee;
import bizworks.backend.services.EmployeeService;
import org.springframework.stereotype.Component;

@Component
public class HRUtil {

    private final EmployeeService employeeService;

    public HRUtil(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    public boolean isUserInHRDepartment(User user) {
        Employee employee = employeeService.findByUser(user);
        return employee != null && "HR Department".equals(employee.getDepartment().getName());
    }

    public boolean isUserLeaderInHRDepartment(User user) {
        Employee employee = employeeService.findByUser(user);
        return employee != null &&
                "HR Department".equals(employee.getDepartment().getName()) &&
                "Leader".equals(user.getRole()); // Lấy role từ User
    }
}
