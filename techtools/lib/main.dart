import 'package:flutter/material.dart';
import 'package:techtools/routes.dart';
import 'package:techtools/theme.dart';

void main() {
  runApp(const TechToolsApp());
}

class TechToolsApp extends StatelessWidget {
  const TechToolsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TechTools',
      theme: appTheme,
      darkTheme: appTheme, // Using same dark theme as original app
      themeMode: ThemeMode.dark,
      initialRoute: '/',
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
