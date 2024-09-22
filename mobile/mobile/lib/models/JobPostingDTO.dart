import 'package:mobile/models/DepartmentDTO.dart';
import 'package:mobile/models/PositionDTO.dart';

class JobPostingDTO {
  final int id;
  final String title;
  final String description;
  final DateTime postedDate;
  final DateTime deadline;
  final DepartmentDTO? department;
  final PositionDTO? position;
  final String location;
  final String employmentType;
  final String requirements;
  final double? salaryRangeMin;
  final double? salaryRangeMax;

  JobPostingDTO({
    required this.id,
    required this.title,
    required this.description,
    required this.postedDate,
    required this.deadline,
    this.department,
    this.position,
    required this.location,
    required this.employmentType,
    required this.requirements,
    this.salaryRangeMin,
    this.salaryRangeMax,
  });

  factory JobPostingDTO.fromJson(Map<String, dynamic> json) {
    return JobPostingDTO(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      postedDate: DateTime.parse(json['postedDate']),
      deadline: DateTime.parse(json['deadline']),
      department: json['department'] != null
          ? DepartmentDTO.fromJson(json['department'])
          : null,
      position: json['position'] != null
          ? PositionDTO.fromJson(json['position'])
          : null,
      location: json['location'] as String,
      employmentType: json['employmentType'] as String,
      requirements: json['requirements'] as String,
      salaryRangeMin: json['salaryRangeMin'] != null
          ? (json['salaryRangeMin'] as num).toDouble()
          : null,
      salaryRangeMax: json['salaryRangeMax'] != null
          ? (json['salaryRangeMax'] as num).toDouble()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'postedDate': postedDate.toIso8601String(),
      'deadline': deadline.toIso8601String(),
      'department': department?.toJson(),
      'position': position?.toJson(),
      'location': location,
      'employmentType': employmentType,
      'requirements': requirements,
      'salaryRangeMin': salaryRangeMin,
      'salaryRangeMax': salaryRangeMax,
    };
  }
}
