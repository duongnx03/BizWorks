import 'package:mobile/models/EmployeeResponseDTO.dart';

class TrainingProgramDTO {
  final int id;
  final String title;
  final String description;
  final DateTime startDate;
  final DateTime endDate;
  final List<int> participantIds; // Chỉ cần ánh xạ IDs
  final bool completed;

  TrainingProgramDTO({
    required this.id,
    required this.title,
    required this.description,
    required this.startDate,
    required this.endDate,
    required this.participantIds,
    required this.completed,
  });

  factory TrainingProgramDTO.fromJson(Map<String, dynamic> json) {
    return TrainingProgramDTO(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      participantIds: List<int>.from(
          json['participantIds'] as List), // Ánh xạ participantIds
      completed: json['completed'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'participantIds': participantIds, // Chỉ cần ánh xạ participantIds
      'completed': completed,
    };
  }
}
