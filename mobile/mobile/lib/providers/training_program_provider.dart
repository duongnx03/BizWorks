import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';
import 'package:mobile/services/dio_client.dart';

class TrainingProgramProvider with ChangeNotifier {
  final DioClient _dioClient;

  TrainingProgramProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<TrainingProgramDTO>? _trainingPrograms;
  List<TrainingProgramDTO>? get trainingPrograms => _trainingPrograms;

  Future<void> fetchTrainingPrograms() async {
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
}
