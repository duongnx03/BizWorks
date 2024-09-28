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
    final _formKey = GlobalKey<FormState>();
    String applicantName = '';
    String applicantEmail = '';
    String applicantPhone = '';
    String? resumeFilePath;

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Submit Job Application'),
          content: Form(
            key: _formKey,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Name'),
                    onChanged: (value) => applicantName = value,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Email'),
                    onChanged: (value) => applicantEmail = value,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Phone'),
                    onChanged: (value) => applicantPhone = value,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your phone number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () async {
                      final result = await FilePicker.platform.pickFiles(
                        allowMultiple: false,
                        type: FileType.custom,
                        allowedExtensions: ['pdf', 'doc', 'docx'],
                      );
                      if (result != null) {
                        resumeFilePath = result.files.single.path;
                      }
                    },
                    child: Text(
                      resumeFilePath == null
                          ? 'Upload Resume'
                          : 'Resume Selected: ${resumeFilePath!.split('/').last}',
                      style: TextStyle(color: Theme.of(context).primaryColor),
                    ),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                if (_formKey.currentState!.validate() &&
                    resumeFilePath != null) {
                  final provider = Provider.of<JobApplicationProvider>(context,
                      listen: false);
                  provider.submitJobApplication(
                    applicantName,
                    applicantEmail,
                    applicantPhone,
                    resumeFilePath!,
                    jobPostingDTO.id,
                  );

                  Navigator.of(context).pop();

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Application submitted successfully')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text(
                            'Please complete the form and upload your resume.')),
                  );
                }
              },
              child: const Text('Submit'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );
  }
}
