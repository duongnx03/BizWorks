import 'package:flutter/material.dart';
import 'package:mobile/providers/salary_provider.dart';
import 'package:provider/provider.dart';

class SalaryScreen extends StatefulWidget {
  const SalaryScreen({super.key});

  @override
  _SalaryScreenState createState() => _SalaryScreenState();
}

class _SalaryScreenState extends State<SalaryScreen> {
  bool isLoading = true; // Thêm trạng thái loading

  @override
  void initState() {
    super.initState();
    final salaryProvider = Provider.of<SalaryProvider>(context, listen: false);
    fetchSalaries(salaryProvider);
  }

  Future<void> fetchSalaries(SalaryProvider salaryProvider) async {
    try {
      await salaryProvider.fetchSalariesByEmail();
      setState(() {
        isLoading = false; // Dừng loading khi dữ liệu đã được fetch
      });
    } catch (e) {
      // Xử lý lỗi nếu cần thiết
      print('Error fetching salaries: $e');
      setState(() {
        isLoading = false; // Dừng loading ngay cả khi có lỗi
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final salaryProvider = Provider.of<SalaryProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salaries'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
        elevation: 1,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : salaryProvider.salaries.isEmpty
                ? const Center(child: Text('No salaries found.'))
                : ListView.builder(
                    itemCount: salaryProvider.salaries.length,
                    itemBuilder: (context, index) {
                      final salary = salaryProvider.salaries[index];
                      return Card(
                        elevation: 2,
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        child: ListTile(
                          title: Text('Salary Code: ${salary.salaryCode}'),
                          subtitle: Text(
                            'Month: ${salary.month}, Year: ${salary.year}',
                          ),
                          onTap: () {
                            showDialog(
                              context: context,
                              builder: (context) {
                                return AlertDialog(
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  title: Text('Salary Details',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  content: SingleChildScrollView(
                                    child: ListBody(
                                      children: <Widget>[
                                        _buildDetailRow('Basic Salary:',
                                            '\$${salary.basicSalary.toStringAsFixed(2)}'),
                                        _buildDetailRow('Bonus Salary:',
                                            '\$${salary.bonusSalary.toStringAsFixed(2)}'),
                                        _buildDetailRow('Overtime Salary:',
                                            '\$${salary.overtimeSalary.toStringAsFixed(2)}'),
                                        _buildDetailRow('Advance Salary:',
                                            '\$${salary.advanceSalary.toStringAsFixed(2)}'),
                                        _buildDetailRow('Deduction Salary:',
                                            '\$${salary.deductions.toStringAsFixed(2)}'),
                                        _buildDetailRow('Total Salary:',
                                            '\$${salary.totalSalary.toStringAsFixed(2)}'),
                                        _buildDetailRow(
                                            'Status:', salary.status),
                                        _buildDetailRow(
                                            'Notes:', salary.notes ?? ""),
                                        _buildDetailRow('Created:',
                                            '${salary.createdAt.toLocal().toIso8601String().split('T')[0]}'),
                                        _buildDetailRow('Created By:',
                                            '${salary.createdBy}'),
                                      ],
                                    ),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                      child: const Text('Close'),
                                    ),
                                  ],
                                );
                              },
                            );
                          },
                        ),
                      );
                    },
                  ),
      ),
    );
  }

  // Hàm hỗ trợ để tạo các dòng thông tin trong dialog
  Widget _buildDetailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(value, style: const TextStyle(color: Colors.black54)),
        ],
      ),
    );
  }
}
