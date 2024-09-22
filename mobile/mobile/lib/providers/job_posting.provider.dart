import 'package:flutter/material.dart';
import 'package:mobile/models/JobPostingDTO.dart';
import 'package:mobile/services/dio_client.dart';

class JobPostingProvider with ChangeNotifier {
  final DioClient _dioClient;

  JobPostingProvider({required DioClient dioClient}) : _dioClient = dioClient;

  List<JobPostingDTO>? _jobPostings;
  List<JobPostingDTO>? get jobPostings => _jobPostings;

  Future<void> fetchJobPostings() async {
    try {
      final response = await _dioClient.dio.get('/api/job-postings/list');
      if (response.statusCode == 200) {
        _jobPostings = (response.data['data'] as List)
            .map((job) => JobPostingDTO.fromJson(job))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load job postings');
      }
    } catch (e) {
      print('Error fetching job postings: $e');
    }
  }

  // Thêm các phương thức tạo, cập nhật, xóa job posting
}
