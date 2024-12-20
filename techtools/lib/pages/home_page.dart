import 'package:flutter/material.dart';
import 'package:techtools/widgets/category_card.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TechTools'),
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        children: const [
          CategoryCard(
            title: 'Electronic Design Tools',
            icon: Icons.electrical_services,
            route: '/electronic-tools',
            description: 'Calculators and tools for electronic design',
          ),
          CategoryCard(
            title: 'Signal & Power Tools',
            icon: Icons.waves,
            route: '/signal-power-tools',
            description: 'Tools for signal processing and power analysis',
          ),
          CategoryCard(
            title: 'Communication Tools',
            icon: Icons.router,
            route: '/communication-tools',
            description: 'Serial, Modbus, and other communication tools',
          ),
          CategoryCard(
            title: 'Developer Tools',
            icon: Icons.code,
            route: '/developer-tools',
            description: 'Utilities for software development',
          ),
        ],
      ),
    );
  }
} 