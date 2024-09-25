class SearchDTO {
  final DateTime? startDate;
  final DateTime? endDate;
  final String? leaveType; // Chuyển thành String
  final String? status;

  SearchDTO({this.startDate, this.endDate, this.leaveType, this.status});

  Map<String, dynamic> toJson() {
    return {
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'leaveType': leaveType,
      'status': status,
    };
  }
}
