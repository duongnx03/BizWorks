import 'package:flutter/material.dart';
import 'package:mobile/models/ViolationComplaintDTO.dart';
import 'package:mobile/services/dio_client.dart';
import 'package:dio/dio.dart';

class ViolationComplaintProvider with ChangeNotifier {
  final DioClient _dioClient;

  ViolationComplaintProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<ViolationComplaintDTO> _complaints = [];
  List<ViolationComplaintDTO> get complaints => _complaints;

  Future<void> fetchComplaints() async {
    try {
      debugPrint('Fetching violation complaints...');
      final response = await _dioClient.dio.get('/api/violation-complaints');

      if (response.statusCode == 200) {
        if (response.data is List<dynamic>) {
          _complaints = (response.data as List<dynamic>)
              .map((item) => ViolationComplaintDTO.fromJson(item))
              .toList();

          notifyListeners();
          debugPrint('Violation complaints fetched successfully.');
        } else {
          debugPrint('Unexpected response format: ${response.data}');
          throw Exception('Invalid data format from server');
        }
      } else {
        debugPrint('Error: ${response.statusCode} - ${response.statusMessage}');
        throw Exception(
            'Failed to load violation complaints: ${response.statusMessage}');
      }
    } on DioError catch (e) {
      debugPrint('DioError: ${e.message}');
      debugPrint('DioError Response Data: ${e.response?.data}');
      throw Exception('Failed to fetch violation complaints: ${e.message}');
    } catch (e) {
      debugPrint('An unexpected error occurred: $e');
      throw Exception('An unexpected error occurred: $e');
    }
  }

  Future<void> createComplaint(ViolationComplaintDTO complaint) async {
    try {
      debugPrint('Creating violation complaint...');
      final response = await _dioClient.dio
          .post('/api/violation-complaints', data: complaint.toJson());

      if (response.statusCode == 200) {
        debugPrint('Violation complaint created successfully.');
        _complaints.add(ViolationComplaintDTO.fromJson(response.data));
        notifyListeners();
      } else {
        debugPrint('Error: ${response.statusCode} - ${response.statusMessage}');
        throw Exception(
            'Failed to create violation complaint: ${response.statusMessage}');
      }
    } on DioError catch (e) {
      debugPrint('DioError: ${e.message}');
      debugPrint('DioError Response Data: ${e.response?.data}');
      throw Exception('Failed to create violation complaint: ${e.message}');
    } catch (e) {
      debugPrint('An unexpected error occurred: $e');
      throw Exception('An unexpected error occurred: $e');
    }
  }
}
