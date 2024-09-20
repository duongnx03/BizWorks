import 'package:mobile/models/AttendanceDTO.dart';
import 'package:mobile/models/UserResponseDTO.dart';

class OvertimeDTO {
  final int id;
  final Duration? overtimeStart;
  final Duration? overtimeEnd;
  final Duration? totalTime;
  final DateTime? checkOutTime;
  final String? type;
  final String? status;
  final String? reason;
  final String? description;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final AttendanceDTO? attendanceDTO;
  final UserResponseDTO? censor;

  OvertimeDTO({
    required this.id,
    this.overtimeStart,
    this.overtimeEnd,
    this.totalTime,
    this.checkOutTime,
    this.type,
    this.status,
    this.reason,
    this.description,
    this.createdAt,
    this.updatedAt,
    this.attendanceDTO,
    this.censor
  });

  factory OvertimeDTO.fromJson(Map<String, dynamic> json) {
    return OvertimeDTO(
      id: json['id'] as int,
      overtimeStart: json['overtimeStart'] != null
          ? _parseDuration(json['overtimeStart'])
          : null,
      overtimeEnd: json['overtimeEnd'] != null
          ? _parseDuration(json['overtimeEnd'])
          : null,
      totalTime: json['totalTime'] != null
          ? _parseDuration(json['totalTime'])
          : null,
      checkOutTime: json['checkOutTime'] != null
          ? DateTime.parse(json['checkOutTime'])
          : null,
      type: json['type'] as String?,
      status: json['status'] as String?,
      reason: json['reason'] as String?,
      description: json['description'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      attendanceDTO: json['attendanceDTO'] != null
          ? AttendanceDTO.fromJson(json['attendanceDTO'])
          : null,
      censor: json['censor'] != null
          ? UserResponseDTO.fromJson(json['censor'])
          : null,
    );
  }

  static Duration _parseDuration(String timeString) {
    List<String> parts = timeString.split(':');
    int hours = int.parse(parts[0]);
    int minutes = int.parse(parts[1]);
    int seconds = int.parse(parts[2]);
    return Duration(hours: hours, minutes: minutes, seconds: seconds);
  }
}
