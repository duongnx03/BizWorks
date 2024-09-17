import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/helpers/Helper.dart';
import 'package:mobile/providers/employee_provider.dart';
import 'package:provider/provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Lấy thông tin từ EmployeeProvider
    final employeeProvider = Provider.of<EmployeeProvider>(context);
    
    // Gọi fetchEmployeeData nếu dữ liệu chưa được tải
    if (employeeProvider.employee == null) {
      employeeProvider.fetchEmployeeData();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Profile',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
        elevation: 1,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildProfileHeader(employeeProvider),
            const SizedBox(height: 16),
            _buildProfileDetails(employeeProvider),
            const SizedBox(height: 16),
            _buildUpdateButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(EmployeeProvider employeeProvider) {
    final employee = employeeProvider.employee;

    return Center(
      child: CircleAvatar(
        backgroundColor: const Color(0xFFFF902F),
        radius: 60,
        backgroundImage: employee?.avatar.isNotEmpty == true
            ? NetworkImage(Helper.replaceLocalhost(employee!.avatar))
            : null,
        child: employee?.avatar.isEmpty == true
            ? const Icon(Icons.person, size: 60, color: Colors.white)
            : null,
      ),
    );
  }

  Widget _buildProfileDetails(EmployeeProvider employeeProvider) {
    final employee = employeeProvider.employee;
    final DateFormat dateFormat = DateFormat('dd/MM/yyyy');

    if (employee == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Employee Code:', employee.empCode),
            _buildDetailRow('Name:', employee.fullname),
            _buildDetailRow('Email:', employee.email),
            _buildDetailRow('Department:', employee.department),
            _buildDetailRow('Position:', employee.position),
            _buildDetailRow('Phone:', employee.phone),
            _buildDetailRow('Start date:', dateFormat.format(employee.startDate!)),
            _buildDetailRow('Address:', employee.address),
            _buildDetailRow('Birthday:', dateFormat.format(employee.dob ?? DateTime.now())),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          Text(
            value,
            style: TextStyle(fontSize: 16, color: Colors.grey[700]),
          ),
        ],
      ),
    );
  }

  Widget _buildUpdateButton(BuildContext context) {
    return Center(
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () {
            // Xử lý cập nhật thông tin cá nhân
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFF902F),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text('Update Profile'),
        ),
      ),
    );
  }
}
