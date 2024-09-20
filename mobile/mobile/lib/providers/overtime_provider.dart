import 'package:flutter/material.dart';
import 'package:mobile/models/OvertimeDTO.dart';
import 'package:mobile/services/dio_client.dart';
import 'package:dio/dio.dart';

class OvertimeProvider with ChangeNotifier {
  final DioClient _dioClient;

  OvertimeProvider({required DioClient dioClient}) : _dioClient = dioClient;

  List<OvertimeDTO> _overtimeDTO = [];
  List<OvertimeDTO> get overtimeDTO => _overtimeDTO;

  Future<bool> createOvertime(
      String type, String reason, int attendanceId) async {
    const url =
        '/api/overtime/create'; // Đường dẫn API của bạn, điều chỉnh nếu cần
    final overtimeRequest = {
      'type': type,
      'reason': reason,
      'attendanceId': attendanceId,
    };

    try {
      Response response = await _dioClient.dio.post(url, data: overtimeRequest);
      if (response.statusCode == 201) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print("Error: $e");
      return false;
    }
  }

  Future<void> fetchOvertimeByEmail() async {
    try {
      final response = await _dioClient.dio.get('/api/overtime/getByEmail');

      if (response.statusCode == 200) {
        final data = response.data['data'];
        List<OvertimeDTO> sortedOvertimes = (data as List<dynamic>)
            .map((item) => OvertimeDTO.fromJson(item))
            .toList();

        // Sắp xếp danh sách theo ID (có thể thay đổi theo yêu cầu của bạn)
        sortedOvertimes.sort((a, b) => b.id.compareTo(a.id));

        _overtimeDTO = sortedOvertimes;

        notifyListeners(); // Thông báo UI cập nhật dữ liệu
      } else {
        throw Exception('Failed to load overtime data');
      }
    } on DioError catch (e) {
      print('DioError: ${e.message}');
      print('DioError Response Data: ${e.response?.data}');
    } catch (e) {
      print('An unexpected error occurred: $e');
    }
  }
}
