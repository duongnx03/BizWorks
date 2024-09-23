import 'package:flutter/material.dart';
import 'package:mobile/models/ViolationDTO.dart';
import 'package:mobile/services/dio_client.dart';
import 'package:dio/dio.dart';

class ViolationProvider with ChangeNotifier {
  final DioClient _dioClient;

  ViolationProvider({required DioClient dioClient}) : _dioClient = dioClient;

  List<ViolationDTO> _violations = [];
  List<ViolationDTO> get violations => _violations;

  int get violationCount => _violations.length;

  int get pendingViolationCount {
    return _violations
        .where((violation) => violation.status == 'pending')
        .length;
  }

  Future<void> fetchViolationsByEmail() async {
    try {
      debugPrint('Fetching violations...');
      final response = await _dioClient.dio.get('/api/violations/user');

      if (response.statusCode == 200) {
        if (response.data is List<dynamic>) {
          List<ViolationDTO> sortedViolations = (response.data as List<dynamic>)
              .map((item) => ViolationDTO.fromJson(item))
              .toList();

          sortedViolations.sort((a, b) => b.id.compareTo(a.id));

          _violations = sortedViolations;
          notifyListeners();
          debugPrint('Violations fetched successfully.');
        } else {
          debugPrint('Unexpected response format: ${response.data}');
          throw Exception('Invalid data format from server');
        }
      } else {
        debugPrint('Error: ${response.statusCode} - ${response.statusMessage}');
        throw Exception(
            'Failed to load violation data: ${response.statusMessage}');
      }
    } on DioError catch (e) {
      debugPrint('DioError: ${e.message}');
      debugPrint('DioError Response Data: ${e.response?.data}');
      throw Exception('Failed to fetch violations: ${e.message}');
    } catch (e) {
      debugPrint('An unexpected error occurred: $e');
      throw Exception('An unexpected error occurred: $e');
    }
  }
}
