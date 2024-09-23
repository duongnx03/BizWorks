import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/models/ViolationDTO.dart';

class ViolationComplaintDTO {
  final int id;
  final EmployeeResponseDTO employee;
  final ViolationDTO violation;
  final String description;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  ViolationComplaintDTO({
    required this.id,
    required this.employee,
    required this.violation,
    required this.description,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ViolationComplaintDTO.fromJson(Map<String, dynamic> json) {
    print('Processing ViolationComplaintDTO: $json');
    return ViolationComplaintDTO(
      id: json['id'],
      employee: EmployeeResponseDTO.fromJson(json['employee']),
      violation: ViolationDTO.fromJson(json['violation']),
      description: json['description'],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    print('Converting ViolationComplaintDTO to JSON: $this');
    return {
      'id': id,
      'employee': employee.toJson(),
      'violation': violation.toJson(),
      'description': description,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
