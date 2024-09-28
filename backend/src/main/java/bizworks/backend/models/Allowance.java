package bizworks.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "allowances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Allowance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private double amount;

    private String description;

    @NotNull
    private Integer month;

    @NotNull
    private Integer year;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
