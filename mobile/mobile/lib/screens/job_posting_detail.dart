import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/JobPostingDTO.dart';
import 'package:mobile/providers/job_application_provider.dart';
import 'package:provider/provider.dart';

class JobPostingDetails extends StatelessWidget {
  final JobPostingDTO jobPostingDTO;

  const JobPostingDetails({Key? key, required this.jobPostingDTO})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(jobPostingDTO.title),
        backgroundColor: const Color(0xFFFF902F),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                jobPostingDTO.title,
                style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Location: ${jobPostingDTO.location}',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      'Type: ${jobPostingDTO.employmentType}',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Salary: \$${jobPostingDTO.salaryRangeMin} - \$${jobPostingDTO.salaryRangeMax}',
                style: const TextStyle(fontSize: 16, color: Colors.black54),
              ),
              const SizedBox(height: 16),
              const Divider(thickness: 2, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                'Description:',
                style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87),
              ),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.all(16),
                child: Text(
                  jobPostingDTO.description,
                  style: const TextStyle(fontSize: 16, color: Colors.black87),
                ),
              ),
              const SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: () => _showApplicationDialog(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFF902F),
                    padding: const EdgeInsets.symmetric(
                        vertical: 16.0, horizontal: 32.0),
                    textStyle: const TextStyle(fontSize: 18),
                  ),
                  child: const Text('Apply Now'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showApplicationDialog(BuildContext context) {
    // ... (phần còn lại của phương thức không thay đổi)
  }
}
