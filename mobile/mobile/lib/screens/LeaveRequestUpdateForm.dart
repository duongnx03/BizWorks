import 'package:flutter/material.dart';
import 'package:mobile/models/LeaveRequestDTO.dart';
import 'package:mobile/models/LeaveType.dart';
import 'package:mobile/providers/leave_request_provider.dart';
import 'package:provider/provider.dart';

class LeaveRequestUpdateForm extends StatefulWidget {
  final LeaveRequestDTO leaveRequest;

  LeaveRequestUpdateForm({required this.leaveRequest});

  @override
  _LeaveRequestUpdateFormState createState() => _LeaveRequestUpdateFormState();
}

class _LeaveRequestUpdateFormState extends State<LeaveRequestUpdateForm> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  late TextEditingController _reasonController;
  late LeaveType _selectedLeaveType;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _startDateController = TextEditingController(text: widget.leaveRequest.startDate.toLocal().toString().split(' ')[0]);
    _endDateController = TextEditingController(text: widget.leaveRequest.endDate.toLocal().toString().split(' ')[0]);
    _reasonController = TextEditingController(text: widget.leaveRequest.reason);
    _selectedLeaveType = widget.leaveRequest.leaveType;
  }

  Future<void> _selectDate(BuildContext context, TextEditingController controller, {DateTime? firstDate}) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.parse(controller.text),
      firstDate: firstDate ?? DateTime.now(),
      lastDate: DateTime(2101),
    );

    if (picked != null) {
      setState(() {
        controller.text = picked.toLocal().toString().split(' ')[0];
      });
    }
  }

  bool _validateDates() {
    final startDate = DateTime.parse(_startDateController.text);
    final endDate = DateTime.parse(_endDateController.text);

    if (endDate.isBefore(startDate)) {
      setState(() {
        _errorMessage = "End date cannot be before start date.";
      });
      return false;
    }

    final leaveRequestsProvider = Provider.of<LeaveRequestProvider>(context, listen: false);
    final conflictingRequests = leaveRequestsProvider.getApprovedOrPendingRequests().where((request) {
      return request.id != widget.leaveRequest.id && 
          !(endDate.isBefore(request.startDate) || startDate.isAfter(request.endDate));
    }).toList();

    if (conflictingRequests.isNotEmpty) {
      final conflictingDates = conflictingRequests.map((request) {
        return "${request.startDate.toLocal().toString().split(' ')[0]} - ${request.endDate.toLocal().toString().split(' ')[0]}";
      }).join(", ");
      setState(() {
        _errorMessage = "Date conflict with existing requests: $conflictingDates";
      });
      return false;
    }

    return true;
  }

  void _updateLeaveRequest() async {
    if (_formKey.currentState!.validate() && _validateDates()) {
      final leaveRequestsProvider = Provider.of<LeaveRequestProvider>(context, listen: false);

      final updatedLeaveRequest = LeaveRequestDTO(
        id: widget.leaveRequest.id,
        startDate: DateTime.parse(_startDateController.text),
        endDate: DateTime.parse(_endDateController.text),
        leaveType: _selectedLeaveType,
        reason: _reasonController.text,
        status: widget.leaveRequest.status,
        employeeName: widget.leaveRequest.employeeName,
        employeeId: widget.leaveRequest.employeeId,
      );

      try {
        final requestedDays = updatedLeaveRequest.endDate.difference(updatedLeaveRequest.startDate).inDays + 1;
        final maxDays = {
          LeaveType.SICK: 10,
          LeaveType.MATERNITY: 90,
          LeaveType.PERSONAL: 5,
          LeaveType.BEREAVEMENT: 3,
          LeaveType.MARRIAGE: 5,
          LeaveType.CIVIC_DUTY: 10,
          LeaveType.OTHER: double.infinity,
        };

        if (requestedDays > maxDays[updatedLeaveRequest.leaveType]!) {
          setState(() {
            _errorMessage = "Cannot request more than ${maxDays[updatedLeaveRequest.leaveType]} days for ${updatedLeaveRequest.leaveType.description.toLowerCase()}.";
          });
          return;
        }

        await leaveRequestsProvider.updateLeaveRequest(widget.leaveRequest.id, updatedLeaveRequest);
        Navigator.of(context).pop(true); 
      } catch (e) {
        setState(() {
          _errorMessage = "Error updating leave request: ${e.toString()}";
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
              decoration: InputDecoration(labelText: 'Start Date'),
              readOnly: true,
              onTap: () => _selectDate(context, _startDateController),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select a start date';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _endDateController,
              decoration: InputDecoration(labelText: 'End Date'),
              readOnly: true,
              onTap: () => _selectDate(context, _endDateController, firstDate: DateTime.parse(_startDateController.text)),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select an end date';
                }
                return null;
              },
            ),
            DropdownButtonFormField<LeaveType>(
              value: _selectedLeaveType,
              decoration: InputDecoration(labelText: 'Leave Type'),
              items: LeaveType.values.map((LeaveType type) {
                return DropdownMenuItem<LeaveType>(
                  value: type,
                  child: Text(type.description),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedLeaveType = value!;
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
              decoration: InputDecoration(labelText: 'Reason'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please provide a reason';
                }
                return null;
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _updateLeaveRequest,
              child: Text('Update Leave Request'),
            ),
          ],
        ),
      ),
    );
  }
}