import 'package:flutter/material.dart';
import 'package:mobile/models/ViolationTypeDTO.dart';
import 'package:mobile/services/dio_client.dart';
import 'package:dio/dio.dart';

class ViolationTypeProvider with ChangeNotifier {
  final DioClient _dioClient;

  ViolationTypeProvider({required DioClient dioClient})
      : _dioClient = dioClient;

  List<ViolationTypeDTO> _violationTypes = [];
  List<ViolationTypeDTO> get violationTypes => _violationTypes;

  Future<void> fetchViolationTypes() async {
    try {
      final response = await _dioClient.dio.get('/api/violation-types');

      if (response.statusCode == 200) {
        final data = response.data as List<dynamic>;
        List<ViolationTypeDTO> sortedViolationTypes =
            data.map((item) => ViolationTypeDTO.fromJson(item)).toList();

        sortedViolationTypes.sort((a, b) => b.id.compareTo(a.id));

        _violationTypes = sortedViolationTypes;

        notifyListeners();
      } else {
        throw Exception('Failed to load violation types data');
      }
    } on DioError catch (e) {
      print('DioError: ${e.message}');
      print('DioError Response Data: ${e.response?.data}');
    } catch (e) {
      print('An unexpected error occurred: $e');
    }
  }
}
