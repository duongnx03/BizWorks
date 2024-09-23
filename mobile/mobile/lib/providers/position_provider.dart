import 'package:flutter/material.dart';
import 'package:mobile/models/PositionDTO.dart';
import 'package:mobile/services/dio_client.dart';

class PositionProvider with ChangeNotifier {
  final DioClient _dioClient;

  PositionProvider({required DioClient dioClient}) : _dioClient = dioClient;

  List<PositionDTO>? _positions;
  List<PositionDTO>? get positions => _positions;

  Future<void> fetchPositions() async {
    try {
      final response = await _dioClient.dio.get('/api/positions');
      if (response.statusCode == 200) {
        _positions = (response.data as List)
            .map((pos) => PositionDTO.fromJson(pos))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load positions');
      }
    } catch (e) {
      print('Error fetching positions: $e');
    }
  }

  // Thêm các phương thức tạo, cập nhật, xóa position
}
