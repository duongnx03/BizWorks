import 'package:mobile/models/UserResponseDTO.dart';

class OvertimeResponseDTO {
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

  OvertimeResponseDTO({
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

  factory OvertimeResponseDTO.fromJson(Map<String, dynamic> json) {
    return OvertimeResponseDTO(
      id: json['id'] as int,
      overtimeStart: json['overtimeStart'] != null
          ? _parseDuration((json['overtimeStart']))
          : null,
      overtimeEnd: json['overtimeEnd'] != null
          ? _parseDuration((json['overtimeEnd']))
          : null,
      totalTime: json['totalTime'] != null
          ? _parseDuration((json['totalTime']))
          : null,
      checkOutTime: json['checkOutTime'] != null
          ? DateTime.parse(json['checkOutTime'])
          : null,
      type: json['type'],
      status: json['status'],
      reason: json['reason'],
      description: json['description'],
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt:
          json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
      censor: json['censor'] != null
          ? UserResponseDTO.fromJson(json['censor'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id as int,
      'overtimeStart': overtimeStart != null
          ? {
              'hours': overtimeStart!.inHours,
              'minutes': overtimeStart!.inMinutes % 60,
            }
          : null,
      'overtimeEnd': overtimeEnd != null
          ? {
              'hours': overtimeEnd!.inHours,
              'minutes': overtimeEnd!.inMinutes % 60,
            }
          : null,
      'totalTime': totalTime != null
          ? {
              'hours': totalTime!.inHours,
              'minutes': totalTime!.inMinutes % 60,
            }
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

  static Duration _parseDuration(String timeString) {
    List<String> parts = timeString.split(':');
    int hours = int.parse(parts[0]);
    int minutes = int.parse(parts[1]);
    int seconds = int.parse(parts[2]);
    return Duration(hours: hours, minutes: minutes, seconds: seconds);
  }
}
