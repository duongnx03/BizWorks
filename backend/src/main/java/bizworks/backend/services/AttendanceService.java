package bizworks.backend.services;

import bizworks.backend.dtos.AttendanceReportDTO;
import bizworks.backend.dtos.AttendanceDTO;
import bizworks.backend.dtos.AttendanceSummaryDTO;
import bizworks.backend.dtos.EmployeeDTO;
import bizworks.backend.models.Attendance;
import bizworks.backend.models.Employee;
import bizworks.backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeService employeeService;

    public Attendance save(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> findAll() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendancesByEmployeeEmail(String email) {
        return attendanceRepository.findByEmployeeEmail(email);
    }

    public List<Attendance> getAttendancesByAttendanceDate() {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByAttendanceDate(today);
    }

    public Attendance getAttendanceByEmployeeEmailAndDate(String email, LocalDate attendanceDate) {
        return attendanceRepository.findByEmployeeEmailAndAttendanceDate(email, attendanceDate);
    }

    public AttendanceReportDTO getTotalWorkAndOvertime(String email, LocalDate inputDate) {
        List<Attendance> attendances = attendanceRepository.findByEmployeeEmail(email);

        // Tổng giờ làm việc trong tuần tính đến ngày inputDate
        LocalDate startOfWeek = inputDate.with(java.time.DayOfWeek.MONDAY);
        Duration totalWorkTimeInWeek = Duration.ZERO;

        for (Attendance attendance : attendances) {
            if (!attendance.getAttendanceDate().isBefore(startOfWeek) && !attendance.getAttendanceDate().isAfter(inputDate)) {
                totalWorkTimeInWeek = totalWorkTimeInWeek.plusHours(attendance.getTotalWorkTime().getHour())
                        .plusMinutes(attendance.getTotalWorkTime().getMinute());
            }
        }

        // Tổng giờ làm việc trong tháng tính đến ngày inputDate
        LocalDate startOfMonth = inputDate.withDayOfMonth(1);
        Duration totalWorkTimeInMonth = Duration.ZERO;
        Duration totalOvertimeInMonth = Duration.ZERO;

        for (Attendance attendance : attendances) {
            if (!attendance.getAttendanceDate().isBefore(startOfMonth) && !attendance.getAttendanceDate().isAfter(inputDate)) {
                totalWorkTimeInMonth = totalWorkTimeInMonth.plusHours(attendance.getTotalWorkTime().getHour())
                        .plusMinutes(attendance.getTotalWorkTime().getMinute());
                totalOvertimeInMonth = totalOvertimeInMonth.plusHours(attendance.getOvertime().getHour())
                        .plusMinutes(attendance.getOvertime().getMinute());
            }
        }

        return new AttendanceReportDTO(
                formatDuration(totalWorkTimeInWeek),
                formatDuration(totalWorkTimeInMonth),
                formatDuration(totalOvertimeInMonth)
        );
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        return String.format("%02d:%02d", hours, minutes);
    }

    public Attendance checkIn(String email) {
        LocalDate today = LocalDate.now();
        Attendance existingAttendance = getAttendanceByEmployeeEmailAndDate(email, today);
        if (existingAttendance != null) {
            throw new RuntimeException("You have already checked in today");
        } else {
            Attendance attendance = new Attendance();
            Employee employee = employeeService.findByEmail(email);
            attendance.setCheckInTime(LocalDateTime.now());
            attendance.setCheckOutTime(null);
            attendance.setAttendanceDate(today);
            attendance.setTotalWorkTime(null);
            attendance.setOvertime(null);
            attendance.setStatus("In Progress");
            attendance.setEmployee(employee);
            return save(attendance);
        }
    }

    public Attendance checkOut(String email) {
        LocalDate attendanceDate = LocalDate.now();
        Attendance attendance = getAttendanceByEmployeeEmailAndDate(email, attendanceDate);
        LocalDateTime checkOutTime = LocalDateTime.now();
        attendance.setCheckOutTime(checkOutTime);
        attendance.setStatus("Present");

        // Calculate the total worked time
        LocalDateTime checkInTime = attendance.getCheckInTime();
        long workedMinutes = java.time.Duration.between(checkInTime, checkOutTime).toMinutes();
        attendance.setTotalWorkTime(LocalTime.of((int) workedMinutes / 60, (int) workedMinutes % 60));
        // Calculate overtime if worked time exceeds 8 hours (480 minutes)
        if (workedMinutes > 480) {
            long overtimeMinutes = workedMinutes - 480;
            attendance.setOvertime(LocalTime.of((int) overtimeMinutes / 60, (int) overtimeMinutes % 60));
        } else {
            attendance.setOvertime(LocalTime.of(0, 0));
        }
        return save(attendance);
    }

    public List<Attendance> markAbsentEmployees() {
        LocalDate today = LocalDate.now();
        List<Employee> allEmployees = employeeService.findAll();
        List<Attendance> todaysAttendances = attendanceRepository.findByAttendanceDate(today);

        List<Employee> checkedInEmployees = todaysAttendances.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());

        List<Employee> absentEmployees = allEmployees.stream()
                .filter(employee -> !checkedInEmployees.contains(employee))
                .collect(Collectors.toList());
        List<Attendance> absentAttendances = new ArrayList<>();
        for (Employee absentEmployee : absentEmployees) {
            Attendance attendance = new Attendance();
            attendance.setCheckInTime(null);
            attendance.setCheckOutTime(null);
            attendance.setTotalWorkTime(null);
            attendance.setOvertime(null);
            attendance.setAttendanceDate(today);
            attendance.setStatus("Absent");
            attendance.setEmployee(absentEmployee);
            Attendance savedAttendance = save(attendance);
            absentAttendances.add(savedAttendance);
        }
        return absentAttendances;
    }

    public AttendanceSummaryDTO getAttendanceSummary() {
        LocalDate today = LocalDate.now();
        List<Employee> allEmployees = employeeService.findAll();
        List<Attendance> todaysAttendances = attendanceRepository.findByAttendanceDate(today);

        int totalEmployees = allEmployees.size();
        List<Employee> checkedInEmployees = todaysAttendances.stream()
                .map(Attendance::getEmployee)
                .collect(Collectors.toList());
        int checkedInCount = checkedInEmployees.size();
        int absentCount = (int) allEmployees.stream()
                .filter(employee -> !checkedInEmployees.contains(employee))
                .count();

        return new AttendanceSummaryDTO(totalEmployees, checkedInCount, absentCount);
    }

    public AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO attendanceDTO = new AttendanceDTO();
        attendanceDTO.setId(attendance.getId());
        attendanceDTO.setCheckInTime(attendance.getCheckInTime());
        attendanceDTO.setCheckOutTime(attendance.getCheckOutTime());
        attendanceDTO.setAttendanceDate(attendance.getAttendanceDate());
        attendanceDTO.setTotalWorkTime(attendance.getTotalWorkTime());
        attendanceDTO.setOvertime(attendance.getOvertime());
        attendanceDTO.setStatus(attendance.getStatus());
        attendanceDTO.setEmployee(convertToEmployeeDTO(attendance.getEmployee()));
        return attendanceDTO;
    }

    private EmployeeDTO convertToEmployeeDTO(Employee employee) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setId(employee.getId());
        employeeDTO.setFullname(employee.getFullname());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setGender(employee.getGender());
        employeeDTO.setEmail(employee.getEmail());
        employeeDTO.setPhone(employee.getPhone());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setEndDate(employee.getEndDate());
        employeeDTO.setStartDate(employee.getStartDate());
        employeeDTO.setPosition(employee.getPosition().getPositionName());
        employeeDTO.setDepartment(employee.getDepartment().getDepartmentName());
        return employeeDTO;
    }
}

