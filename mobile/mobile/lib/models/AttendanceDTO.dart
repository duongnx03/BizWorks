import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/models/OvertimeResponseDTO.dart';

class AttendanceDTO {
  final int id;
  final DateTime? checkInTime;
  final DateTime? breakTimeStart;
  final DateTime? breakTimeEnd;
  final DateTime? checkOutTime;
  final DateTime? attendanceDate;
  final Duration? totalTime;
  final Duration? officeHours;
  final Duration? overtime;
  final String? status;
  final EmployeeResponseDTO? employee;
  final OvertimeResponseDTO? overtimeDTO;
  final int? attendanceComplaintId;

  AttendanceDTO({
    required this.id,
    this.checkInTime,
    this.breakTimeStart,
    this.breakTimeEnd,
    this.checkOutTime,
    this.attendanceDate,
    this.totalTime,
    this.officeHours,
    this.overtime,
    this.status,
    this.employee,
    this.overtimeDTO,
    this.attendanceComplaintId,
  });

  factory AttendanceDTO.fromJson(Map<String, dynamic> json) {
    return AttendanceDTO(
      id: json['id'] as int,
      checkInTime: json['checkInTime'] != null
          ? DateTime.parse(json['checkInTime'])
          : null,
      breakTimeStart: json['breakTimeStart'] != null
          ? DateTime.parse(json['breakTimeStart'])
          : null,
      breakTimeEnd: json['breakTimeEnd'] != null
          ? DateTime.parse(json['breakTimeEnd'])
          : null,
      checkOutTime: json['checkOutTime'] != null
          ? DateTime.parse(json['checkOutTime'])
          : null,
      attendanceDate: json['attendanceDate'] != null
          ? DateTime.parse(json['attendanceDate']).toLocal()
          : null,
      totalTime:
          json['totalTime'] != null ? _parseDuration(json['totalTime']) : null,
      officeHours: json['officeHours'] != null
          ? _parseDuration(json['officeHours'])
          : null,
      overtime:
          json['overtime'] != null ? _parseDuration(json['overtime']) : null,
      status: json['status'],
      employee: json['employee'] != null
          ? EmployeeResponseDTO.fromJson(json['employee'])
          : null,
      overtimeDTO: json['overtimeDTO'] != null
          ? OvertimeResponseDTO.fromJson(json['overtimeDTO'])
          : null,
      attendanceComplaintId: json['attendanceComplaintId'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id as int,
      'checkInTime': checkInTime?.toIso8601String(),
      'breakTimeStart': breakTimeStart?.toIso8601String(),
      'breakTimeEnd': breakTimeEnd?.toIso8601String(),
      'checkOutTime': checkOutTime?.toIso8601String(),
      'attendanceDate': attendanceDate?.toIso8601String(),
      'totalTime': totalTime != null
          ? {
              'hours': totalTime!.inHours,
              'minutes': totalTime!.inMinutes % 60,
            }
          : null,
      'officeHours': officeHours != null
          ? {
              'hours': officeHours!.inHours,
              'minutes': officeHours!.inMinutes % 60,
            }
          : null,
      'overtime': overtime != null
          ? {
              'hours': overtime!.inHours,
              'minutes': overtime!.inMinutes % 60,
            }
          : null,
      'status': status,
      'employee': employee?.toJson(),
      'overtimeDTO': overtimeDTO?.toJson(),
      'attendanceComplaintId': attendanceComplaintId,
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
