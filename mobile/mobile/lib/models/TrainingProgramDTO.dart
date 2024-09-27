import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/models/AttendanceTrainingProgramDTO.dart';

class TrainingProgramDTO {
  final int id;
  final String title;
  final String description;
  final DateTime? startDate;
  final DateTime? endDate;
  final List<EmployeeResponseDTO>? participants;
  final List<AttendanceTrainingProgramDTO>? attendanceRecords;
  final bool completed;

  TrainingProgramDTO({
    required this.id,
    required this.title,
    required this.description,
    this.startDate,
    this.endDate,
    this.participants,
    this.attendanceRecords,
    required this.completed,
  });

  factory TrainingProgramDTO.fromJson(Map<String, dynamic> json) {
    return TrainingProgramDTO(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'])
          : null,
      endDate:
          json['endDate'] != null ? DateTime.tryParse(json['endDate']) : null,
      participants: json['participants'] != null
          ? List<EmployeeResponseDTO>.from(
              json['participants'].map((e) => EmployeeResponseDTO.fromJson(e)))
          : null,
      attendanceRecords: json['attendanceRecords'] != null
          ? List<AttendanceTrainingProgramDTO>.from(json['attendanceRecords']
              .map((a) => AttendanceTrainingProgramDTO.fromJson(a)))
          : null,
      completed: json['completed'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'participants': participants?.map((e) => e.toJson()).toList(),
      'attendanceRecords': attendanceRecords?.map((a) => a.toJson()).toList(),
      'completed': completed,
    };
  }
}
