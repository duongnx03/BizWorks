import 'package:flutter/material.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';
import 'package:mobile/providers/training_program_provider.dart';
import 'package:provider/provider.dart';

class TrainingProgramScreen extends StatefulWidget {
  @override
  _TrainingProgramScreenState createState() => _TrainingProgramScreenState();
}

class _TrainingProgramScreenState extends State<TrainingProgramScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch training programs when the screen is initialized
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<TrainingProgramProvider>(context, listen: false)
          .fetchTrainingPrograms();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Training Programs'),
      ),
      body: Consumer<TrainingProgramProvider>(
        builder: (context, trainingProgramProvider, child) {
          if (trainingProgramProvider.trainingPrograms == null) {
            return Center(child: CircularProgressIndicator());
          }
          if (trainingProgramProvider.trainingPrograms!.isEmpty) {
            return Center(child: Text('No training programs available.'));
          }
          return ListView.builder(
            itemCount: trainingProgramProvider.trainingPrograms!.length,
            itemBuilder: (context, index) {
              TrainingProgramDTO trainingProgram =
                  trainingProgramProvider.trainingPrograms![index];
              return Card(
                margin: EdgeInsets.all(8.0),
                child: ListTile(
                  title: Text(trainingProgram.title),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Description: ${trainingProgram.description}'),
                      Text('Start Date: ${trainingProgram.startDate}'),
                      Text('End Date: ${trainingProgram.endDate}'),
                      Text(
                          'Participants: ${trainingProgram.participantIds.join(", ")}'), // Hiển thị IDs
                    ],
                  ),
                  onTap: () {
                    // Navigate to Training Program details page
                    Navigator.pushNamed(
                      context,
                      '/training-program-details',
                      arguments:
                          trainingProgram, // Truyền đối tượng TrainingProgramDTO đã chọn
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
