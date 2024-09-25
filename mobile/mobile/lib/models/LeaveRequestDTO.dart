import 'package:mobile/models/LeaveType.dart';

class LeaveRequestDTO {
  final int id;
  late final DateTime startDate;
  late final DateTime endDate;
  late final LeaveType leaveType;
  late final String reason;
  late final String status;
  final String employeeName;
  final int employeeId;

  LeaveRequestDTO({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.leaveType,
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
      'reason': reason,
      'status': status,
      'employeeName': employeeName,
      'employeeId': employeeId,
    };
  }
}
