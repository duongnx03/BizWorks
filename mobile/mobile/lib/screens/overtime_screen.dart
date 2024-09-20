import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:provider/provider.dart';
import 'package:mobile/providers/overtime_provider.dart'; // Import OvertimeProvider

class OvertimeRequestScreen extends StatefulWidget {
  final AttendanceDTO attendance;
  const OvertimeRequestScreen({super.key, required this.attendance});

  @override
  _OvertimeRequestScreenState createState() => _OvertimeRequestScreenState();
}

class _OvertimeRequestScreenState extends State<OvertimeRequestScreen> {
  String? selectedOvertimeType;
  TextEditingController reasonController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Overtime Request'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Ngày và biểu tượng lịch trên cùng một hàng
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFF0F0F0), // Màu nền nhẹ
                borderRadius: BorderRadius.circular(8),
              ),
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
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
            // Form đăng ký tăng ca
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Overtime Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Dropdown để chọn kiểu tăng ca
                    DropdownButtonFormField<String>(
                      decoration: InputDecoration(
                        labelText: 'Overtime Type',
                        labelStyle: TextStyle(
                          fontSize: 16, // Kích thước chữ cho label
                          color: Colors.black54, // Màu sắc cho label
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(
                            color: Colors.grey.shade400,
                            width: 1.5, // Độ dày của viền
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(
                            color:
                                const Color(0xFFFF902F), // Màu viền khi focus
                            width: 2.0,
                          ),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(
                            vertical: 14, horizontal: 16), // Điều chỉnh padding
                      ),
                      value: selectedOvertimeType,
                      items: [
                        DropdownMenuItem(
                          value: 'noon_overtime',
                          child: Row(
                            children: [
                              Icon(Icons.lunch_dining,
                                  color: Colors.orangeAccent),
                              const SizedBox(width: 10),
                              Text('Lunch Overtime'),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: '30m_overtime',
                          child: Row(
                            children: [
                              Icon(Icons.timer, color: Colors.orangeAccent),
                              const SizedBox(width: 10),
                              Text('Post-Work Overtime (30m)'),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: '1h_overtime',
                          child: Row(
                            children: [
                              Icon(Icons.timer, color: Colors.orangeAccent),
                              const SizedBox(width: 10),
                              Text('Post-Work Overtime (1h)'),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: '1h30_overtime',
                          child: Row(
                            children: [
                              Icon(Icons.timer, color: Colors.orangeAccent),
                              const SizedBox(width: 10),
                              Text('Post-Work Overtime (1h30)'),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: '2h_overtime',
                          child: Row(
                            children: [
                              Icon(Icons.timer, color: Colors.orangeAccent),
                              const SizedBox(width: 10),
                              Text('Post-Work Overtime (2h)'),
                            ],
                          ),
                        ),
                      ],
                      onChanged: (String? value) {
                        setState(() {
                          selectedOvertimeType = value;
                        });
                      },
                      icon: Icon(Icons.arrow_drop_down,
                          color: Colors.orange), // Màu sắc cho icon dropdown
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors
                            .black87, // Màu sắc cho chữ bên trong dropdown
                      ),
                      dropdownColor: Colors.white, // Màu nền của dropdown
                      isExpanded:
                          true, // Đảm bảo dropdown không bị cắt nếu quá dài
                    ),

                    const SizedBox(height: 20),
                    // Textarea để nhập lý do tăng ca
                    TextField(
                      controller: reasonController,
                      maxLines: 4,
                      decoration: InputDecoration(
                        labelText: 'Reason for Overtime',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(
                            vertical: 12, horizontal: 12),
                        hintText: 'Enter the reason for overtime...',
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Nút gửi
                    ElevatedButton(
                      onPressed: () async {
                        if (selectedOvertimeType != null &&
                            reasonController.text.isNotEmpty) {
                          bool success = await context
                              .read<OvertimeProvider>()
                              .createOvertime(
                                selectedOvertimeType!,
                                reasonController.text,
                                widget.attendance.id,
                              );

                          if (success) {
                            Navigator.pushNamed(context, "/overtime-list");
                          } else {
                            // Thông báo thất bại
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content:
                                    Text('Failed to submit overtime request.'),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        } else {
                          // Xử lý lỗi nếu chưa chọn kiểu tăng ca hoặc nhập lý do
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Please complete all fields.'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF902F),
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Submit Request',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
