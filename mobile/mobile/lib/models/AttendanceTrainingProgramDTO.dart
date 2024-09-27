import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';

class AttendanceTrainingProgramDTO {
  final int id;
  final TrainingProgramDTO trainingProgram;
  final EmployeeResponseDTO employee;
  final DateTime? attendedAt;
  final DateTime? attendanceDate;
  final AttendanceStatus status;

  AttendanceTrainingProgramDTO({
    required this.id,
    required this.trainingProgram,
    required this.employee,
    this.attendedAt,
    this.attendanceDate,
    required this.status,
  });

  factory AttendanceTrainingProgramDTO.fromJson(Map<String, dynamic> json) {
    return AttendanceTrainingProgramDTO(
      id: json['id'] as int,
      trainingProgram: TrainingProgramDTO.fromJson(json['trainingProgram']),
      employee: EmployeeResponseDTO.fromJson(json['employee']),
      attendedAt: json['attendedAt'] != null
          ? DateTime.tryParse(json['attendedAt'])
          : null,
      attendanceDate: json['attendanceDate'] != null
          ? DateTime.tryParse(json['attendanceDate'])
          : null,
      status: AttendanceStatus.values.firstWhere(
          (e) => e.toString() == 'AttendanceStatus.${json['status']}'),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'trainingProgram': trainingProgram.toJson(),
      'employee': employee.toJson(),
      'attendedAt': attendedAt?.toIso8601String(),
      'attendanceDate': attendanceDate?.toIso8601String(),
      'status': status.toString().split('.').last,
    };
  }
}

enum AttendanceStatus {
  PRESENT,
  ABSENT,
}
