import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/OvertimeDTO.dart';

class OvertimeDetailsScreen extends StatelessWidget {
  final OvertimeDTO? overtime;

  const OvertimeDetailsScreen({this.overtime});

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
              _buildStatusAndActionButtons(overtime!.status, context),
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
                          overtime!.attendanceDTO!.attendanceDate != null
                              ? DateFormat('MM/dd/yyyy').format(
                                  overtime!.attendanceDTO!.attendanceDate!)
                              : "N/A"),
                      _buildInfoRow(
                          'Overtime Start:',
                          overtime!.overtimeStart != null
                              ? formatDuration(overtime!.overtimeStart!)
                              : "N/A"),
                      _buildInfoRow(
                          'Overtime End:',
                          overtime!.overtimeEnd != null
                              ? formatDuration(overtime!.overtimeEnd!)
                              : "N/A"),
                      _buildInfoRow(
                        'Check Out Time: ',
                        overtime!.checkOutTime != null
                            ? DateFormat('HH:mm')
                                .format(overtime!.checkOutTime!)
                            : "N/A",
                      ),
                      _buildInfoRow(
                          'Total Time: ', formatDuration(overtime!.totalTime)),
                      _buildInfoRow('Reason: ',
                          overtime!.reason!),
                      _buildInfoRow('Note: ',
                          getType(overtime!.type)),
                    ],
                  ),
                ),
              ),
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
