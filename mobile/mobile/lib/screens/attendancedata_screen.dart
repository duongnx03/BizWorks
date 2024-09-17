import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:mobile/screens/attendancedata_details_screen.dart'; // To navigate to details screen
import 'package:mobile/providers/attendance_provider.dart'; // Assuming you have a provider
import 'package:month_picker_dialog/month_picker_dialog.dart';
import 'package:provider/provider.dart'; // For Provider usage

class AttendanceDataScreen extends StatefulWidget {
  @override
  _AttendanceDataScreenState createState() => _AttendanceDataScreenState();
}

class _AttendanceDataScreenState extends State<AttendanceDataScreen> {
  DateTime _selectedDate = DateTime.now();
  List<AttendanceDTO> _attendanceData = [];
  String _status = 'Loading'; // Status for the request

  @override
  void initState() {
    super.initState();
    _fetchAttendanceData(); // Fetch data when screen initializes
  }

  Future<void> _fetchAttendanceData() async {
    final month = _selectedDate.month.toInt();
    final year = _selectedDate.year.toInt();

    setState(() {
      _status = 'Loading';
    });

    try {
      await Provider.of<AttendanceProvider>(context, listen: false)
          .fetchAttendancesForMonth(month, year);

      final attendanceProvider =
          Provider.of<AttendanceProvider>(context, listen: false);
      setState(() {
        _attendanceData = attendanceProvider.attendanceList;
        _status = 'Loaded';
      });
    } catch (e) {
      setState(() {
        _status = 'Error';
      });
      print('Error fetching attendance data: $e');
    }
  }

  Future<void> _selectMonthYear(BuildContext context) async {
    final DateTime? picked = await showMonthPicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );

    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      _fetchAttendanceData();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Attendance Data'),
        backgroundColor: const Color(0xFFFF902F),
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    DateFormat('MMMM yyyy').format(_selectedDate),
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.calendar_today),
                  onPressed: () => _selectMonthYear(context),
                ),
              ],
            ),
            if (_status == 'Loading') CircularProgressIndicator(),
            if (_status == 'Error') Text('Error loading data'),
            if (_status == 'Loaded')
              Expanded(
                child: ListView.builder(
                  itemCount: _attendanceData.length,
                  itemBuilder: (context, index) {
                    final data = _attendanceData[index];
                    final date = data.attendanceDate != null
                        ? DateFormat('yyyy-MM-dd').format(data.attendanceDate!)
                        : 'No Date';
                    return Card(
                      elevation: 4,
                      margin: EdgeInsets.symmetric(vertical: 8),
                      child: ListTile(
                        contentPadding: EdgeInsets.all(16),
                        leading: Icon(
                          data.status == 'Present'
                              ? Icons.check_circle
                              : data.status == 'Absent'
                                  ? Icons.cancel
                                  : Icons.hourglass_empty,
                          color: data.status == 'Present'
                              ? Colors.green
                              : data.status == 'Absent'
                                  ? Colors.red
                                  : Colors.yellow,
                        ),
                        title: Text(date),
                        trailing: ElevatedButton(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) =>
                                    AttendanceDataDetailsScreen(attendance: data,),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF902F),
                            foregroundColor: Colors.white,
                          ),
                          child: Text('Detail'),
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
