import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/models/OvertimeNotAttendanceDTO.dart';
import 'package:mobile/models/UserResponseDTO.dart';

class AttendanceComplaintDTO {
  final int id;
  final DateTime? checkInTime;
  final DateTime? breakTimeStart;
  final DateTime? breakTimeEnd;
  final DateTime? checkOutTime;
  final DateTime? attendanceDate;
  final Duration? totalTime;
  final Duration? officeHours;
  final Duration? overtime;
  final String? complaintReason;
  final String? status;
  final int? attendanceId;
  final String? imagePaths;
  final String? description;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final EmployeeResponseDTO? employee;
  final UserResponseDTO? censor;
  final OvertimeNotAttendanceDTO? overTimes;

  AttendanceComplaintDTO({
    required this.id,
    this.checkInTime,
    this.breakTimeStart,
    this.breakTimeEnd,
    this.checkOutTime,
    this.attendanceDate,
    this.totalTime,
    this.officeHours,
    this.overtime,
    this.complaintReason,
    this.status,
    this.attendanceId,
    this.imagePaths,
    this.description,
    this.createdAt,
    this.updatedAt,
    this.employee,
    this.censor,
    this.overTimes,
  });

  // Trường hợp các giá trị có thể là null, không sử dụng null check operator
  factory AttendanceComplaintDTO.fromJson(Map<String, dynamic> json) {
    try {
      return AttendanceComplaintDTO(
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
            ? DateTime.parse(json['attendanceDate'])
            : null,
        totalTime: json['totalTime'] != null
            ? _parseDuration(json['totalTime'])
            : null,
        officeHours: json['officeHours'] != null
            ? _parseDuration(json['officeHours'])
            : null,
        overtime:
            json['overtime'] != null ? _parseDuration(json['overtime']) : null,
        complaintReason: json['complaintReason'] as String?,
        status: json['status'] as String?,
        attendanceId: json['attendanceId'] as int?,
        imagePaths: json['imagePaths'] as String?,
        description: json['description'] as String?,
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'])
            : null,
        updatedAt: json['updatedAt'] != null
            ? DateTime.parse(json['updatedAt'])
            : null,
        employee: json['employee'] != null
            ? EmployeeResponseDTO.fromJson(json['employee'])
            : null,
        censor: json['censor'] != null
            ? UserResponseDTO.fromJson(json['censor'])
            : null,
        overTimes: json['overTimes'] != null
            ? OvertimeNotAttendanceDTO.fromJson(json['overTimes'])
            : null,
      );
    } catch (e) {
      print('Error parsing AttendanceComplaintDTO: $e');
      rethrow; // Re-throw exception if needed
    }
  }

  static Duration? _parseDurationString(dynamic duration) {
    if (duration is String) {
      try {
        final parts = duration.split(':');
        if (parts.length == 3) {
          final hours = int.parse(parts[0]);
          final minutes = int.parse(parts[1]);
          final seconds = int.parse(parts[2]);
          return Duration(hours: hours, minutes: minutes, seconds: seconds);
        }
      } catch (e) {
        print('Error parsing duration string: $e');
      }
    }
    return null;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
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
      'complaintReason': complaintReason,
      'status': status,
      'attendanceId': attendanceId,
      'imagePaths': imagePaths,
      'description': description,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'employee': employee?.toJson(),
      'overTimes': overTimes?.toJson(),
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
