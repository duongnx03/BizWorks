import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;

class Helper{
  static String replaceLocalhost(String url){
    return url.replaceFirst("http://localhost", "http://10.0.2.2");
  }

  static bool validateImage(XFile image){
    final ext = path.extension(image.path).toLowerCase();
    final validateExtension = [".jpg", ".png", ".jpeg"];
    return validateExtension.contains(ext);
  }

  static Future<String> createEmptyFile() async {
    // Tạo một tệp giả với kích thước bằng 0
    // Sử dụng thư mục tạm thời của hệ thống
    final directory = Directory.systemTemp;
    // Tạo đường dẫn cho tệp giả
    final emptyFilePath = path.join(directory.path, 'empty_image.png');
    // Khởi tạo đối tượng tệp với đường dẫn vừa tạo
    final emptyFile = File(emptyFilePath);
    // Ghi một mảng byte rỗng (kích thước 0) vào tệp
    await emptyFile.writeAsBytes(Uint8List(0));
    // Trả về đường dẫn của tệp giả
    print("emptyFilePath: $emptyFilePath");
    return emptyFilePath;
  }
}