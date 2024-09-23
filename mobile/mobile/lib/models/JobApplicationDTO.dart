import 'package:mobile/models/UserDTO.dart';
import 'package:mobile/models/JobPostingDTO.dart';

class JobApplicationDTO {
  final int id;
  final JobPostingDTO? jobPosting;
  final String applicantName;
  final String applicantEmail;
  final String applicantPhone;
  final String resumeUrl;
  final DateTime applicationDate;
  final String status;
  final String? rejectionReason;
  final UserDTO? user;

  JobApplicationDTO({
    required this.id,
    this.jobPosting,
    required this.applicantName,
    required this.applicantEmail,
    required this.applicantPhone,
    required this.resumeUrl,
    required this.applicationDate,
    required this.status,
    this.rejectionReason,
    this.user,
  });

  factory JobApplicationDTO.fromJson(Map<String, dynamic> json) {
    return JobApplicationDTO(
      id: json['id'] as int,
      jobPosting: json['jobPosting'] != null
          ? JobPostingDTO.fromJson(json['jobPosting'])
          : null,
      applicantName: json['applicantName'] as String,
      applicantEmail: json['applicantEmail'] as String,
      applicantPhone: json['applicantPhone'] as String,
      resumeUrl: json['resumeUrl'] as String,
      applicationDate: DateTime.parse(json['applicationDate']),
      status: json['status'] as String,
      rejectionReason: json['rejectionReason'] as String?,
      user: json['user'] != null ? UserDTO.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'jobPosting': jobPosting?.toJson(),
      'applicantName': applicantName,
      'applicantEmail': applicantEmail,
      'applicantPhone': applicantPhone,
      'resumeUrl': resumeUrl,
      'applicationDate': applicationDate.toIso8601String(),
      'status': status,
      'rejectionReason': rejectionReason,
      'user': user?.toJson(),
    };
  }
}
