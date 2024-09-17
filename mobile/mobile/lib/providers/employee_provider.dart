// providers/employee_provider.dart
import 'package:flutter/material.dart';
import 'package:mobile/models/EmployeeResponseDTO.dart';
import 'package:mobile/services/dio_client.dart';

class EmployeeProvider with ChangeNotifier {
  final DioClient _dioClient;

  EmployeeProvider({required DioClient dioClient}) : _dioClient = dioClient;
  EmployeeResponseDTO? _employee;
  EmployeeResponseDTO? get employee => _employee;

  Future<void> fetchEmployeeData() async {
    try {
      final response = await _dioClient.dio.get('/api/employee/getEmployee');

      if (response.statusCode == 200) {
        _employee = EmployeeResponseDTO.fromJson(response.data['data']);
        notifyListeners();
      } else {
        throw Exception('Failed to load employee data');
      }
    } catch (e) {
      print('Error fetching employee data: $e');
    }
  }
}
