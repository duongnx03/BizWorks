package com.example.bizwebsite.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String fullname;
    private LocalDate dob;
    private String address;
    private String gender;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long positionId; // ID of the position
    private String positionName; // Optionally, position name
    private Long departmentId; // ID of the department
    private String departmentName; // Optionally, department name
    private String role; // Optional field for role
}
