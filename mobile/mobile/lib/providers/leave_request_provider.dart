import 'package:flutter/material.dart';
import 'package:mobile/models/LeaveRequestDTO.dart';
import 'package:mobile/models/SearchDTO.dart';
import 'package:mobile/services/dio_client.dart';

class LeaveRequestProvider with ChangeNotifier {
  final DioClient _dioClient;
  List<LeaveRequestDTO> _leaveRequests = [];

  LeaveRequestProvider({required DioClient dioClient}) : _dioClient = dioClient;

  Future<List<LeaveRequestDTO>> getLeaveRequestsByEmployee() async {
    try {
      final response = await _dioClient.dio.get('/api/leave-requests/history');
      if (response.data['data'] is List) {
        List<dynamic> body = response.data['data'];
        _leaveRequests = body.map((dynamic item) => LeaveRequestDTO.fromJson(item)).toList();
        notifyListeners();
        return _leaveRequests;
      } else {
        throw FetchLeaveRequestsException('Unexpected response format');
      }
    } catch (e) {
      throw FetchLeaveRequestsException('Failed to load leave requests: $e');
    }
  }

  Future<List<LeaveRequestDTO>> searchLeaveRequests(SearchDTO searchDto) async {
    try {
      final response = await _dioClient.dio.post('/api/leave-requests/search', data: searchDto.toJson());
      if (response.statusCode == 200) {
        // Chuyển đổi dữ liệu trả về thành danh sách LeaveRequestDTO
        List<LeaveRequestDTO> leaveRequests = (response.data as List)
            .map((request) => LeaveRequestDTO.fromJson(request))
            .toList();
        return leaveRequests;
      } else {
        throw Exception('Failed to load leave requests');
      }
    } catch (e) {
      print('Error searching leave requests: $e');
      throw Exception('Error searching leave requests');
    }
  }

  Future<LeaveRequestDTO> sendLeaveRequest(LeaveRequestDTO leaveRequestDTO) async {
    try {
      final response = await _dioClient.dio.post(
        '/api/leave-requests/send',
        data: leaveRequestDTO.toJson(),
      );
      return LeaveRequestDTO.fromJson(response.data);
    } catch (e) {
      print('Error sending leave request: $e');
      throw SendLeaveRequestException('Failed to send leave request: $e');
    }
  }

  DateTime? getLastEndDate() {
    if (_leaveRequests.isEmpty) return null;
    return _leaveRequests
        .where((request) => request.status == 'Approved' || request.status == 'Pending')
        .map((request) => request.endDate)
        .reduce((a, b) => a.isAfter(b) ? a : b);
  }

  List<LeaveRequestDTO> getApprovedOrPendingRequests() {
    return _leaveRequests.where((request) {
      return request.status == 'Approved' || request.status == 'Pending';
    }).toList();
  }

  bool hasDateConflict(LeaveRequestDTO newRequest) {
    for (var request in getApprovedOrPendingRequests()) {
      if (!(newRequest.endDate.isBefore(request.startDate) || newRequest.startDate.isAfter(request.endDate))) {
        return true;
      }
    }
    return false;
  }

  Future<void> refreshLeaveRequests() async {
    await getLeaveRequestsByEmployee();
    notifyListeners();
  }

  List<LeaveRequestDTO> get leaveRequests => _leaveRequests;
}

class FetchLeaveRequestsException implements Exception {
  final String message;
  FetchLeaveRequestsException(this.message);
}

class SendLeaveRequestException implements Exception {
  final String message;
  SendLeaveRequestException(this.message);
}




