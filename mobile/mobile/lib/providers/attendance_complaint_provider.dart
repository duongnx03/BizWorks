import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/AttendanceComplaintDTO.dart';
import 'package:path/path.dart';
import 'package:mobile/services/dio_client.dart';

class AttendanceComplaintProvider with ChangeNotifier {
  final DioClient _dioClient;
  List<AttendanceComplaintDTO> _complaints = [];

  AttendanceComplaintProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<AttendanceComplaintDTO> get complaints => _complaints;

  Future<void> submitComplaint({
    required DateTime checkInTime,
    required DateTime breakTimeStart,
    required DateTime breakTimeEnd,
    required DateTime checkOutTime,
    required Duration totalTime,
    required Duration officeHours,
    required Duration overtime,
    required DateTime attendanceDate,
    required String complaintReason,
    required List<File> images, // Danh sách các tệp hình ảnh đã chọn
    required int attendanceId,
  }) async {
    try {
      // Chuẩn bị form-data
      FormData formData = FormData.fromMap({
        'checkInTime': checkInTime.toIso8601String(),
        'breakTimeStart': breakTimeStart.toIso8601String(),
        'breakTimeEnd': breakTimeEnd.toIso8601String(),
        'checkOutTime': checkOutTime.toIso8601String(),
        'totalTime': formatDuration(totalTime),
        'officeHours': formatDuration(officeHours),
        'overtime': formatDuration(overtime),
        'attendanceDate': DateFormat('yyyy-MM-dd').format(attendanceDate),
        'complaintReason': complaintReason,
        'attendanceId': attendanceId.toString(),
      });

      // Thêm danh sách hình ảnh vào form-data
      for (var i = 0; i < images.length; i++) {
        String fileName = basename(images[i].path);
        formData.files.add(
          MapEntry(
            'file$i', // Tên trường của file, có thể thay đổi theo backend
            await MultipartFile.fromFile(
              images[i].path,
              filename: fileName,
              contentType:
                  DioMediaType('image', 'jpeg'), // Định dạng nội dung tệp
            ),
          ),
        );
      }

      // Gửi request tới server bằng Dio
      Response response = await _dioClient.dio.post(
        'api/complaint/submit', // Đường dẫn API
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        ),
      );

      // Kiểm tra phản hồi
      if (response.statusCode == 201) {
        print("Complaint registered successfully: ${response.data}");
      } else {
        print("Error: ${response.data['message']}");
      }
    } catch (e) {
      // Xử lý ngoại lệ
      print("Error: $e");
    }
  }

  // Helper method to format duration to 'HH:mm'
  String formatDuration(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}';
  }

  Future<void> fetchComplaintByEmail() async {
    try {
      final response = await _dioClient.dio.get('/api/complaint/getByEmail');
      if (response.statusCode == 200) {
        final data = response.data['data'];
        _complaints = (data as List<dynamic>)
            .map((item) => AttendanceComplaintDTO.fromJson(item))
            .toList();
        notifyListeners(); // Thông báo UI cập nhật dữ liệu
      } else {
        throw Exception('Failed to load attendance data');
      }
    } on DioError catch (e) {
      print('DioError: ${e.message}');
      print('DioError Response Data: ${e.response?.data}');
    } catch (e) {
      print('An unexpected error occurred: $e');
    }
  }
}
