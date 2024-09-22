import 'package:flutter/material.dart';
import 'package:mobile/models/JobPostingDTO.dart';
import 'package:mobile/providers/job_posting.provider.dart';
import 'package:provider/provider.dart';

class JobPostingScreen extends StatefulWidget {
  @override
  _JobPostingScreenState createState() => _JobPostingScreenState();
}

class _JobPostingScreenState extends State<JobPostingScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch job postings when the screen is initialized
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<JobPostingProvider>(context, listen: false)
          .fetchJobPostings();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Job Postings'),
      ),
      body: Consumer<JobPostingProvider>(
        builder: (context, jobPostingProvider, child) {
          if (jobPostingProvider.jobPostings == null) {
            return Center(child: CircularProgressIndicator());
          }
          if (jobPostingProvider.jobPostings!.isEmpty) {
            return Center(child: Text('No job postings available.'));
          }
          return ListView.builder(
            itemCount: jobPostingProvider.jobPostings!.length,
            itemBuilder: (context, index) {
              JobPostingDTO jobPosting = jobPostingProvider.jobPostings![index];
              return Card(
                margin: EdgeInsets.all(8.0),
                child: ListTile(
                  title: Text(jobPosting.title),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Location: ${jobPosting.location}'),
                      Text('Posted on: ${jobPosting.postedDate}'),
                      Text('Deadline: ${jobPosting.deadline}'),
                    ],
                  ),
                  onTap: () {
                    // Navigate to Job Posting details page
                    Navigator.pushNamed(
                      context,
                      '/job-posting-details',
                      arguments:
                          jobPosting, // Truyền đối tượng JobPostingDTO đã chọn
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
