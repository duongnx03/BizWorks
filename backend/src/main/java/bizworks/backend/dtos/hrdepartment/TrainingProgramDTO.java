    package bizworks.backend.dtos.hrdepartment;

    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDate;
    import java.util.List;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class TrainingProgramDTO {
        private Long id;
        private String title;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<Long> participantIds; // Danh sách ID của Employee tham gia

    }