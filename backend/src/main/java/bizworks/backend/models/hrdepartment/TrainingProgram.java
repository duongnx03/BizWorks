    package bizworks.backend.models.hrdepartment;

    import bizworks.backend.models.Employee;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDate;
    import java.util.HashSet;
    import java.util.Objects;
    import java.util.Set;

    @Entity
    @Table(name = "training_programs")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class TrainingProgram {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String title;

        private String description;

        @Enumerated(EnumType.STRING)
        private TrainingType type;

        private LocalDate startDate;

        private LocalDate endDate;

        @OneToMany(mappedBy = "trainingProgram", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        private Set<Exam> exams = new HashSet<>();
        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(
                name = "training_program_employee",
                joinColumns = @JoinColumn(name = "training_program_id"),
                inverseJoinColumns = @JoinColumn(name = "employee_id")
        )
        private Set<Employee> employees;
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            TrainingProgram that = (TrainingProgram) o;
            return Objects.equals(id, that.id);
        }

        @Override
        public int hashCode() {
            return Objects.hash(id);
        }
    }
