import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../services/dio_client.dart';

class AuthProvider with ChangeNotifier {
  final DioClient _dioClient;

  AuthProvider({required DioClient dioClient}) : _dioClient = dioClient;
  bool _isLoading = false;
  String _authMessage = '';

  bool get isLoading => _isLoading;
  String get authMessage => _authMessage;

  Future<void> authenticate(String email, String password) async {
    _isLoading = true;
    _authMessage = '';
    notifyListeners();

    try {
      final response = await _dioClient.dio.post(
        '/api/auth/authenticate',
        data: {
          'email': email,
          'password': password,
        },
      );
     
      
      // Kiểm tra phản hồi từ API
      if (response.statusCode == 200) {
        _authMessage = ''; // Xóa thông báo lỗi nếu thành công
      } else {
        _authMessage = response.data['message'] ?? 'Unknown error';
      }
    } on DioError catch (e) {
      _authMessage = e.response?.data['message'];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
