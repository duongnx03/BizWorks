import 'package:mobile/models/UserResponseDTO.dart';

class OvertimeNotAttendanceDTO {
  final int? id;
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
  final UserResponseDTO? censor;

  OvertimeNotAttendanceDTO({
    this.id,
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
    this.censor,
  });

  factory OvertimeNotAttendanceDTO.fromJson(Map<String, dynamic> json) {
    return OvertimeNotAttendanceDTO(
      id: json['id'] as int?,
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
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      censor: json['censor'] != null
          ? UserResponseDTO.fromJson(json['censor'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'overtimeStart': overtimeStart != null
          ? _formatDuration(overtimeStart!)
          : null,
      'overtimeEnd': overtimeEnd != null
          ? _formatDuration(overtimeEnd!)
          : null,
      'totalTime': totalTime != null
          ? _formatDuration(totalTime!)
          : null,
      'checkOutTime': checkOutTime?.toIso8601String(),
      'type': type,
      'status': status,
      'reason': reason,
      'description': description,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'censor': censor?.toJson(),
    };
  }

  static Duration _parseDuration(Map<String, dynamic> timeMap) {
    int hours = timeMap['hours'] as int;
    int minutes = timeMap['minutes'] as int;
    return Duration(hours: hours, minutes: minutes);
  }

  static Map<String, dynamic> _formatDuration(Duration duration) {
    return {
      'hours': duration.inHours,
      'minutes': duration.inMinutes % 60,
    };
  }
}
