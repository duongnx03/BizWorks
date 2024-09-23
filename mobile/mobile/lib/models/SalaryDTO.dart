import 'package:mobile/models/EmployeeResponseDTO.dart';

class SalaryDTO {
  final int id;
  final String salaryCode;
  final int month;
  final int year;
  final double basicSalary;
  final double bonusSalary;
  final double overtimeSalary;
  final double advanceSalary;
  final double allowances;
  final double deductions;
  final double totalSalary;
  final String? dateSalary;
  final List<EmployeeResponseDTO> employees;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String status;
  final String? notes;
  final String createdBy;
  final String updatedBy;

  SalaryDTO({
    required this.id,
    required this.salaryCode,
    required this.month,
    required this.year,
    required this.basicSalary,
    required this.bonusSalary,
    required this.overtimeSalary,
    required this.advanceSalary,
    required this.allowances,
    required this.deductions,
    required this.totalSalary,
    this.dateSalary,
    required this.employees,
    required this.createdAt,
    required this.updatedAt,
    required this.status,
    this.notes,
    required this.createdBy,
    required this.updatedBy,
  });

  factory SalaryDTO.fromJson(Map<String, dynamic> json) {
    print('Processing SalaryDTO: $json'); // Kiểm tra giá trị JSON
    var employeeList = json['employees'] as List;
    List<EmployeeResponseDTO> employeeDTOs =
        employeeList.map((e) => EmployeeResponseDTO.fromJson(e)).toList();

    return SalaryDTO(
      id: json['id'],
      salaryCode: json['salaryCode'],
      month: json['month'],
      year: json['year'],
      basicSalary: json['basicSalary'],
      bonusSalary: json['bonusSalary'],
      overtimeSalary: json['overtimeSalary'],
      advanceSalary: json['advanceSalary'],
      allowances: json['allowances'],
      deductions: json['deductions'],
      totalSalary: json['totalSalary'],
      dateSalary: json['dateSalary'],
      employees: employeeDTOs,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      status: json['status'],
      notes: json['notes'],
      createdBy: json['createdBy'],
      updatedBy: json['updatedBy'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'salaryCode': salaryCode,
      'month': month,
      'year': year,
      'basicSalary': basicSalary,
      'bonusSalary': bonusSalary,
      'overtimeSalary': overtimeSalary,
      'advanceSalary': advanceSalary,
      'allowances': allowances,
      'deductions': deductions,
      'totalSalary': totalSalary,
      'dateSalary': dateSalary,
      'employees': employees.map((e) => e.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'status': status,
      'notes': notes,
      'createdBy': createdBy,
      'updatedBy': updatedBy,
    };
  }
}
