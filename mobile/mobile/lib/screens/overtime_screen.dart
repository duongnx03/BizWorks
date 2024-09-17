import 'package:flutter/material.dart';

class OvertimeRequestScreen extends StatelessWidget {
  const OvertimeRequestScreen({Key? key}) : super(key: key);

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
                    DateTime.now().toLocal().toString().split(' ')[0],
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
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                      ),
                      items: [
                        DropdownMenuItem(
                          value: 'Lunch Overtime',
                          child: Text('Lunch Overtime'),
                        ),
                        DropdownMenuItem(
                          value: 'Post-Work Overtime (30 mins)',
                          child: Text('Post-Work Overtime (30 mins)'),
                        ),
                      ],
                      onChanged: (String? value) {
                        // Xử lý khi chọn kiểu tăng ca
                      },
                    ),
                    const SizedBox(height: 20),
                    // Textarea để nhập lý do tăng ca
                    TextField(
                      maxLines: 4,
                      decoration: InputDecoration(
                        labelText: 'Reason for Overtime',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                        hintText: 'Enter the reason for overtime...',
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Nút gửi
                    ElevatedButton(
                      onPressed: () {
                        // Xử lý khi nhấn nút gửi
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
