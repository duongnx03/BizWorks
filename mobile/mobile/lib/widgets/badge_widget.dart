import 'package:flutter/material.dart';

class BadgeWidget extends StatelessWidget {
  final int badgeCount;
  final Widget child;

  const BadgeWidget({
    Key? key,
    required this.badgeCount,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        child,
        if (badgeCount > 0)
          Positioned(
            right: 0,
            top: -8,
            child: Container(
              padding: const EdgeInsets.all(4), // Giảm padding để badge nhỏ hơn
              decoration: BoxDecoration(
                color: Colors.red,
                shape: BoxShape
                    .circle, // Sử dụng BoxShape.circle để đảm bảo hình tròn
              ),
              constraints: const BoxConstraints(
                minWidth: 20, // Tăng kích thước tối thiểu
                minHeight: 20, // Tăng kích thước tối thiểu
              ),
              alignment: Alignment.center, // Căn giữa nội dung
              child: Text(
                '$badgeCount',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}
