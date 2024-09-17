import 'package:mobile/models/EmployeeResponseDTO.dart';

class UserResponseDTO {
  final int id;
  final EmployeeResponseDTO employee;

  UserResponseDTO({
    required this.id,
    required this.employee,
  });

  factory UserResponseDTO.fromJson(Map<String, dynamic> json) {
    return UserResponseDTO(
      id: json['id'] as int,
      employee: EmployeeResponseDTO.fromJson(json['employee']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id as int?,
      'employee': employee.toJson(),
    };
  }
}