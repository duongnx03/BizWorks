class EmployeeResponseDTO {
  final int id;
  final String empCode;
  final String fullname;
  final String email;
  final String address;
  final String phone;
  final DateTime? dob; 
  final String avatar;
  final DateTime? startDate;
  final DateTime? endDate; 
  final String gender;
  final String department;
  final String position;

  EmployeeResponseDTO({
    required this.id,
    required this.empCode,
    required this.fullname,
    required this.email,
    required this.address,
    required this.phone,
    this.dob, 
    required this.avatar,
    this.startDate, 
    this.endDate, 
    required this.gender,
    required this.department,
    required this.position,
  });

  factory EmployeeResponseDTO.fromJson(Map<String, dynamic> json) {
    return EmployeeResponseDTO(
      id: json['id'] as int,
      empCode: json['empCode'] ?? '',
      fullname: json['fullname'] ?? '',
      email: json['email'] ?? '',
      address: json['address'] ?? '',
      phone: json['phone'] ?? '',
      dob: json['dob'] != null ? DateTime.tryParse(json['dob']) : null, 
      avatar: json['avatar'] ?? '',
      startDate: json['startDate'] != null ? DateTime.tryParse(json['startDate']) : null, 
      endDate: json['endDate'] != null ? DateTime.tryParse(json['endDate']) : null,
      gender: json['gender'] ?? '',
      department: json['department'] ?? '',
      position: json['position'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id as int?,
      'empCode': empCode,
      'fullname': fullname,
      'email': email,
      'address': address,
      'phone': phone,
      'dob': dob?.toIso8601String(), // Convert DateTime to ISO 8601 string or null
      'avatar': avatar,
      'startDate': startDate?.toIso8601String(), // Convert DateTime to ISO 8601 string or null
      'endDate': endDate?.toIso8601String(), // Convert DateTime to ISO 8601 string or null
      'gender': gender,
      'department': department,
      'position': position,
    };
  }
}
