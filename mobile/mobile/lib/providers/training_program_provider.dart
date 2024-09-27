import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/AttendanceTrainingProgramDTO.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';
import 'package:mobile/services/dio_client.dart';

class TrainingProgramProvider with ChangeNotifier {
  final DioClient _dioClient;

  TrainingProgramProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<TrainingProgramDTO>? _trainingPrograms;
  List<TrainingProgramDTO>? get trainingPrograms => _trainingPrograms;

  // Fetch all training programs
  Future<void> fetchAllTrainingPrograms() async {
    try {
      final response = await _dioClient.dio.get('/api/training-programs');
      if (response.statusCode == 200) {
        _trainingPrograms = (response.data as List)
            .map((program) => TrainingProgramDTO.fromJson(program))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load training programs');
      }
    } catch (e) {
      print('Error fetching training programs: $e');
    }
  }

  // Fetch all training programs
  Future<void> fetchMyTrainingPrograms() async {
    try {
      final response = await _dioClient.dio
          .get('/api/training-programs/my-training-programs');
      if (response.statusCode == 200) {
        _trainingPrograms = (response.data as List)
            .map((program) => TrainingProgramDTO.fromJson(program))
            .toList();
        notifyListeners();
      } else {
        throw Exception('Failed to load training programs');
      }
    } catch (e) {
      print('Error fetching training programs: $e');
    }
  }

  // Create a new training program
  Future<void> createTrainingProgram(TrainingProgramDTO dto) async {
    try {
      final response = await _dioClient.dio.post(
        '/api/training-programs',
        data: dto.toJson(), // Giả sử bạn có phương thức toJson() trong DTO
      );
      if (response.statusCode == 201) {
        fetchAllTrainingPrograms(); // Cập nhật danh sách sau khi tạo
      } else {
        throw Exception('Failed to create training program');
      }
    } catch (e) {
      print('Error creating training program: $e');
    }
  }

  // Fetch training program by ID
  Future<TrainingProgramDTO?> fetchTrainingProgramById(int id) async {
    try {
      final response = await _dioClient.dio.get('/api/training-programs/$id');
      if (response.statusCode == 200) {
        return TrainingProgramDTO.fromJson(response.data);
      } else {
        throw Exception('Failed to load training program');
      }
    } catch (e) {
      print('Error fetching training program by ID: $e');
      return null;
    }
  }

  // Update a training program
  Future<void> updateTrainingProgram(int id, TrainingProgramDTO dto) async {
    try {
      final response = await _dioClient.dio.put(
        '/api/training-programs/$id',
        data: dto.toJson(),
      );
      if (response.statusCode == 200) {
        fetchAllTrainingPrograms(); // Cập nhật danh sách sau khi cập nhật
      } else {
        throw Exception('Failed to update training program');
      }
    } catch (e) {
      print('Error updating training program: $e');
    }
  }

  // Delete a training program
  Future<void> deleteTrainingProgram(int id) async {
    try {
      final response =
          await _dioClient.dio.delete('/api/training-programs/$id');
      if (response.statusCode == 204) {
        fetchAllTrainingPrograms(); // Cập nhật danh sách sau khi xóa
      } else {
        throw Exception('Failed to delete training program');
      }
    } catch (e) {
      print('Error deleting training program: $e');
    }
  }

  // Fetch attendance by employee ID
  Future<List<AttendanceTrainingProgramDTO>> fetchAttendanceByEmployeeId(
      int employeeId) async {
    try {
      final response = await _dioClient.dio
          .get('/api/training-programs/attendance/employee/$employeeId');
      if (response.statusCode == 200) {
        return (response.data as List)
            .map((attendance) =>
                AttendanceTrainingProgramDTO.fromJson(attendance))
            .toList();
      } else {
        throw Exception('Failed to load attendance');
      }
    } catch (e) {
      print('Error fetching attendance by employee ID: $e');
      return [];
    }
  }

  // Other methods can be added as needed for other endpoints...
}
