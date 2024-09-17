import 'package:flutter/material.dart';
import 'package:mobile/models/AttendanceDTO.dart';
import 'package:mobile/providers/attendance_complaint_provider.dart';
import 'package:mobile/providers/attendance_provider.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/providers/employee_provider.dart';
import 'package:mobile/screens/LoginForm.dart';
import 'package:mobile/screens/attendance_complaint_detail_screen.dart';
import 'package:mobile/screens/attendance_complaint_screen.dart';
import 'package:mobile/screens/attendance_screen.dart';
import 'package:mobile/screens/attendancedata_details_screen.dart';
import 'package:mobile/screens/attendancedata_screen.dart';
import 'package:mobile/screens/complaint_list_screen.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/overtime_screen.dart';
import 'package:mobile/screens/profile_screen.dart';
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
            create: (context) => AttendanceComplaintProvider(dioClient: dioClient)),
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
            return MaterialPageRoute(builder: (context) => const AttendanceScreen());
          case '/attendance-data':
            return MaterialPageRoute(builder: (context) => AttendanceDataScreen());
          case '/profile':
            return MaterialPageRoute(builder: (context) => const ProfileScreen());
          case '/attendance-data-details':
            final data = settings.arguments as AttendanceDTO; // Retrieve the arguments
            return MaterialPageRoute(
              builder: (context) => AttendanceDataDetailsScreen(attendance: data),
            );
          case '/overtime':
            return MaterialPageRoute(builder: (context) => const OvertimeRequestScreen());
          case '/attendance-complaint':
            final data = settings.arguments as AttendanceDTO;
            return MaterialPageRoute(builder: (context) => AttendanceComplaintScreen(attendance: data,));
          case '/attendance-complaint-list':
            return MaterialPageRoute(builder: (context) => ComplaintListScreen());
          case '/attendance-complaint-detail':
            return MaterialPageRoute(builder: (context) => const ComplaintDetailScreen());
          default:
            return MaterialPageRoute(builder: (context) => const LoginForm());
        }
      },
    );
  }
}
