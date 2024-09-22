import 'package:flutter/material.dart';
import 'package:mobile/models/DepartmentDTO.dart';
import 'package:mobile/services/dio_client.dart';

class DepartmentProvider with ChangeNotifier {
  final DioClient _dioClient;

  DepartmentProvider({required DioClient dioClient}) : _dioClient = dioClient;

  List<DepartmentDTO>? _departments;
  List<DepartmentDTO>? get departments => _departments;

  Future<void> fetchDepartments() async {
    try {
      final response = await _dioClient.dio.get('/api/departments');
      if (response.statusCode == 200) {
        _departments = (response.data as List)
            .map((dept) => DepartmentDTO.fromJson(dept))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load departments');
      }
    } catch (e) {
      print('Error fetching departments: $e');
    }
  }

  // Thêm các phương thức tạo, cập nhật, xóa department
}
