package com.example.bizwebsite.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "positions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String positionName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties("positions")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id") // Thay đổi tên cột nếu cần thiết
    @JsonIgnoreProperties("positions")
    private Employee employee; // Thêm liên kết đến Employee
}
