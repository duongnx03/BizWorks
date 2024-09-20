import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/providers/overtime_provider.dart';
import 'package:mobile/screens/overtime_details_screen.dart';
import 'package:provider/provider.dart';

class OvertimeListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Gọi Provider để fetch dữ liệu từ API
    return Scaffold(
      appBar: AppBar(
        title: Text('Overtime List'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder(
        future: Provider.of<OvertimeProvider>(context, listen: false)
            .fetchOvertimeByEmail(), // Gọi API getByEmail khi màn hình load
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
                child: CircularProgressIndicator()); // Hiển thị loading
          } else if (snapshot.hasError) {
            // Hiển thị khi có lỗi
            return Center(child: Text('Error loading overtimes'));
          } else {
            return Consumer<OvertimeProvider>(
              builder: (context, overtimeProvider, child) {
                if (overtimeProvider.overtimeDTO.isEmpty) {
                  // Hiển thị khi không có dữ liệu
                  return Center(child: Text('No overtime found'));
                } else {
                  // Hiển thị danh sách khiếu nại
                  return Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: ListView.builder(
                      itemCount: overtimeProvider.overtimeDTO.length,
                      itemBuilder: (context, index) {
                        final overtime = overtimeProvider.overtimeDTO[index];
                        final status = overtime.status;

                        // Đặt màu sắc cho trạng thái
                        Color statusColor;
                        switch (status) {
                          case 'Pending':
                            statusColor = Colors.blue;
                            break;
                          case 'Approved':
                            statusColor = Colors.green;
                            break;
                          case 'Rejected':
                            statusColor = Colors.red;
                            break;
                          default:
                            statusColor = Colors.grey;
                        }

                        return Card(
                          elevation: 4,
                          margin: EdgeInsets.symmetric(vertical: 8),
                          child: ListTile(
                            contentPadding: EdgeInsets.all(16),

                            // Chỉ hiển thị ngày
                            title: Text(
                              DateFormat("MM/dd/yyyy").format(overtime.attendanceDTO!.attendanceDate!),
                              style: const TextStyle(
                                fontSize:
                                    16, // Tăng kích thước chữ để làm nổi bật
                                fontWeight: FontWeight.bold, // Đậm chữ
                                color: Colors.black87, // Màu sắc rõ ràng
                              ),
                            ),

                            // Loại bỏ subtitle vì không cần hiện status

                            // Container này sẽ hiển thị trạng thái như một dấu hiệu màu ở bên phải
                            trailing: Container(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: statusColor, // Màu sắc của trạng thái
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                status.toString(),
                                style: TextStyle(color: Colors.white),
                              ),
                            ),

                            // Điều hướng tới trang chi tiết khiếu nại
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => OvertimeDetailsScreen(
                                    overtime: overtime,
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
                  );
                }
              },
            );
          }
        },
      ),
    );
  }
}
