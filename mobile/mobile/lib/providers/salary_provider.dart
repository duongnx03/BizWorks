import 'package:flutter/material.dart';
import 'package:mobile/models/SalaryDTO.dart';
import 'package:mobile/services/dio_client.dart';
import 'package:dio/dio.dart';

class SalaryProvider with ChangeNotifier {
  final DioClient _dioClient;

  SalaryProvider({required DioClient dioClient}) : _dioClient = dioClient;

  List<SalaryDTO> _salaries = [];
  List<SalaryDTO> get salaries => _salaries;
  bool _hasSalaries = true;

  Future<void> fetchSalariesByEmail() async {
    try {
      final response = await _dioClient.dio.get('/api/salaries/user');

      if (response.statusCode == 200) {
        // Lấy dữ liệu từ trường 'data' trong phản hồi
        if (response.data['data'] is List<dynamic>) {
          List<SalaryDTO> sortedSalaries =
              (response.data['data'] as List<dynamic>)
                  .map((item) => SalaryDTO.fromJson(item))
                  .toList();

          sortedSalaries.sort((a, b) => b.id.compareTo(a.id));

          _salaries = sortedSalaries;
        } else {
          print('Unexpected response format: ${response.data}');
          throw Exception('Invalid data format from server');
        }
      } else if (response.statusCode == 404) {
        _salaries = [];
      } else {
        print('Error: ${response.statusCode} - ${response.statusMessage}');
        throw Exception('Failed to load salary data');
      }

      notifyListeners();
    } on DioError catch (e) {
      if (e.response?.statusCode == 404) {
        _salaries = [];
        notifyListeners();
      } else {
        print('DioError: ${e.message}');
        print('DioError Response Data: ${e.response?.data}');
        throw Exception('Failed to fetch salaries: ${e.message}');
      }
    } catch (e) {
      print('An unexpected error occurred: $e');
      throw Exception('An unexpected error occurred: $e');
    }
  }
}
