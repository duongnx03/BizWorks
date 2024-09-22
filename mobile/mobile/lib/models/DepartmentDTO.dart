import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/models/PositionDTO.dart';

class DepartmentDTO {
  final int id;
  final String name;
  final String description;
  final List<EmployeeResponseDTO>? employees;
  final List<PositionDTO>? positions;

  DepartmentDTO({
    required this.id,
    required this.name,
    required this.description,
    this.employees,
    this.positions,
  });

  factory DepartmentDTO.fromJson(Map<String, dynamic> json) {
    return DepartmentDTO(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      employees: json['employees'] != null
          ? List<EmployeeResponseDTO>.from(
              json['employees'].map((e) => EmployeeResponseDTO.fromJson(e)))
          : null,
      positions: json['positions'] != null
          ? List<PositionDTO>.from(
              json['positions'].map((p) => PositionDTO.fromJson(p)))
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'employees': employees?.map((e) => e.toJson()).toList(),
      'positions': positions?.map((p) => p.toJson()).toList(),
    };
  }
}
