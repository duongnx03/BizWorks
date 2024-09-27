import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();
  late Dio _dio;
  late CookieJar _cookieJar;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    _cookieJar = CookieJar();
    _dio = Dio()
      ..interceptors.add(CookieManager(_cookieJar))
      ..options = BaseOptions(
        baseUrl: 'http://10.0.2.2:8080/',
        connectTimeout: const Duration(milliseconds: 10000),
        receiveTimeout: const Duration(milliseconds: 10000),
        headers: {
          'Content-Type': 'application/json',
        },
      );
  }

  Dio get dio => _dio;
  CookieJar get cookieJar => _cookieJar;
}
