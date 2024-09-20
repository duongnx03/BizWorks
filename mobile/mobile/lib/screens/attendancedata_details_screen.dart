import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:mobile/screens/attendance_complaint_screen.dart';
import 'package:mobile/screens/overtime_screen.dart';

class AttendanceDataDetailsScreen extends StatelessWidget {
  final AttendanceDTO attendance;

  AttendanceDataDetailsScreen({required this.attendance});

  @override
  Widget build(BuildContext context) {
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

    // Dữ liệu mẫu để hiển thị trên UI
    final Map<String, String> details = {
      'Check In Time': attendance.checkInTime != null
          ? DateFormat('HH:mm').format(attendance.checkInTime!)
          : "N/A",
      'Break Start': attendance.breakTimeStart != null
          ? DateFormat('HH:mm').format(attendance.breakTimeStart!)
          : "N/A",
      'Break End': attendance.breakTimeEnd != null
          ? DateFormat('HH:mm').format(attendance.breakTimeEnd!)
          : "N/A",
      'Check Out Time': attendance.checkOutTime != null
          ? DateFormat('HH:mm').format(attendance.checkOutTime!)
          : "N/A",
      'Total Time': formatDuration(attendance.totalTime),
      'Office Hours': formatDuration(attendance.officeHours),
      'Overtime': formatDuration(attendance.overtime),
      'Note': getType(attendance.overtimeDTO?.type),
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Details'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
        elevation: 0, // Bỏ bóng của AppBar
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
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
                    DateFormat("MM/dd/yyyy").format(attendance.attendanceDate!),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            // Hiển thị dữ liệu chi tiết
            Expanded(
              child: ListView(
                children: details.entries.map((entry) {
                  return Container(
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 5,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          entry.key,
                          style:
                              Theme.of(context).textTheme.bodyLarge!.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black54,
                                  ),
                        ),
                        Text(
                          entry.value,
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
            SizedBox(height: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                if (attendance.checkInTime == null &&
                    attendance.checkOutTime == null)
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (context) => AttendanceComplaintScreen(
                                  attendance: attendance,
                                )),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF902F), // Màu nền nút
                      minimumSize:
                          Size(double.infinity, 50), // Chiều rộng đầy đủ
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: EdgeInsets.symmetric(
                          vertical: 16), // Khoảng cách bên trong nút
                    ),
                    child: Text(
                      'Complaint',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                // Điều kiện hiển thị nút khiếu nại hoặc đăng ký tăng ca
                if (attendance.checkInTime != null &&
                    attendance.checkOutTime != null)
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (context) => AttendanceComplaintScreen(
                                  attendance: attendance,
                                )),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF902F), // Màu nền nút
                      minimumSize:
                          Size(double.infinity, 50), // Chiều rộng đầy đủ
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: EdgeInsets.symmetric(
                          vertical: 16), // Khoảng cách bên trong nút
                    ),
                    child: Text(
                      'Complaint',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                if (attendance.checkInTime != null &&
                    attendance.checkOutTime == null)
                  ElevatedButton(
                    onPressed: () {
                      // Thực hiện hành động đăng ký tăng ca
                      Navigator.of(context).push(
                        MaterialPageRoute(
                            builder: (context) => OvertimeRequestScreen(
                                  attendance: attendance,
                                )),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF902F),
                      minimumSize:
                          Size(double.infinity, 50), // Chiều rộng đầy đủ
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: EdgeInsets.symmetric(
                          vertical: 16), // Khoảng cách bên trong nút
                    ),
                    child: Text(
                      'Overtime',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
