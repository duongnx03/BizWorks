import 'package:flutter/material.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:mobile/models/JobPostingDTO.dart';
import 'package:mobile/models/TrainingProgramDTO.dart';
import 'package:mobile/providers/attendance_complaint_provider.dart';
import 'package:mobile/providers/attendance_provider.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/providers/employee_provider.dart';
import 'package:mobile/providers/job_application_provider.dart';
import 'package:mobile/providers/job_posting.provider.dart';
import 'package:mobile/providers/leave_request_provider.dart';
import 'package:mobile/providers/overtime_provider.dart';
import 'package:mobile/providers/salary_provider.dart';
import 'package:mobile/providers/training_program_provider.dart';
import 'package:mobile/providers/violation_complaint_provider.dart';
import 'package:mobile/providers/violation_provider.dart';
import 'package:mobile/screens/LoginForm.dart';
import 'package:mobile/screens/job_posting_detail.dart';
import 'package:mobile/screens/job_posting_screen.dart';
import 'package:mobile/screens/attendance_complaint_detail_screen.dart';
import 'package:mobile/screens/attendance_complaint_screen.dart';
import 'package:mobile/screens/attendance_screen.dart';
import 'package:mobile/screens/attendancedata_details_screen.dart';
import 'package:mobile/screens/attendancedata_screen.dart';
import 'package:mobile/screens/complaint_list_screen.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/leave_request_screen.dart';
import 'package:mobile/screens/overtime_details_screen.dart';
import 'package:mobile/screens/overtime_list_screen.dart';
import 'package:mobile/screens/overtime_screen.dart';
import 'package:mobile/screens/profile_screen.dart';
import 'package:mobile/screens/salary_screen.dart';
import 'package:mobile/screens/training_program_details_screen.dart';
import 'package:mobile/screens/training_program_screen.dart';
import 'package:mobile/screens/violation_screen.dart';
import 'package:mobile/services/dio_client.dart';
import 'package:provider/provider.dart';

void main() {
  final dioClient = DioClient();
  runApp(
    MultiProvider(
      providers: [
        Provider<DioClient>.value(value: dioClient),
        ChangeNotifierProvider(
            create: (context) => AuthProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => EmployeeProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => AttendanceProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) =>
                AttendanceComplaintProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => OvertimeProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => JobPostingProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => JobApplicationProvider(
                dioClient: dioClient)), // Thêm JobPostingProvider
        ChangeNotifierProvider(
            create: (context) => ViolationProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) =>
                ViolationComplaintProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => SalaryProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => LeaveRequestProvider(dioClient: dioClient)),
        ChangeNotifierProvider(
            create: (context) => TrainingProgramProvider(dioClient: dioClient)),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: "/",
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (context) => const LoginForm());
          case '/home':
            return MaterialPageRoute(builder: (context) => const HomeScreen());
          case '/attendance':
            return MaterialPageRoute(
                builder: (context) => const AttendanceScreen());
          case '/attendance-data':
            return MaterialPageRoute(
                builder: (context) => AttendanceDataScreen());
          case '/profile':
            return MaterialPageRoute(
                builder: (context) => const ProfileScreen());
          case '/attendance-data-details':
            final data =
                settings.arguments as AttendanceDTO; // Retrieve the arguments
            return MaterialPageRoute(
              builder: (context) =>
                  AttendanceDataDetailsScreen(attendance: data),
            );
          case '/overtime':
            final data = settings.arguments as AttendanceDTO;
            return MaterialPageRoute(
                builder: (context) => OvertimeRequestScreen(attendance: data));
          case '/attendance-complaint':
            final data = settings.arguments as AttendanceDTO;
            return MaterialPageRoute(
                builder: (context) => AttendanceComplaintScreen(
                      attendance: data,
                    ));
          case '/attendance-complaint-list':
            return MaterialPageRoute(
                builder: (context) => ComplaintListScreen());
          case '/attendance-complaint-detail':
            return MaterialPageRoute(
                builder: (context) => const ComplaintDetailScreen());
          case '/overtime-list':
            return MaterialPageRoute(
                builder: (context) => OvertimeListScreen());
          case '/overtime-detail':
            return MaterialPageRoute(
                builder: (context) => const OvertimeDetailsScreen());
          case '/job-posting': // Thêm route cho JobPostingScreen
            return MaterialPageRoute(builder: (context) => JobPostingScreen());
          case '/job-posting-details':
            final jobPosting = settings.arguments as JobPostingDTO;
            return MaterialPageRoute(
              builder: (context) =>
                  JobPostingDetails(jobPostingDTO: jobPosting),
            );
          case '/violation': // Thêm route cho ViolationScreen
            return MaterialPageRoute(
                builder: (context) => const ViolationScreen());
          case '/salary': // Thêm route cho ViolationScreen
            return MaterialPageRoute(
                builder: (context) => const SalaryScreen());
          case '/leave-requests':
            return MaterialPageRoute(
                builder: (context) => LeaveRequestScreen());
          case '/training-program': // Thêm route cho TrainingProgramScreen
            return MaterialPageRoute(
                builder: (context) =>
                    TrainingProgramScreen()); // Tạo mới TrainingProgramScreen
          case '/training-program-details':
            final trainingProgram = settings.arguments as TrainingProgramDTO;
            return MaterialPageRoute(
              builder: (context) => TrainingProgramDetailsScreen(
                  trainingProgram: trainingProgram),
            );
          default:
            return MaterialPageRoute(builder: (context) => const LoginForm());
        }
      },
    );
  }
}
