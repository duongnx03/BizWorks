class UserDTO {
  final int id;
  final String email;
  final String password;
  final String role;

  UserDTO({
    required this.id,
    required this.email,
    required this.password,
    required this.role,
  });

  factory UserDTO.fromJson(Map<String, dynamic> json) {
    return UserDTO(
      id: json['id'] as int,
      email: json['email'] as String,
      password: json['password'] as String,
      role: json['role'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'password': password,
      'role': role,
    };
  }
}
