import 'package:flutter/material.dart';

final appTheme = ThemeData.dark().copyWith(
  primaryColor: const Color(0xFF3f51b5),
  colorScheme: const ColorScheme.dark(
    primary: Color(0xFF3f51b5),
    secondary: Color(0xFFf50057),
    background: Color(0xFF1a1a1a),
    surface: Color(0xFF242424),
  ),
  scaffoldBackgroundColor: const Color(0xFF1a1a1a),
  appBarTheme: const AppBarTheme(
    elevation: 2,
    backgroundColor: Color(0xFF242424),
  ),
  drawerTheme: const DrawerThemeData(
    backgroundColor: Color(0xFF1e1e1e),
  ),
  textTheme: const TextTheme(
    displayLarge: TextStyle(
      fontSize: 32,
      fontWeight: FontWeight.w500,
      letterSpacing: -0.01562,
    ),
    displayMedium: TextStyle(
      fontSize: 28,
      fontWeight: FontWeight.w500,
      letterSpacing: -0.00833,
    ),
    displaySmall: TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.w500,
    ),
    headlineMedium: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.00735,
    ),
    bodyLarge: TextStyle(
      fontSize: 16,
      letterSpacing: 0.00938,
      height: 1.5,
    ),
  ),
  cardTheme: CardTheme(
    elevation: 2,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  buttonTheme: ButtonThemeData(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
); 