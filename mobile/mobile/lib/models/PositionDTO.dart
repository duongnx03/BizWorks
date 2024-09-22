import 'package:mobile/models/DepartmentDTO.dart';
import 'package:mobile/models/EmployeeResponseDTO.dart';

class PositionDTO {
  final int id;
  final String positionName;
  final String description;
  final double basicSalary;
  final List<EmployeeResponseDTO>? employees;
  final DepartmentDTO? department;

  PositionDTO({
    required this.id,
    required this.positionName,
    required this.description,
    required this.basicSalary,
    this.employees,
    this.department,
  });

  factory PositionDTO.fromJson(Map<String, dynamic> json) {
    return PositionDTO(
      id: json['id'] as int,
      positionName: json['positionName'] as String,
      description: json['description'] as String,
      basicSalary: json['basicSalary'] as double,
      employees: json['employees'] != null
          ? List<EmployeeResponseDTO>.from(
              json['employees'].map((e) => EmployeeResponseDTO.fromJson(e)))
          : null,
      department: json['department'] != null
          ? DepartmentDTO.fromJson(json['department'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'positionName': positionName,
      'description': description,
      'basicSalary': basicSalary,
      'employees': employees?.map((e) => e.toJson()).toList(),
      'department': department?.toJson(),
    };
  }
}
