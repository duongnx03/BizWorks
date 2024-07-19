package com.example.projects.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PositionDTO {
    private Long id;
    private String positionName;
    private Long departmentId;
    private String departmentName;
}