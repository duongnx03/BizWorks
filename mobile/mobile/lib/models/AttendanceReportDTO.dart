class AttendanceReportDTO {
  final String totalWorkTimeInWeek;
  final String totalWorkTimeInMonth;
  final String totalOvertimeInMonth;

  AttendanceReportDTO({
    required this.totalWorkTimeInWeek,
    required this.totalWorkTimeInMonth,
    required this.totalOvertimeInMonth,
  });

  factory AttendanceReportDTO.fromJson(Map<String, dynamic> json) {
    return AttendanceReportDTO(
      totalWorkTimeInWeek: json['totalWorkTimeInWeek'],
      totalWorkTimeInMonth: json['totalWorkTimeInMonth'],
      totalOvertimeInMonth: json['totalOvertimeInMonth'],
    );
  }
}
