import 'package:flutter/material.dart';
import 'package:mobile/models/LeaveRequestDTO.dart';
import 'package:mobile/models/LeaveType.dart';
import 'package:mobile/models/SearchDTO.dart';
import 'package:mobile/providers/leave_request_provider.dart';
import 'package:mobile/screens/LeaveRequestForm.dart';
import 'package:mobile/services/dio_client.dart';

class LeaveRequestScreen extends StatefulWidget {
  @override
  _LeaveRequestScreenState createState() => _LeaveRequestScreenState();
}

class _LeaveRequestScreenState extends State<LeaveRequestScreen> {
  late LeaveRequestProvider leaveRequestService;
  late Future<List<LeaveRequestDTO>> _leaveRequests;

  // Khai báo biến cho tìm kiếm
  DateTime? _startDate;
  DateTime? _endDate;
  String? _selectedLeaveType;
  String? _selectedStatus;

  @override
  void initState() {
    super.initState();

    final dioClient = DioClient();
    leaveRequestService = LeaveRequestProvider(dioClient: dioClient);
    _leaveRequests = leaveRequestService.getLeaveRequestsByEmployee();
  }

  void _openLeaveRequestForm() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          child: LeaveRequestForm(),
        );
      },
    );
  }

  void clearSearchFilters() {
    setState(() {
      _startDate = null;
      _endDate = null;
      _selectedLeaveType = null;
      _selectedStatus = null;
    });
  }

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: isStartDate ? (_startDate ?? DateTime.now()) : (_endDate ?? DateTime.now()),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );

    if (pickedDate != null) {
      setState(() {
        if (isStartDate) {
          _startDate = pickedDate;
        } else {
          _endDate = pickedDate;
        }
      });
    }
  }

  void _searchLeaveRequests() {
    final searchDto = SearchDTO(
      startDate: _startDate,
      endDate: _endDate,
      leaveType: _selectedLeaveType == 'All' ? null : _selectedLeaveType,
      status: _selectedStatus == 'All' ? null : _selectedStatus,
    );

    setState(() {
      _leaveRequests = leaveRequestService.searchLeaveRequests(searchDto);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Leave Requests'),
      ),
      body: Column(
        children: [
          // Padding(
          //   padding: EdgeInsets.all(16.0),
          //   child: Text(
          //     'Search Leave Requests',
          //     style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          //   ),
          // ),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Text("Start Date: "),
                          TextButton(
                            onPressed: () => _selectDate(context, true),
                            child: Text(_startDate != null ? _startDate.toString().split(' ')[0] : 'Select Date'),
                          ),
                          SizedBox(width: 16),
                          Text("End Date: "),
                          TextButton(
                            onPressed: () => _selectDate(context, false),
                            child: Text(_endDate != null ? _endDate.toString().split(' ')[0] : 'Select Date'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: DropdownButton<String>(
                        hint: Text('Select Leave Type'),
                        value: _selectedLeaveType,
                        onChanged: (value) {
                          setState(() {
                            _selectedLeaveType = value;
                            // Nếu chọn lại, đặt lại giá trị thành null
                            if (value == 'All') {
                              _selectedLeaveType = null;
                            }
                          });
                        },
                        items: ['All', 'SICK', 'MATERNITY', 'PERSONAL', 'BEREAVEMENT', 'MARRIAGE', 'CIVIC_DUTY', 'OTHER']
                            .map((type) => DropdownMenuItem(
                          value: type,
                          child: Text(type),
                        ))
                            .toList(),
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: DropdownButton<String>(
                        hint: Text('Select Status'),
                        value: _selectedStatus,
                        onChanged: (value) {
                          setState(() {
                            _selectedStatus = value;
                            // Nếu chọn lại, đặt lại giá trị thành null
                            if (value == 'All') {
                              _selectedStatus = null;
                            }
                          });
                        },
                        items: ['All', 'Pending', 'Approved', 'Rejected']
                            .map((status) => DropdownMenuItem(
                          value: status,
                          child: Text(status),
                        ))
                            .toList(),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ElevatedButton(
                      onPressed: _searchLeaveRequests,
                      child: Text('Search'),
                    ),
                    ElevatedButton(
                      onPressed: clearSearchFilters,
                      child: Text('Clear'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: 20),
          // Tiêu đề phần lịch sử yêu cầu
          // Padding(
          //   padding: EdgeInsets.all(16.0),
          //   child: Text(
          //     'Leave Requests History',
          //     style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          //   ),
          // ),
          Expanded(
            child: FutureBuilder<List<LeaveRequestDTO>>(
              future: _leaveRequests,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  print('Error fetching leave requests: ${snapshot.error}');
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No leave requests found'));
                } else {
                  // Sort the leave requests
                  List<LeaveRequestDTO> sortedRequests = snapshot.data!;
                  sortedRequests.sort((a, b) {
                    int statusComparison = _getStatusOrder(a.status).compareTo(_getStatusOrder(b.status));
                    if (statusComparison != 0) {
                      return statusComparison;
                    } else {
                      return b.startDate.compareTo(a.startDate);
                    }
                  });

                  return ListView.builder(
                    itemCount: sortedRequests.length,
                    itemBuilder: (context, index) {
                      final leaveRequest = sortedRequests[index];
                      return ListTile(
                        title: Text(leaveRequest.leaveType.description),
                        subtitle: Text(
                          '${leaveRequest.startDate.toLocal().toString().split(' ')[0]} - ${leaveRequest.endDate.toLocal().toString().split(' ')[0]}',
                        ),
                        trailing: Text(
                          leaveRequest.status,
                          style: TextStyle(
                            color: _getStatusColor(leaveRequest.status),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      );
                    },
                  );
                }
              },
            ),
          ),
          Positioned(
            bottom: 16,
            right: 16,
            child: FloatingActionButton(
              onPressed: _openLeaveRequestForm,
              child: Icon(Icons.add),
            ),
          ),
        ],
      ),
    );
  }

  int _getStatusOrder(String status) {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Approved':
        return 2;
      case 'Rejected':
        return 3;
      default:
        return 4;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Pending':
        return Colors.orange;
      case 'Approved':
        return Colors.green;
      case 'Rejected':
        return Colors.red;
      default:
        return Colors.black;
    }
  }
}



