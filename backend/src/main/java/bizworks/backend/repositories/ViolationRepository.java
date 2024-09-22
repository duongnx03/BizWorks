    package bizworks.backend.repositories;

    import bizworks.backend.models.Violation;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.util.List;

    @Repository
    public interface ViolationRepository extends JpaRepository<Violation, Long> {
        List<Violation> findByEmployeeFullnameContaining(String fullname);

        List<Violation> findByEmployeeId(Long employeeId);

        List<Violation> findByViolationTypeId(Long violationTypeId);

        @Query("SELECT v FROM Violation v WHERE v.employee.user.role = :role")
        List<Violation> findByEmployeeUserRole(@Param("role") String role);

        @Query("SELECT v FROM Violation v WHERE v.employee.user.role IN :roles")
        List<Violation> findByEmployeeUserRoleIn(@Param("roles") List<String> roles);

        List<Violation> findByEmployeeIdAndViolationDateBetween(Long employeeId, LocalDateTime startDate, LocalDateTime endDate);
        List<Violation> findByStatus(String status);
    }
