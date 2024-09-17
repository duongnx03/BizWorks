import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:mobile/providers/attendance_provider.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({Key? key}) : super(key: key);

  @override
  _AttendanceScreenState createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  late String _currentTime;
  late Future<void> _futureWorkAndOvertime;

  @override
  void initState() {
    super.initState();

    // Cập nhật thời gian hiển thị mỗi giây
    _updateTime();
    Timer.periodic(Duration(seconds: 1), (timer) {
      _updateTime();
    });

    _futureWorkAndOvertime =
        Provider.of<AttendanceProvider>(context, listen: false)
            .fetchTotalWorkAndOvertime();

    Provider.of<AttendanceProvider>(context, listen: false)
        .fetchAttendanceByEmailAndDate();
  }

  void _updateTime() {
    final now = DateTime.now();
    setState(() {
      _currentTime = DateFormat('dd/MM/yyyy HH:mm:ss').format(now);
    });
  }

  bool _canCheckIn() {
    final now = DateTime.now();
    return now.hour > 7 || (now.hour == 7 && now.minute >= 55);
  }

  bool _canCheckOut() {
    final now = DateTime.now();
    return now.hour > 16 || (now.hour == 16 && now.minute >= 55);
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error, color: Colors.white),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ],
        ),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        margin: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final attendanceProvider = Provider.of<AttendanceProvider>(context);
    final hasCheckedIn = attendanceProvider.hasCheckedInToday();
    final hasCheckedOut = attendanceProvider.hasCheckedOutToday();
    final checkInTime = attendanceProvider.checkInTime;
    final checkOutTime = attendanceProvider.checkOutTime;

    String displayTime = '00:00';
    if (hasCheckedIn && checkInTime != null) {
      final now = DateTime.now();
      DateTime endTime = checkOutTime ?? now;
      final duration = endTime.difference(checkInTime);
      final hours = duration.inHours;
      final minutes = (duration.inMinutes % 60).toString().padLeft(2, '0');
      displayTime = '$hours:$minutes';
    }
    if (attendanceProvider.errorMessage.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error, color: Colors.white),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    attendanceProvider.errorMessage,
                    style: const TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 3),
            margin: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
        attendanceProvider.clearErrorMessage();
      });
    }

    if (attendanceProvider.successMessage.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    attendanceProvider.successMessage,
                    style: const TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.lightGreen,
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 3),
            margin: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
        attendanceProvider.clearSuccessMessage();
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                elevation: 4,
                child: ListTile(
                  title: Text(
                    _currentTime,
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  trailing: const Icon(Icons.access_time),
                ),
              ),
              const SizedBox(height: 20),
              hasCheckedIn
                  ? Container(
                      width: 150,
                      height: 150,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                            color: const Color(0xFFE2E4E6), width: 8),
                      ),
                      child: Center(
                        child: Text(
                          displayTime,
                          style: const TextStyle(
                            fontSize: 20,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    )
                  : Container(
                      width: 150,
                      height: 150,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                            color: const Color(0xFFE2E4E6), width: 8),
                      ),
                      child: const Center(
                        child: Text(
                          '00:00',
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
              const SizedBox(height: 32),
              hasCheckedIn
                  ? hasCheckedOut
                      ? ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey,
                            minimumSize: const Size(double.infinity, 50),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Checked',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                        )
                      : ElevatedButton(
                          onPressed: _canCheckOut()
                              ? () async {
                                  await Provider.of<AttendanceProvider>(context,
                                          listen: false)
                                      .openCameraAndCheckOut(context);
                                }
                              : () {
                                  _showSnackBar(
                                      'Check Out is only allowed after 4:55 PM');
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF902F),
                            minimumSize: const Size(double.infinity, 50),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Check Out',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                        )
                  : ElevatedButton(
                      onPressed: _canCheckIn()
                          ? () async {
                              await Provider.of<AttendanceProvider>(context,
                                      listen: false)
                                  .openCameraAndCheckIn(context);
                            }
                          : () {
                              _showSnackBar(
                                  'Check In is only allowed after 7:55 AM');
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF902F),
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Check In',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                        ),
                      ),
                    ),
              const SizedBox(height: 20),
              FutureBuilder<void>(
                future: _futureWorkAndOvertime,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return const Center(child: Text('Error loading data'));
                  } else {
                    final report = attendanceProvider.report;
                    int getHours(String time) {
                      final parts = time.split(':');
                      final hours = double.tryParse(parts[0]) ?? 0;
                      final minutes = double.tryParse(parts[1]) ?? 0;
                      final totalHours = hours + (minutes / 60);
                      return totalHours.round();
                    }

                    return report != null
                        ? Card(
                            elevation: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Statistics',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                      'This Week: ${getHours(report.totalWorkTimeInWeek)} / 40 hrs'),
                                  const SizedBox(height: 5),
                                  LinearProgressIndicator(
                                    value:
                                        (getHours(report.totalWorkTimeInWeek) /
                                                40)
                                            .clamp(0.0, 1.0),
                                    backgroundColor: Colors.grey[300],
                                    color: Colors.orange,
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                      'This Month: ${getHours(report.totalWorkTimeInMonth)} / 160 hrs'),
                                  LinearProgressIndicator(
                                    value:
                                        (getHours(report.totalWorkTimeInMonth) /
                                                160)
                                            .clamp(0.0, 1.0),
                                    backgroundColor: Colors.grey[300],
                                    color: Colors.green,
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                      'Overtime in Month: ${getHours(report.totalOvertimeInMonth)} / 8 hrs'),
                                  const SizedBox(height: 5),
                                  LinearProgressIndicator(
                                    value:
                                        (getHours(report.totalOvertimeInMonth) /
                                                8)
                                            .clamp(0.0, 1.0),
                                    backgroundColor: Colors.grey[300],
                                    color: Colors.blue,
                                  ),
                                ],
                              ),
                            ),
                          )
                        : const Center(
                            child: Text('No data available'),
                          );
                  }
                },
              ),
              const SizedBox(height: 20),
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Today Activity',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      attendanceProvider.hasCheckedInToday()
                          ? ListTile(
                              leading: const Icon(Icons.login),
                              title: const Text('Check In at'),
                              subtitle: Text(DateFormat('dd/MM/yyyy HH:mm:ss')
                                  .format(attendanceProvider.checkInTime!)),
                            )
                          : const ListTile(
                              leading: Icon(Icons.do_not_disturb),
                              title: Text('No activity yet'),
                            ),
                      attendanceProvider.hasCheckedOutToday()
                          ? ListTile(
                              leading: const Icon(Icons.logout),
                              title: const Text('Check Out at'),
                              subtitle: Text(DateFormat('dd/MM/yyyy HH:mm:ss')
                                  .format(attendanceProvider.checkOutTime!)),
                            )
                          : const SizedBox.shrink(),
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
}
