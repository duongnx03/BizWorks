import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/JobApplicationDTO.dart';
import 'package:mobile/services/dio_client.dart';

class JobApplicationProvider with ChangeNotifier {
  final DioClient _dioClient;

  JobApplicationProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<JobApplicationDTO>? _jobApplications;
  List<JobApplicationDTO>? get jobApplications => _jobApplications;

  // Fetch all job applications
  Future<void> fetchJobApplications() async {
    try {
      final response = await _dioClient.dio.get('/api/job-applications/all');
      if (response.statusCode == 200) {
        _jobApplications = (response.data['data'] as List)
            .map((jobApp) => JobApplicationDTO.fromJson(jobApp))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load job applications');
      }
    } catch (e) {
      print('Error fetching job applications: $e');
    }
  }

  // Fetch job applications by job posting ID
  Future<void> fetchApplicationsByJobPostingId(int jobPostingId) async {
    try {
      final response = await _dioClient.dio
          .get('/api/job-applications/by-job-posting/$jobPostingId');
      if (response.statusCode == 200) {
        _jobApplications = (response.data['data'] as List)
            .map((jobApp) => JobApplicationDTO.fromJson(jobApp))
            .toList();
        notifyListeners();
      } else {
        throw Exception(
            'Failed to load job applications for the specified job posting');
      }
    } catch (e) {
      print('Error fetching job applications by job posting: $e');
    }
  }

  // Update job application status
  Future<void> updateApplicationStatus(int applicationId, String newStatus,
      {String? reason}) async {
    try {
      final response = await _dioClient.dio.patch(
        '/api/job-applications/update-status/$applicationId',
        data: {
          'newStatus': newStatus,
          if (reason != null) 'reason': reason,
        },
      );
      if (response.statusCode == 200) {
        notifyListeners();
      } else {
        throw Exception('Failed to update job application status');
      }
    } catch (e) {
      print('Error updating job application status: $e');
    }
  }

  Future<void> submitJobApplication(String applicantName, String applicantEmail,
      String applicantPhone, String resumePath, int jobPostingId) async {
    try {
      FormData formData = FormData.fromMap({
        'applicantName': applicantName,
        'applicantEmail': applicantEmail,
        'applicantPhone': applicantPhone,
        'resume': await MultipartFile.fromFile(resumePath), // Gửi file hồ sơ
        'jobPostingId': jobPostingId,
      });

      final response = await _dioClient.dio.post(
        '/api/job-applications/submit',
        data: formData,
      );

      if (response.statusCode == 201) {
        notifyListeners();
      } else {
        throw Exception('Failed to submit job application');
      }
    } catch (e) {
      print('Error submitting job application: $e');
    }
  }
}
