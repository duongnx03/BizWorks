import 'package:flutter/material.dart';
import 'package:mobile/providers/auth_provider.dart';
import 'package:mobile/widgets/button.dart';
import 'package:mobile/widgets/text_field.dart';
import 'package:provider/provider.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  void loginUser(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    await authProvider.authenticate(
      emailController.text,
      passwordController.text,
    );

    if (authProvider.authMessage.isEmpty) {
      Navigator.pushNamed(context, "/home");
    } else {
      // Hiển thị SnackBar với kiểu tùy chỉnh
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.error, color: Colors.white), 
              const SizedBox(width: 8), 
              Expanded(
                child: Text(
                  authProvider.authMessage,
                  style: const TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
            ],
          ),
          backgroundColor: Colors.red, 
          behavior: SnackBarBehavior.floating, 
          duration: const Duration(seconds: 3), 
          margin: const EdgeInsets.all(16), 
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    final isLoading = Provider.of<AuthProvider>(context).isLoading;
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(
                height: height / 2.7,
                child: Image.network(
                    "https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-login_516790-1261.jpg"),
              ),
              TextFieldInput(
                icon: Icons.email,
                textEditingController: emailController,
                hintext: "Enter your email",
                textInputType: TextInputType.text,
              ),
              TextFieldInput(
                  icon: Icons.password,
                  textEditingController: passwordController,
                  hintext: "Enter your password",
                  textInputType: TextInputType.text,
                  isPass: true),
              isLoading
                  ? const CircularProgressIndicator()
                  : MyButtons(
                      text: "Log in",
                      onTap: () => loginUser(context),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
