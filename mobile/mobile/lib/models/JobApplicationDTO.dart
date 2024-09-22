import 'package:mobile/models/JobPostingDTO.dart';

class JobApplicationDTO {
  final int id;
  final JobPostingDTO jobPosting; // Đối tượng JobPosting
  final String applicantName;
  final String applicantEmail;
  final String applicantPhone;
  final String resumeUrl;
  final DateTime applicationDate; // Thay LocalDate bằng DateTime
  final String status;
  final String? rejectionReason; // Có thể là null

  JobApplicationDTO({
    required this.id,
    required this.jobPosting,
    required this.applicantName,
    required this.applicantEmail,
    required this.applicantPhone,
    required this.resumeUrl,
    required this.applicationDate,
    required this.status,
    this.rejectionReason,
  });

  factory JobApplicationDTO.fromJson(Map<String, dynamic> json) {
    return JobApplicationDTO(
      id: json['id'] as int,
      jobPosting:
          JobPostingDTO.fromJson(json['jobPosting']), // Chuyển đổi từ JSON
      applicantName: json['applicantName'] as String,
      applicantEmail: json['applicantEmail'] as String,
      applicantPhone: json['applicantPhone'] as String,
      resumeUrl: json['resumeUrl'] as String,
      applicationDate:
          DateTime.parse(json['applicationDate']), // Chuyển đổi thành DateTime
      status: json['status'] as String,
      rejectionReason: json['rejectionReason'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'jobPosting': jobPosting.toJson(), // Chuyển đổi thành JSON
      'applicantName': applicantName,
      'applicantEmail': applicantEmail,
      'applicantPhone': applicantPhone,
      'resumeUrl': resumeUrl,
      'applicationDate':
          applicationDate.toIso8601String(), // Chuyển đổi thành chuỗi ISO
      'status': status,
      'rejectionReason': rejectionReason,
    };
  }
}
