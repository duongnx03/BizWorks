import 'package:flutter/material.dart';
import 'package:mobile/helpers/Helper.dart';
import 'package:mobile/providers/employee_provider.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Home',
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
            _buildUserInfo(context),
            const SizedBox(height: 16),
            Expanded(
              // Thêm Expanded để GridView chiếm không gian còn lại
              child: _buildFunctionGrid(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserInfo(BuildContext context) {
    final employeeProvider =
        Provider.of<EmployeeProvider>(context, listen: false);

    return FutureBuilder<void>(
      future: employeeProvider.fetchEmployeeData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else {
          final employee = employeeProvider.employee;

          if (employee == null) {
            return const Center(child: Text('No employee data found.'));
          }

          return Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFF902F).withOpacity(0.2),
                  spreadRadius: 2,
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: const Color(0xFFFF902F),
                  radius: 40,
                  backgroundImage: employee.avatar.isNotEmpty
                      ? NetworkImage(Helper.replaceLocalhost(employee.avatar))
                      : null,
                  child: employee.avatar.isEmpty
                      ? const Icon(Icons.person, size: 40, color: Colors.white)
                      : null,
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      employee.fullname + " - " + employee.empCode,
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      employee.department,
                      style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                    ),
                    Text(
                      employee.position,
                      style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ],
            ),
          );
        }
      },
    );
  }

  Widget _buildFunctionGrid(BuildContext context) {
    return GridView(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.2,
      ),
      children: [
        _buildFunctionCard(
          icon: Icons.person,
          title: 'Profile',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/profile");
          },
        ),
        _buildFunctionCard(
          icon: Icons.access_time,
          title: 'Attendance',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/attendance");
          },
        ),
        _buildFunctionCard(
          icon: Icons.calendar_today,
          title: 'Attendance Data',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/attendance-data");
          },
        ),
        _buildFunctionCard(
          icon: Icons.report_problem,
          title: 'Attendance Complaint',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/attendance-complaint-list");
          },
        ),
        _buildFunctionCard(
          icon: Icons.access_alarm,
          title: 'Overtime',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/overtime-list");
          },
        ),
        _buildFunctionCard(
          icon: Icons.business,
          title: 'Job Postings',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/job-posting");
          },
        ),
        _buildFunctionCard(
          icon: Icons.warning,
          title: 'Violation',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/violation");
          },
        ),
        _buildFunctionCard(
          icon: Icons.monetization_on,
          title: 'Salary',
          color: const Color(0xFFFF902F),
          onTap: () {
            Navigator.pushNamed(context, "/salary");
          },
        ),
      ],
    );
  }

  Widget _buildFunctionCard({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        color: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Expanded(
                child: Center(
                  child: Icon(
                    icon,
                    size: 60,
                    color: color,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.blueGrey[800],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
