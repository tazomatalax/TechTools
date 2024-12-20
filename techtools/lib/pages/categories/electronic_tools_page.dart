import 'package:flutter/material.dart';
import 'package:techtools/widgets/tool_card.dart';

class ElectronicToolsPage extends StatelessWidget {
  const ElectronicToolsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Electronic Design Tools'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Basic Calculators',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: const [
                  ToolCard(
                    title: 'Ohm\'s Law Calculator',
                    description: 'Calculate voltage, current, and resistance using Ohm\'s Law',
                    icon: Icons.calculate,
                    route: '/electronic-tools/ohms-law',
                  ),
                  ToolCard(
                    title: 'LED Resistor Calculator',
                    description: 'Calculate the required resistor value for LEDs',
                    icon: Icons.lightbulb,
                    route: '/electronic-tools/led-resistor',
                  ),
                  ToolCard(
                    title: 'Resistor Color Calculator',
                    description: 'Convert between resistor colors and values',
                    icon: Icons.palette,
                    route: '/electronic-tools/resistor-calculator',
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Text(
                'Circuit Analysis',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: const [
                  ToolCard(
                    title: 'Voltage Divider Calculator',
                    description: 'Calculate voltage divider circuits',
                    icon: Icons.power,
                    route: '/electronic-tools/voltage-divider',
                  ),
                  ToolCard(
                    title: 'RC Filter Calculator',
                    description: 'Design RC low-pass and high-pass filters',
                    icon: Icons.waves,
                    route: '/electronic-tools/rc-filter',
                  ),
                  ToolCard(
                    title: 'Reactance Calculator',
                    description: 'Calculate capacitive and inductive reactance',
                    icon: Icons.change_circle,
                    route: '/electronic-tools/reactance',
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Text(
                'Power & PCB',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: const [
                  ToolCard(
                    title: 'PCB Trace Calculator',
                    description: 'Calculate PCB trace width for current capacity',
                    icon: Icons.developer_board,
                    route: '/electronic-tools/pcb-trace',
                  ),
                  ToolCard(
                    title: 'Battery Life Calculator',
                    description: 'Estimate battery life for your project',
                    icon: Icons.battery_full,
                    route: '/electronic-tools/battery-life',
                  ),
                  ToolCard(
                    title: 'Voltage Regulator Calculator',
                    description: 'Design linear and switching regulators',
                    icon: Icons.power_input,
                    route: '/electronic-tools/voltage-regulator',
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
} 