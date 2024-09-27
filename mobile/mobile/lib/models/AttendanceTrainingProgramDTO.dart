class AttendanceTrainingProgramDTO {
  final int id;
  final int trainingProgramId;
  final int employeeId;
  final DateTime attendedAt;
  final DateTime attendanceDate;
  final String status; // Use String for status (PRESENT/ABSENT)

  AttendanceTrainingProgramDTO({
    required this.id,
    required this.trainingProgramId,
    required this.employeeId,
    required this.attendedAt,
    required this.attendanceDate,
    required this.status,
  });

  factory AttendanceTrainingProgramDTO.fromJson(Map<String, dynamic> json) {
    return AttendanceTrainingProgramDTO(
      id: json['id'] as int,
      trainingProgramId: json['trainingProgramId'] as int,
      employeeId: json['employeeId'] as int,
      attendedAt: DateTime.parse(json['attendedAt']),
      attendanceDate: DateTime.parse(json['attendanceDate']),
      status: json['status'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'trainingProgramId': trainingProgramId,
      'employeeId': employeeId,
      'attendedAt': attendedAt.toIso8601String(),
      'attendanceDate': attendanceDate.toIso8601String(),
      'status': status,
    };
  }
}
