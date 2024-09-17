import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/helpers/Helper.dart';
import 'package:mobile/models/AttendanceComplaintDTO.dart';

class ComplaintDetailScreen extends StatelessWidget {
  final AttendanceComplaintDTO? complaint;

  const ComplaintDetailScreen({this.complaint});

  @override
  Widget build(BuildContext context) {
    // Tách chuỗi imagePaths thành danh sách các đường dẫn
    List<String> imagePaths = complaint!.imagePaths!.split(',') ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Complaint Details'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStatusAndActionButtons(complaint!.status, context),
              const SizedBox(height: 20),
              // Thông tin khiếu nại
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInfoRow(
                          'Attendance Date:',
                          complaint!.attendanceDate != null
                              ? DateFormat('MM/dd/yyyy')
                                  .format(complaint!.attendanceDate!)
                              : "N/A"),
                      _buildInfoRow(
                          'Check In Time:',
                          complaint!.checkInTime != null
                              ? DateFormat('HH:mm')
                                  .format(complaint!.checkInTime!)
                              : "N/A"),
                      _buildInfoRow(
                          'Break Start:',
                          complaint!.breakTimeStart != null
                              ? DateFormat('HH:mm')
                                  .format(complaint!.breakTimeStart!)
                              : "N/A"),
                      _buildInfoRow(
                          'Break End:',
                          complaint!.breakTimeEnd != null
                              ? DateFormat('HH:mm')
                                  .format(complaint!.breakTimeEnd!)
                              : "N/A"),
                      _buildInfoRow(
                        'Check Out Time: ',
                        complaint!.checkOutTime != null
                            ? DateFormat('HH:mm')
                                .format(complaint!.checkOutTime!)
                            : "N/A",
                      ),
                      _buildInfoRow(
                          'Total Time: ', formatDuration(complaint!.totalTime)),
                      _buildInfoRow('Office Hours: ',
                          formatDuration(complaint!.officeHours)),
                      _buildInfoRow(
                          'Overtime: ', formatDuration(complaint!.overtime)),
                      _buildInfoRow('Reason:', complaint!.complaintReason),
                      _buildInfoRow(
                          'Created At:',
                          complaint!.createdAt != null
                              ? DateFormat('MM/dd/yyyy HH:mm')
                                  .format(complaint!.createdAt!)
                              : "N/A"),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Hiển thị các hình ảnh nếu có
              imagePaths.isNotEmpty
                  ? _buildImageGallery(imagePaths)
                  : Container(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String title, dynamic value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  // Hàm format duration
  String formatDuration(Duration? duration) {
    if (duration == null) return 'N/A';
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    return '${hours}h${minutes}m';
  }

  // Hàm hiển thị ảnh dưới dạng lưới (2x2)
  Widget _buildImageGallery(List<String> imagePaths) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Proof Images',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // Hiển thị 2 cột
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: imagePaths.length, // Số lượng ảnh
              itemBuilder: (context, index) {
                return Image.network(
                  Helper.replaceLocalhost(imagePaths[index]
                      .trim()), // Đảm bảo không có khoảng trắng thừa
                  fit: BoxFit.cover,
                  height: 150,
                  width: 150,
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // Hàm hiển thị trạng thái và button hành động
  Widget _buildStatusAndActionButtons(String? status, BuildContext context) {
    Color statusColor;
    String statusText;

    switch (status) {
      case 'Pending':
        statusColor = Colors.blue;
        statusText = 'Pending';
        break;
      case 'Approved':
        statusColor = Colors.green;
        statusText = 'Approved';
        break;
      case 'Rejected':
        statusColor = Colors.red;
        statusText = 'Rejected';
        break;
      default:
        statusColor = Colors.grey;
        statusText = 'Unknown';
    }

    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: statusColor,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            statusText,
            style: TextStyle(color: Colors.white, fontSize: 18),
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }
}
