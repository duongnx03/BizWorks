import 'package:flutter/material.dart';
import 'package:mobile/models/LeaveRequestDTO.dart';
import 'package:mobile/models/LeaveType.dart';
import 'package:mobile/providers/leave_request_provider.dart';
import 'package:mobile/screens/leave_request_screen.dart';
import 'package:provider/provider.dart';

class LeaveRequestForm extends StatefulWidget {
  @override
  _LeaveRequestFormState createState() => _LeaveRequestFormState();
}

class _LeaveRequestFormState extends State<LeaveRequestForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();
  final TextEditingController _reasonController = TextEditingController();
  LeaveType? _selectedLeaveType;
  String? _errorMessage;

  Future<void> _selectDate(BuildContext context, TextEditingController controller, {DateTime? firstDate, DateTime? lastDate}) async {
    DateTime initialDate;
    if (controller.text.isNotEmpty) {
      initialDate = DateTime.tryParse(controller.text)!;
    } else {
      initialDate = DateTime.now();
    }

    if (initialDate.isBefore(firstDate!)) {
      initialDate = firstDate;
    }

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate ?? DateTime(2000),
      lastDate: lastDate ?? DateTime(2101),
    );

    if (picked != null) {
      setState(() {
        controller.text = picked.toLocal().toString().split(' ')[0];
      });
    }
  }



bool _validateForm() {
    final startDate = DateTime.tryParse(_startDateController.text);
    final endDate = DateTime.tryParse(_endDateController.text);
    final reason = _reasonController.text;
    final leaveType = _selectedLeaveType;

    if (startDate == null) {
      setState(() {
        _errorMessage = "Start date is required.";
      });
      return false;
    }
    if (endDate == null) {
      setState(() {
        _errorMessage = "End date is required.";
      });
      return false;
    }
    if (leaveType == null) {
      setState(() {
        _errorMessage = "Leave type is required.";
      });
      return false;
    }
    if (reason.isEmpty) {
      setState(() {
        _errorMessage = "Reason is required.";
      });
      return false;
    }

    setState(() {
      _errorMessage = null;
    });
    return true;
  }

  Future<void> _submitForm() async {
    if (_validateForm()) {
      final leaveRequestsProvider = Provider.of<LeaveRequestProvider>(context, listen: false);
      await leaveRequestsProvider.getLeaveRequestsByEmployee();

      final leaveRequestDTO = LeaveRequestDTO(
        id: 0,
        startDate: DateTime.parse(_startDateController.text),
        endDate: DateTime.parse(_endDateController.text),
        leaveType: _selectedLeaveType!,
        reason: _reasonController.text,
        status: 'Pending',
        employeeName: '',
        employeeId: 0,
      );

      final lastEndDate = leaveRequestsProvider.getLastEndDate();
      if (leaveRequestsProvider.hasDateConflict(leaveRequestDTO)) {
        setState(() {
          _errorMessage = lastEndDate != null
              ? "You can only request leave after ${lastEndDate.toLocal().toString().split(' ')[0]}."
              : "The date of request coincides with the approved or pending leave.";
        });
        return;
      }
      // if (leaveRequestsProvider.hasDateConflict(leaveRequestDTO)) {
      //   if (lastEndDate != null) {
      //     setState(() {
      //       _errorMessage = "You can only request leave after ${lastEndDate.toLocal().toString().split(' ')[0]}.";
      //     });
      //   } else {
      //     setState(() {
      //       _errorMessage = "The date of request coincides with the approved or pending leave.";
      //     });
      //   }
      //   return;
      // }

      final requestedDays = leaveRequestDTO.endDate.difference(leaveRequestDTO.startDate).inDays + 1;
      final maxDays = {
        LeaveType.SICK: 10,
        LeaveType.MATERNITY: 90,
        LeaveType.PERSONAL: 5,
        LeaveType.BEREAVEMENT: 3,
        LeaveType.MARRIAGE: 5,
        LeaveType.CIVIC_DUTY: 10,
        LeaveType.OTHER: double.infinity,
      };

      if (requestedDays > maxDays[leaveRequestDTO.leaveType]!) {
        setState(() {
          _errorMessage = "Cannot request more than ${maxDays[leaveRequestDTO.leaveType]} days for ${leaveRequestDTO.leaveType.description.toLowerCase()}.";
        });
        return;
      }

      try {
        await leaveRequestsProvider.sendLeaveRequest(leaveRequestDTO);

        await leaveRequestsProvider.refreshLeaveRequests();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LeaveRequestScreen()),
        );
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Đơn nghỉ phép đã được gửi thành công.'),
            duration: Duration(seconds: 3),
          ),
        );
      } catch (e) {
        setState(() {
          _errorMessage = "Error occurs when sending an application for leave: $e";
        });
      }
    }
  }




  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text(
                  _errorMessage!,
                  style: TextStyle(color: Colors.red),
                ),
              ),
            TextFormField(
              controller: _startDateController,
              decoration: InputDecoration(
                labelText: 'Start Date',
                prefixIcon: Icon(Icons.date_range),
              ),
              readOnly: true,
              onTap: () {
                _selectDate(context, _startDateController, firstDate: DateTime.now());
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select a start date';
                }
                final startDate = DateTime.tryParse(value);
                final endDate = DateTime.tryParse(_endDateController.text);
                if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
                  return 'Start date cannot be after end date';
                }
                return null;
              },
            ),

            TextFormField(
              controller: _endDateController,
              decoration: InputDecoration(
                labelText: 'End Date',
                prefixIcon: Icon(Icons.date_range),
              ),
              readOnly: true,
              onTap: () {
                final startDate = DateTime.tryParse(_startDateController.text);
                _selectDate(context, _endDateController, firstDate: startDate != null ? startDate.add(Duration(days: 1)) : DateTime.now());
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select an end date';
                }
                final startDate = DateTime.tryParse(_startDateController.text);
                final endDate = DateTime.tryParse(value);
                if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
                  return 'End date cannot be before start date';
                }
                return null;
              },
            ),
            DropdownButtonFormField<LeaveType>(
              decoration: InputDecoration(
                labelText: 'Leave Type',
                prefixIcon: Icon(Icons.category),
              ),
              items: LeaveType.values.map((LeaveType type) {
                return DropdownMenuItem<LeaveType>(
                  value: type,
                  child: Text(type.description),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedLeaveType = value;
                });
              },
              validator: (value) {
                if (value == null) {
                  return 'Please select a leave type';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _reasonController,
              decoration: InputDecoration(
                labelText: 'Reason',
                prefixIcon: Icon(Icons.text_fields),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please provide a reason';
                }
                return null;
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _submitForm,
              child: Text('Send Leave Request'),
            ),
          ],
        ),
      ),
    );
  }
}




