import 'package:flutter/material.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';
import 'package:intl/intl.dart'; // Để định dạng ngày tháng

class TrainingProgramDetailsScreen extends StatelessWidget {
  final TrainingProgramDTO trainingProgram;

  // Constructor nhận đối tượng TrainingProgramDTO
  TrainingProgramDetailsScreen({required this.trainingProgram});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(trainingProgram.title), // Tiêu đề trang
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Tiêu đề
              Text(
                'Chi Tiết Chương Trình Đào Tạo',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20.0),

              // Mô tả
              Text(
                'Mô Tả:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              SizedBox(height: 8.0),
              Text(trainingProgram.description ?? 'Không có mô tả'),
              SizedBox(height: 16.0),

              // Ngày bắt đầu
              Text(
                'Ngày Bắt Đầu: ${DateFormat('yyyy-MM-dd').format(trainingProgram.startDate)}',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8.0),

              // Ngày kết thúc
              Text(
                'Ngày Kết Thúc: ${DateFormat('yyyy-MM-dd').format(trainingProgram.endDate)}',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16.0),

              // Trạng thái
              Text(
                'Trạng Thái: ${trainingProgram.completed ? 'Đã Hoàn Thành' : 'Đang Tiến Hành'}',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color:
                      trainingProgram.completed ? Colors.green : Colors.orange,
                ),
              ),
              SizedBox(height: 20.0),

              // Nút tham gia
              ElevatedButton(
                onPressed: () {
                  // Thêm hành động để tham gia chương trình đào tạo
                },
                child: Text('Tham Gia Chương Trình Đào Tạo'),
              ),
              SizedBox(height: 20.0),

              // Thông tin người tham gia
              Text(
                'Người Tham Gia:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              SizedBox(height: 8.0),

              // Kiểm tra danh sách người tham gia
              if (trainingProgram.participants != null &&
                  trainingProgram.participants!.isNotEmpty) ...[
                // Danh sách người tham gia
                ListView.builder(
                  shrinkWrap:
                      true, // Để danh sách có thể cuộn bên trong SingleChildScrollView
                  physics: NeverScrollableScrollPhysics(), // Vô hiệu hóa cuộn
                  itemCount: trainingProgram.participants!.length,
                  itemBuilder: (context, index) {
                    final participant = trainingProgram.participants![index];
                    return ListTile(
                      leading: CircleAvatar(
                        child: Text(participant.fullname != null &&
                                participant.fullname.isNotEmpty
                            ? participant.fullname[0]
                            : '?'),
                      ),
                      title: Text(participant.fullname ?? 'Tên không xác định'),
                      subtitle: Text(participant.email ?? 'Chưa có email'),
                    );
                  },
                ),
              ] else ...[
                // Nếu không có người tham gia
                Text('Chưa có người tham gia nào.',
                    style: TextStyle(fontStyle: FontStyle.italic)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
