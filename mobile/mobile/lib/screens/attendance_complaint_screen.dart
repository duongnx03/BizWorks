import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:provider/provider.dart'; // Thêm Provider để kết nối với AttendanceComplaintProvider
import 'package:mobile/providers/attendance_complaint_provider.dart'; // Thêm import AttendanceComplaintProvider

class AttendanceComplaintScreen extends StatefulWidget {
  final AttendanceDTO attendance;
  const AttendanceComplaintScreen({required this.attendance});

  @override
  _AttendanceComplaintScreenState createState() =>
      _AttendanceComplaintScreenState();
}

class _AttendanceComplaintScreenState extends State<AttendanceComplaintScreen> {
  final ImagePicker _picker = ImagePicker();
  List<XFile> _selectedImages = []; // Lưu danh sách hình ảnh đã chọn
  final TextEditingController _reasonController =
      TextEditingController(); // Controller cho lý do khiếu nại

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  String formatDuration(Duration? duration) {
    if (duration == null) return 'N/A';
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    return '${hours}h${minutes}m';
  }

  String getType(String? type) {
    switch (type) {
      case "noon_overtime":
        return "Overtime noon from 12h to 13h";
      case "30m_overtime":
        return "Overtime after work 30 minutes";
      case "1h_overtime":
        return "Overtime after work 1 hour";
      case "1h30_overtime":
        return "Overtime after work 1 hour 30 minutes";
      case "2h_overtime":
        return "Overtime after work 2 hours";
      default:
        return "N/A";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Complaint'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F0F0), // Màu nền nhẹ
                  borderRadius: BorderRadius.circular(8),
                ),
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.calendar_today,
                      color: const Color(0xFFFF902F),
                      size: 28,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      DateFormat("MM/dd/yyyy")
                          .format(widget.attendance.attendanceDate!),
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Thông tin không thể thay đổi
              _buildAttendanceInfoCard(),
              const SizedBox(height: 20),

              // Form nhập lý do và hình ảnh
              _buildComplaintForm(context),
            ],
          ),
        ),
      ),
    );
  }

  // Widget hiển thị thông tin attendance
  Widget _buildAttendanceInfoCard() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoRow(
                'Check In Time:',
                widget.attendance.checkInTime != null
                    ? DateFormat('HH:mm').format(widget.attendance.checkInTime!)
                    : "N/A"),
            _buildInfoRow(
                'Break Time End:',
                widget.attendance.breakTimeStart != null
                    ? DateFormat('HH:mm')
                        .format(widget.attendance.breakTimeStart!)
                    : "N/A"),
            _buildInfoRow(
                'Break Time Start:',
                widget.attendance.breakTimeEnd != null
                    ? DateFormat('HH:mm')
                        .format(widget.attendance.breakTimeEnd!)
                    : "N/A"),
            _buildInfoRow(
                'Check Out Time:',
                widget.attendance.checkOutTime != null
                    ? DateFormat('HH:mm')
                        .format(widget.attendance.checkOutTime!)
                    : "N/A"),
            _buildInfoRow(
                'Total Time:',
                widget.attendance.totalTime != null
                    ? formatDuration(widget.attendance.totalTime)
                    : "N/A"),
            _buildInfoRow(
                'Office Hours:',
                widget.attendance.officeHours != null
                    ? formatDuration(widget.attendance.officeHours)
                    : "N/A"),
            _buildInfoRow(
                'Overtime:',
                widget.attendance.overtime != null
                    ? formatDuration(widget.attendance.overtime)
                    : 'N/A'),
            _buildInfoRow(
                'Note:',
                widget.attendance.overtimeDTO != null
                    ? getType(widget.attendance.overtimeDTO!.type)
                    : "N/A"),
          ],
        ),
      ),
    );
  }

  // Widget hiển thị form khiếu nại và chọn hình ảnh
  Widget _buildComplaintForm(BuildContext context) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Submit a Complaint',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller:
                  _reasonController, // Sử dụng controller để lấy lý do khiếu nại
              decoration: InputDecoration(
                labelText: 'Reason',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),

            // Hiển thị các hình ảnh đã chọn theo dạng lưới (tối đa 4 hình ảnh)
            if (_selectedImages.isNotEmpty)
              GridView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, // Hiển thị 2 hình ảnh mỗi hàng
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                itemCount: _selectedImages.length,
                itemBuilder: (context, index) {
                  return Stack(
                    children: [
                      // Hiển thị ảnh
                      Positioned.fill(
                        child: Image.file(
                          File(_selectedImages[index].path),
                          fit: BoxFit.cover,
                        ),
                      ),
                      // Nút xóa
                      Positioned(
                        top: 4,
                        right: 4,
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedImages.removeAt(index);
                            });
                          },
                          child: const CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.red,
                            child: Icon(
                              Icons.delete,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            const SizedBox(height: 16),

            // Nút chọn và gửi hình ảnh
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _selectedImages.length < 4
                        ? () async {
                            final List<XFile>? images =
                                await _picker.pickMultiImage();

                            if (images != null && images.isNotEmpty) {
                              setState(() {
                                // Giới hạn số lượng hình ảnh tối đa là 4
                                _selectedImages.addAll(
                                    images.take(4 - _selectedImages.length));
                              });
                            }
                          }
                        : null, // Vô hiệu hóa nếu đã chọn đủ 4 hình ảnh
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF902F),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Choose Images',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Gọi hàm submitComplaint từ provider
                      _submitComplaint(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF902F),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Submit',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Hàm xử lý khi bấm nút Submit
  void _submitComplaint(BuildContext context) async {
    // Lấy provider từ context
    final complaintProvider =
        Provider.of<AttendanceComplaintProvider>(context, listen: false);

    // Chuẩn bị dữ liệu để gửi đi
    try {
      List<File> imageFiles =
          _selectedImages.map((xfile) => File(xfile.path)).toList();

      // Gọi hàm submitComplaint từ provider
      await complaintProvider.submitComplaint(
        checkInTime: widget.attendance.checkInTime!,
        breakTimeStart: widget.attendance.breakTimeStart!,
        breakTimeEnd: widget.attendance.breakTimeEnd!,
        checkOutTime: widget.attendance.checkOutTime!,
        totalTime: widget.attendance.totalTime!,
        officeHours: widget.attendance.officeHours!,
        overtime: widget.attendance.overtime!,
        attendanceDate: widget.attendance.attendanceDate!,
        complaintReason: _reasonController.text,
        attendanceId: widget.attendance.id,
        images: imageFiles,
      );

      // Sau khi gửi thành công, có thể hiển thị thông báo hoặc điều hướng người dùng
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Complaint submitted successfully')),
      );
      Navigator.pushNamed(context, "/attendance-complaint-list");
    } catch (error) {
      // Xử lý lỗi khi gửi không thành công
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to submit complaint')),
      );
    }
  }

  Widget _buildInfoRow(String title, String value) {
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
}
