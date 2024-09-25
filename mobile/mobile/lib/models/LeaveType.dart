enum LeaveType {
  SICK,
  MATERNITY,
  PERSONAL,
  BEREAVEMENT,
  MARRIAGE,
  CIVIC_DUTY,
  OTHER,
}

extension LeaveTypeExtension on LeaveType {
  String get description {
    switch (this) {
      case LeaveType.SICK:
        return "Sick leave";
      case LeaveType.MATERNITY:
        return "Maternity leave";
      case LeaveType.PERSONAL:
        return "Personal leave";
      case LeaveType.BEREAVEMENT:
        return "Bereavement leave";
      case LeaveType.MARRIAGE:
        return "Marriage leave";
      case LeaveType.CIVIC_DUTY:
        return "Civic duty leave";
      case LeaveType.OTHER:
        return "Other leave";
      default:
        return "";
    }
  }
}
