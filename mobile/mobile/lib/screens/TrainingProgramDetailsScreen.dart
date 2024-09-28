import 'package:flutter/material.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';

class TrainingProgramDetailsScreen extends StatelessWidget {
  final TrainingProgramDTO trainingProgram;

  TrainingProgramDetailsScreen({required this.trainingProgram});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(trainingProgram.title),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Description:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(height: 8.0),
            Text(trainingProgram.description),
            SizedBox(height: 16.0),
            Text(
              'Start Date:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(height: 8.0),
            Text(trainingProgram.startDate.toString()),
            SizedBox(height: 16.0),
            Text(
              'End Date:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(height: 8.0),
            Text(trainingProgram.endDate.toString()),
            SizedBox(height: 16.0),
            Text(
              'Participants:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(height: 8.0),
            Text(trainingProgram.participantIds
                .join(", ")), // Hiển thị participantIds
            SizedBox(height: 16.0),
            Text(
              'Completed:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(height: 8.0),
            Text(trainingProgram.completed ? 'Yes' : 'No'),
          ],
        ),
      ),
    );
  }
}
