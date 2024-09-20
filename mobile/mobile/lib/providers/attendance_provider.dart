import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:dio/dio.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:mobile/models/AttendanceReportDTO.dart';
import 'package:mobile/services/dio_client.dart';

class AttendanceProvider with ChangeNotifier {
  final DioClient _dioClient;
  List<CameraDescription>? _cameras;
  CameraController? _controller;
  bool _isCameraReady = false;
  String _errorMessage = '';
  String _successMessage = '';

  AttendanceProvider({required DioClient dioClient}) : _dioClient = dioClient;

  AttendanceReportDTO? _report;
  AttendanceReportDTO? get report => _report;
  AttendanceDTO? _attendanceToday;
  AttendanceDTO? get attendanceToday => _attendanceToday;
  DateTime? _checkInTime;
  DateTime? get checkInTime => _checkInTime;
  DateTime? _checkOutTime;
  DateTime? get checkOutTime => _checkOutTime;
  String get errorMessage => _errorMessage;
  String get successMessage => _successMessage;
  List<AttendanceDTO> _attendanceList = [];
  List<AttendanceDTO> get attendanceList => _attendanceList;
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Future<void> fetchAttendancesForMonth(int month, int year) async {
    try {
      final response = await _dioClient.dio
          .get('/api/attendance/getForMonth', queryParameters: {
        'month': month,
        'year': year,
      });
      print(response);

      if (response.statusCode == 200) {
        final data = response.data['data'];
        List<AttendanceDTO> sortedList = (data as List<dynamic>)
            .map((item) => AttendanceDTO.fromJson(item))
            .toList();

        // Sắp xếp danh sách theo ID (có thể thay đổi theo yêu cầu của bạn)
        sortedList.sort((a, b) => b.id.compareTo(a.id));

        _attendanceList = sortedList;
        notifyListeners(); // Thông báo UI cập nhật dữ liệu
      } else {
        throw Exception('Failed to load attendances for month');
      }
    } on DioError catch (e) {
      print(e.response?.data['message']);
    }
  }

  Future<void> fetchAttendanceById(int id) async {
    try {
      final response = await _dioClient.dio.get('/api/attendance/getById/$id');

      if (response.statusCode == 200) {
        final data = response.data['data'];
        _attendanceToday = AttendanceDTO.fromJson(data);
        notifyListeners();
      } else {
        throw Exception('Failed to load attendance record');
      }
    } on DioError catch (e) {
      _errorMessage = e.response?.data['message'] ?? 'An error occurred';
      notifyListeners();
    }
  }

  Future<void> fetchTotalWorkAndOvertime() async {
    try {
      final response =
          await _dioClient.dio.get('/api/attendance/totalWorkAndOvertime');

      if (response.statusCode == 200) {
        final data = response.data['data'];
        _report = AttendanceReportDTO.fromJson(data);
        notifyListeners();
      } else {
        throw Exception('Failed to load total work and overtime');
      }
    } catch (e) {
      print('Error fetching total work and overtime: $e');
    }
  }

  Future<void> fetchAttendanceByEmailAndDate() async {
    try {
      final response =
          await _dioClient.dio.get('/api/attendance/getByEmailAndDate');

      if (response.statusCode == 200) {
        final data = response.data['data'];
        _attendanceToday = AttendanceDTO.fromJson(data);
        _checkInTime = _attendanceToday!.checkInTime;
        _checkOutTime = _attendanceToday!.checkOutTime;
        notifyListeners(); // Thông báo UI cập nhật dữ liệu
      } else {
        throw Exception('Failed to load attendance data');
      }
    } on DioError catch (e) {
      print(e.response?.data['message']);
    }
  }

  bool hasCheckedInToday() {
    if (_checkInTime == null) return false;
    return _checkInTime != null;
  }

  bool hasCheckedOutToday() {
    if (_checkOutTime == null) return false;
    return _checkOutTime != null;
  }

  Future<void> _initializeCamera() async {
    if (_controller != null && _controller!.value.isInitialized) {
      return;
    }

    // Lấy danh sách các camera khả dụng
    _cameras = await availableCameras();

    // Tìm camera trước
    final frontCamera = _cameras?.firstWhere(
      (camera) => camera.lensDirection == CameraLensDirection.front,
      orElse: () => _cameras!.first,
    );

    if (frontCamera != null) {
      _controller = CameraController(
        frontCamera,
        ResolutionPreset.high,
      );

      // Khởi tạo camera
      await _controller?.initialize();
      _isCameraReady = true;
    }
  }

  Future<void> _showCameraDialog(BuildContext context, String action) async {
    await _initializeCamera();

    if (!_isCameraReady) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Container(
                width: 350,
                height: 500,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CameraPreview(_controller!),
                    Center(
                      child: ClipOval(
                        child: Container(
                          width: 250,
                          height: 250,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 4),
                          ),
                          child: Center(
                            child: Container(
                              width: 250,
                              height: 250,
                              color: Colors.transparent,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 20,
                      left: 0,
                      right: 0,
                      child: Center(
                        child: Container(
                          padding: EdgeInsets.symmetric(
                              horizontal: 20, vertical: 10),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.7),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            'Please position your face within the circle',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );

    // Chụp ảnh sau khi popup hiện
    await Future.delayed(Duration(seconds: 5));
    if (_controller != null && _controller!.value.isInitialized) {
      _controller!.takePicture().then((XFile image) async {
        Navigator.of(context).pop(); // Đóng popup
        if (action == 'Checking In') {
          await _checkIn(image.path);
        } else {
          await _checkOut(image.path);
        }
      }).catchError((e) {
        print('Error taking picture: $e');
        Navigator.of(context).pop(); // Đóng popup nếu có lỗi
      });
    }
  }

  Future<void> openCameraAndCheckIn(BuildContext context) async {
    await _showCameraDialog(context, 'Checking In');
  }

  Future<void> openCameraAndCheckOut(BuildContext context) async {
    await _showCameraDialog(context, 'Checking Out');
  }

  Future<void> _checkIn(String filePath) async {
    try {
      _isLoading = true;
      notifyListeners();

      final formData = FormData.fromMap({
        'faceImage':
            await MultipartFile.fromFile(filePath, filename: 'faceImage.jpg'),
      });

      final response =
          await _dioClient.dio.post('/api/attendance/checkIn', data: formData);

      if (response.statusCode == 200) {
        await fetchAttendanceByEmailAndDate();
        _successMessage = "Checkin successfully";
        notifyListeners();
      } else {
        throw Exception('Failed to check in');
      }
    } on DioError catch (e) {
      _errorMessage = e.response?.data['message'];
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _checkOut(String filePath) async {
    try {
      _isLoading = true;
      notifyListeners();

      final formData = FormData.fromMap({
        'faceImage':
            await MultipartFile.fromFile(filePath, filename: 'faceImage.jpg'),
      });

      final response =
          await _dioClient.dio.post('/api/attendance/checkOut', data: formData);

      if (response.statusCode == 200) {
        await fetchAttendanceByEmailAndDate();
        _successMessage = "Checkout successfully";
        notifyListeners();
      } else {
        throw Exception('Failed to check out');
      }
    } on DioError catch (e) {
      _errorMessage = e.response?.data['message'];
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearErrorMessage() {
    _errorMessage = '';
    notifyListeners();
  }

  void clearSuccessMessage() {
    _successMessage = '';
    notifyListeners();
  }
}
