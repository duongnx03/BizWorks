import 'package:flutter/material.dart';
import 'package:mobile/models/ViolationComplaintDTO.dart';
import 'package:mobile/providers/violation_provider.dart';
import 'package:mobile/providers/violation_complaint_provider.dart';
import 'package:provider/provider.dart';

class ViolationScreen extends StatefulWidget {
  const ViolationScreen({super.key});

  @override
  _ViolationScreenState createState() => _ViolationScreenState();
}

class _ViolationScreenState extends State<ViolationScreen> {
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    final violationProvider =
        Provider.of<ViolationProvider>(context, listen: false);
    fetchViolations(violationProvider);
  }

  Future<void> fetchViolations(ViolationProvider violationProvider) async {
    try {
      await violationProvider.fetchViolationsByEmail();
      setState(() {
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching violations: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final violationProvider = Provider.of<ViolationProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Violations'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
        elevation: 1,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : violationProvider.violations.isEmpty
                ? const Center(child: Text('No violations found.'))
                : ListView.builder(
                    itemCount: violationProvider.violations.length,
                    itemBuilder: (context, index) {
                      final violation = violationProvider.violations[index];
                      return Card(
                        elevation: 2,
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        child: ListTile(
                          title: Row(
                            children: [
                              if (violation.status == 'pending') ...[
                                const Icon(
                                  Icons.circle,
                                  color: Colors.red,
                                  size: 12,
                                ),
                                const SizedBox(width: 8),
                              ],
                              Text(violation.violationType.type),
                            ],
                          ),
                          subtitle: Text(
                            'Date: ${violation.violationDate.toLocal().toIso8601String().split('T')[0]}',
                          ),
                          onTap: () {
                            showDialog(
                              context: context,
                              builder: (context) {
                                return AlertDialog(
                                  backgroundColor: Colors.white,
                                  title: Row(
                                    children: [
                                      const Icon(Icons.warning,
                                          color: Colors.red),
                                      const SizedBox(width: 8),
                                      const Text('Violation Details'),
                                    ],
                                  ),
                                  content: SingleChildScrollView(
                                    child: ListBody(
                                      children: <Widget>[
                                        _buildDetailRow(
                                          'Employee:',
                                          violation.employee.fullname,
                                          isBold: true,
                                        ),
                                        _buildDetailRow(
                                          'Description:',
                                          violation.description,
                                        ),
                                        _buildDetailRow(
                                          'Violation Money:',
                                          '\$${violation.violationType.violationMoney.toStringAsFixed(2)}',
                                        ),
                                        _buildDetailRow(
                                          'Status:',
                                          violation.status,
                                        ),
                                        _buildDetailRow(
                                          'Created:',
                                          '${violation.createdAt.toLocal().toIso8601String().split('T')[0]}',
                                        ),
                                      ],
                                    ),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                        _showComplaintDialog(violation);
                                      },
                                      child: const Text('Complaint'),
                                    ),
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

  Widget _buildDetailRow(String title, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title,
              style: TextStyle(
                  fontWeight: isBold ? FontWeight.bold : FontWeight.normal)),
          Text(value, style: const TextStyle(color: Colors.black54)),
        ],
      ),
    );
  }

  void _showComplaintDialog(violation) {
    final _formKey = GlobalKey<FormState>();
    String complaintText = '';

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Submit Complaint'),
          content: Form(
            key: _formKey,
            child: TextFormField(
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Complaint Description',
                hintText: 'Enter your complaint here',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a complaint description';
                }
                return null;
              },
              onChanged: (value) {
                complaintText = value;
              },
            ),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () async {
                if (_formKey.currentState?.validate() == true) {
                  // Sử dụng Builder để có một context chứa provider
                  final violationComplaintProvider =
                      Provider.of<ViolationComplaintProvider>(context,
                          listen: false);

                  // Tạo một ViolationComplaintDTO từ thông tin
                  ViolationComplaintDTO newComplaint = ViolationComplaintDTO(
                    id: 0, // ID sẽ được tạo trên server
                    employee: violation.employee,
                    violation: violation,
                    description: complaintText,
                    status: 'pending', // Hoặc trạng thái phù hợp
                    createdAt: DateTime.now(),
                    updatedAt: DateTime.now(),
                  );

                  try {
                    await violationComplaintProvider
                        .createComplaint(newComplaint);
                    Navigator.of(context)
                        .pop(); // Đóng dialog sau khi thành công
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Complaint submitted successfully.')),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Failed to submit complaint: $e')),
                    );
                  }
                }
              },
              child: const Text('Submit'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Đóng dialog
              },
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );
  }
}
