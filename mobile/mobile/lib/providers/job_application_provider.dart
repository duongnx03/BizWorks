import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/JobApplicationDTO.dart'; // Giả sử bạn đã có mô hình JobApplicationDTO
import 'package:mobile/services/dio_client.dart';

class JobApplicationProvider with ChangeNotifier {
  final DioClient _dioClient;

  JobApplicationProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<JobApplicationDTO>? _jobApplications;
  List<JobApplicationDTO>? get jobApplications => _jobApplications;

  Future<void> fetchJobApplications() async {
    try {
      final response = await _dioClient.dio.get('/api/job-applications/all');
      if (response.statusCode == 200) {
        _jobApplications = (response.data['data'] as List)
            .map((app) => JobApplicationDTO.fromJson(app))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load job applications');
      }
    } catch (e) {
      print('Error fetching job applications: $e');
    }
  }

  Future<void> submitJobApplication({
    required String applicantName,
    required String applicantEmail,
    required String applicantPhone,
    required String resumeUrl, // Đây là URL của hồ sơ đã được tải lên
    required int jobPostingId,
  }) async {
    try {
      final formData = {
        'applicantName': applicantName,
        'applicantEmail': applicantEmail,
        'applicantPhone': applicantPhone,
        'resume': await MultipartFile.fromFile(resumeUrl), // Tải lên hồ sơ
        'jobPostingId': jobPostingId,
      };

      final response = await _dioClient.dio
          .post('/api/job-applications/submit', data: formData);
      if (response.statusCode == 201) {
        print('Job application submitted successfully');
      } else {
        throw Exception('Failed to submit job application');
      }
    } catch (e) {
      print('Error submitting job application: $e');
    }
  }

  Future<void> updateApplicationStatus({
    required int applicationId,
    required String newStatus,
    String? reason,
  }) async {
    try {
      final response = await _dioClient.dio.patch(
        '/api/job-applications/update-status/$applicationId',
        data: {
          'newStatus': newStatus,
          'reason': reason,
        },
      );
      if (response.statusCode == 200) {
        print('Application status updated successfully');
      } else {
        throw Exception('Failed to update application status');
      }
    } catch (e) {
      print('Error updating application status: $e');
    }
  }

  // Thêm các phương thức khác nếu cần
}
