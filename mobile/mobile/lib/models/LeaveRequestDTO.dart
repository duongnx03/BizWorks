import 'package:mobile/models/LeaveType.dart';

class LeaveRequestDTO {
  final int id;
  late final DateTime startDate;
  late final DateTime endDate;
  late final LeaveType leaveType;
  late final DateTime createdAt;
  late final String reason;
  late final String status;
  final String employeeName;
  final int employeeId;

  LeaveRequestDTO({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.leaveType,
    required this.createdAt, // Sửa từ CreateAt thành createdAt
    required this.reason,
    required this.status,
    required this.employeeName,
    required this.employeeId,
  });

  factory LeaveRequestDTO.fromJson(Map<String, dynamic> json) {
    return LeaveRequestDTO(
      id: json['id'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      leaveType: LeaveType.values.firstWhere((e) => e.toString() == 'LeaveType.${json['leaveType']}'),
      createdAt: DateTime.parse(json['createdAt']), // Sửa từ createAt thành createdAt
      reason: json['reason'],
      status: json['status'],
      employeeName: json['employeeName'],
      employeeId: json['employeeId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'leaveType': leaveType.toString().split('.').last,
      'createdAt': createdAt.toIso8601String(), // Sửa từ createAt thành createdAt
      'reason': reason,
      'status': status,
      'employeeName': employeeName,
      'employeeId': employeeId,
    };
  }
}
