class ViolationTypeDTO {
  final int id;
  final String type;
  final double violationMoney;

  ViolationTypeDTO(
      {required this.id, required this.type, required this.violationMoney});

  factory ViolationTypeDTO.fromJson(Map<String, dynamic> json) {
    return ViolationTypeDTO(
      id: json['id'] is String ? int.parse(json['id']) : json['id'],
      type: json['type'],
      violationMoney: json['violationMoney'] is String
          ? double.parse(json['violationMoney'])
          : json['violationMoney'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'violationMoney': violationMoney,
    };
  }
}
