import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class OhmsLawCalculator extends StatefulWidget {
  const OhmsLawCalculator({super.key});

  @override
  State<OhmsLawCalculator> createState() => _OhmsLawCalculatorState();
}

class _OhmsLawCalculatorState extends State<OhmsLawCalculator> {
  String solveFor = 'resistance';
  final _formKey = GlobalKey<FormState>();
  
  final Map<String, String> values = {
    'voltage': '',
    'current': '',
    'resistance': '',
  };

  final Map<String, String> units = {
    'voltage': 'V',
    'current': 'mA',
    'resistance': 'Ω',
  };

  String? error;
  Map<String, double>? result;

  void handleInputChange(String name, String value) {
    setState(() {
      values[name] = value;
      error = null;
      result = null;
    });
  }

  void handleUnitChange(String name, String value) {
    setState(() {
      units[name] = value;
      result = null;
    });
  }

  void handleSolveForChange(String? value) {
    if (value != null) {
      setState(() {
        solveFor = value;
        values.updateAll((key, value) => '');
        error = null;
        result = null;
      });
    }
  }

  double convertToBaseUnits(String value, String unit) {
    final val = double.parse(value);
    switch (unit) {
      case 'mV': return val * 0.001;
      case 'kV': return val * 1000;
      case 'μA': return val * 0.000001;
      case 'mA': return val * 0.001;
      case 'kA': return val * 1000;
      case 'mΩ': return val * 0.001;
      case 'kΩ': return val * 1000;
      case 'MΩ': return val * 1000000;
      default: return val;
    }
  }

  String formatWithUnit(double value, String type) {
    if (value <= 0) return '0';

    final units = {
      'voltage': [
        {'threshold': 0.001, 'unit': 'μV', 'factor': 1000000},
        {'threshold': 1, 'unit': 'mV', 'factor': 1000},
        {'threshold': 1000, 'unit': 'V', 'factor': 1},
        {'threshold': 1000000, 'unit': 'kV', 'factor': 0.001},
        {'threshold': double.infinity, 'unit': 'MV', 'factor': 0.000001},
      ],
      'current': [
        {'threshold': 0.000001, 'unit': 'nA', 'factor': 1000000000},
        {'threshold': 0.001, 'unit': 'μA', 'factor': 1000000},
        {'threshold': 1, 'unit': 'mA', 'factor': 1000},
        {'threshold': 1000, 'unit': 'A', 'factor': 1},
        {'threshold': double.infinity, 'unit': 'kA', 'factor': 0.001},
      ],
      'resistance': [
        {'threshold': 1, 'unit': 'mΩ', 'factor': 1000},
        {'threshold': 1000, 'unit': 'Ω', 'factor': 1},
        {'threshold': 1000000, 'unit': 'kΩ', 'factor': 0.001},
        {'threshold': double.infinity, 'unit': 'MΩ', 'factor': 0.000001},
      ],
      'power': [
        {'threshold': 0.001, 'unit': 'μW', 'factor': 1000000},
        {'threshold': 1, 'unit': 'mW', 'factor': 1000},
        {'threshold': 1000, 'unit': 'W', 'factor': 1},
        {'threshold': 1000000, 'unit': 'kW', 'factor': 0.001},
        {'threshold': double.infinity, 'unit': 'MW', 'factor': 0.000001},
      ],
    };

    final range = units[type]!.firstWhere(
      (range) => value < range['threshold']!,
      orElse: () => units[type]!.last,
    );

    final scaledValue = value * range['factor']!;
    String formattedValue;
    
    if (scaledValue < 10) {
      formattedValue = scaledValue.toStringAsFixed(3);
    } else if (scaledValue < 100) {
      formattedValue = scaledValue.toStringAsFixed(2);
    } else {
      formattedValue = scaledValue.toStringAsFixed(1);
    }

    // Remove trailing zeros after decimal point
    formattedValue = formattedValue.replaceAll(RegExp(r'\.?0+$'), '');

    return '$formattedValue ${range['unit']}';
  }

  List<String> validateInputs() {
    final errors = <String>[];
    
    // Validate voltage if it's not being solved for
    if (solveFor != 'voltage' && values['voltage']!.isNotEmpty) {
      final voltage = double.tryParse(values['voltage']!);
      if (voltage == null || voltage <= 0) {
        errors.add('Voltage must be a positive number');
      } else if (voltage > 1000000) { // 1MV limit
        errors.add('Voltage exceeds maximum limit (1MV)');
      }
    }

    // Validate current if it's not being solved for
    if (solveFor != 'current' && values['current']!.isNotEmpty) {
      final current = double.tryParse(values['current']!);
      if (current == null || current <= 0) {
        errors.add('Current must be a positive number');
      } else if (current > 1000) { // 1000A limit
        errors.add('Current exceeds maximum limit (1000A)');
      }
    }

    // Validate resistance if it's not being solved for
    if (solveFor != 'resistance' && values['resistance']!.isNotEmpty) {
      final resistance = double.tryParse(values['resistance']!);
      if (resistance == null || resistance <= 0) {
        errors.add('Resistance must be a positive number');
      } else if (resistance > 1000000) { // 1MΩ limit
        errors.add('Resistance exceeds maximum limit (1MΩ)');
      }
    }

    // Check if we have enough values
    final requiredFields = ['voltage', 'current', 'resistance']
      .where((field) => field != solveFor)
      .toList();
    final missingFields = requiredFields
      .where((field) => values[field]?.isEmpty ?? true)
      .toList();
    
    if (missingFields.isNotEmpty) {
      errors.add('Please enter values for: ${missingFields.join(', ')}');
    }

    return errors;
  }

  void handleCalculate() {
    final validationErrors = validateInputs();
    if (validationErrors.isNotEmpty) {
      setState(() {
        error = validationErrors.join('. ');
      });
      return;
    }

    try {
      // Convert all values to base units (V, A, Ω)
      final voltage = solveFor != 'voltage'
        ? convertToBaseUnits(values['voltage']!, units['voltage']!)
        : null;
      final current = solveFor != 'current'
        ? convertToBaseUnits(values['current']!, units['current']!)
        : null;
      final resistance = solveFor != 'resistance'
        ? convertToBaseUnits(values['resistance']!, units['resistance']!)
        : null;

      final calculatedResult = <String, double>{};

      // Calculate based on what we're solving for
      switch (solveFor) {
        case 'voltage':
          calculatedResult['voltage'] = current! * resistance!;
          calculatedResult['current'] = current;
          calculatedResult['resistance'] = resistance;
          break;
        case 'current':
          calculatedResult['current'] = voltage! / resistance!;
          calculatedResult['voltage'] = voltage;
          calculatedResult['resistance'] = resistance;
          break;
        case 'resistance':
          calculatedResult['resistance'] = voltage! / current!;
          calculatedResult['voltage'] = voltage;
          calculatedResult['current'] = current;
          break;
      }

      // Calculate power
      calculatedResult['power'] = calculatedResult['voltage']! * calculatedResult['current']!;

      setState(() {
        result = calculatedResult;
        error = null;
      });
    } catch (err) {
      setState(() {
        error = 'Calculation error: ${err.toString()}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ohm\'s Law Calculator'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Calculate voltage, current, or resistance using Ohm\'s Law (V = IR)',
                          style: TextStyle(color: Colors.white70),
                        ),
                        const SizedBox(height: 24),
                        
                        // Solve For Dropdown
                        DropdownButtonFormField<String>(
                          value: solveFor,
                          decoration: const InputDecoration(
                            labelText: 'Solve For',
                            border: OutlineInputBorder(),
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: 'voltage',
                              child: Text('Voltage (V = IR)'),
                            ),
                            DropdownMenuItem(
                              value: 'current',
                              child: Text('Current (I = V/R)'),
                            ),
                            DropdownMenuItem(
                              value: 'resistance',
                              child: Text('Resistance (R = V/I)'),
                            ),
                          ],
                          onChanged: handleSolveForChange,
                        ),
                        const SizedBox(height: 16),

                        // Input Fields
                        if (solveFor != 'voltage') ...[
                          Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  decoration: const InputDecoration(
                                    labelText: 'Voltage',
                                    border: OutlineInputBorder(),
                                  ),
                                  keyboardType: TextInputType.number,
                                  onChanged: (value) => handleInputChange('voltage', value),
                                ),
                              ),
                              const SizedBox(width: 8),
                              SizedBox(
                                width: 100,
                                child: DropdownButtonFormField<String>(
                                  value: units['voltage'],
                                  decoration: const InputDecoration(
                                    labelText: 'Unit',
                                    border: OutlineInputBorder(),
                                  ),
                                  items: const [
                                    DropdownMenuItem(value: 'mV', child: Text('mV')),
                                    DropdownMenuItem(value: 'V', child: Text('V')),
                                    DropdownMenuItem(value: 'kV', child: Text('kV')),
                                  ],
                                  onChanged: (value) {
                                    if (value != null) {
                                      handleUnitChange('voltage', value);
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                        ],

                        if (solveFor != 'current') ...[
                          Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  decoration: const InputDecoration(
                                    labelText: 'Current',
                                    border: OutlineInputBorder(),
                                  ),
                                  keyboardType: TextInputType.number,
                                  onChanged: (value) => handleInputChange('current', value),
                                ),
                              ),
                              const SizedBox(width: 8),
                              SizedBox(
                                width: 100,
                                child: DropdownButtonFormField<String>(
                                  value: units['current'],
                                  decoration: const InputDecoration(
                                    labelText: 'Unit',
                                    border: OutlineInputBorder(),
                                  ),
                                  items: const [
                                    DropdownMenuItem(value: 'μA', child: Text('μA')),
                                    DropdownMenuItem(value: 'mA', child: Text('mA')),
                                    DropdownMenuItem(value: 'A', child: Text('A')),
                                    DropdownMenuItem(value: 'kA', child: Text('kA')),
                                  ],
                                  onChanged: (value) {
                                    if (value != null) {
                                      handleUnitChange('current', value);
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                        ],

                        if (solveFor != 'resistance') ...[
                          Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  decoration: const InputDecoration(
                                    labelText: 'Resistance',
                                    border: OutlineInputBorder(),
                                  ),
                                  keyboardType: TextInputType.number,
                                  onChanged: (value) => handleInputChange('resistance', value),
                                ),
                              ),
                              const SizedBox(width: 8),
                              SizedBox(
                                width: 100,
                                child: DropdownButtonFormField<String>(
                                  value: units['resistance'],
                                  decoration: const InputDecoration(
                                    labelText: 'Unit',
                                    border: OutlineInputBorder(),
                                  ),
                                  items: const [
                                    DropdownMenuItem(value: 'mΩ', child: Text('mΩ')),
                                    DropdownMenuItem(value: 'Ω', child: Text('Ω')),
                                    DropdownMenuItem(value: 'kΩ', child: Text('kΩ')),
                                    DropdownMenuItem(value: 'MΩ', child: Text('MΩ')),
                                  ],
                                  onChanged: (value) {
                                    if (value != null) {
                                      handleUnitChange('resistance', value);
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Calculate Button
                        ElevatedButton(
                          onPressed: handleCalculate,
                          style: ElevatedButton.styleFrom(
                            minimumSize: const Size.fromHeight(50),
                          ),
                          child: const Text(
                            'Calculate',
                            style: TextStyle(fontSize: 18),
                          ),
                        ),

                        // Error Message
                        if (error != null) ...[
                          const SizedBox(height: 16),
                          Text(
                            error!,
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.error,
                            ),
                          ),
                        ],

                        // Results
                        if (result != null) ...[
                          const SizedBox(height: 24),
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Results:',
                                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                      color: Theme.of(context).colorScheme.primary,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Voltage: ${formatWithUnit(result!['voltage']!, 'voltage')}',
                                              style: Theme.of(context).textTheme.titleMedium,
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              'Current: ${formatWithUnit(result!['current']!, 'current')}',
                                              style: Theme.of(context).textTheme.titleMedium,
                                            ),
                                          ],
                                        ),
                                      ),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Resistance: ${formatWithUnit(result!['resistance']!, 'resistance')}',
                                              style: Theme.of(context).textTheme.titleMedium,
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              'Power: ${formatWithUnit(result!['power']!, 'power')}',
                                              style: Theme.of(context).textTheme.titleMedium,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                // About Section
                const SizedBox(height: 24),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'About this Tool',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'This calculator helps engineers and hobbyists calculate electrical values using Ohm\'s Law, which describes the relationship between voltage, current, and resistance in an electrical circuit.',
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Key Features:',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('• Dynamic calculation of voltage, current, or resistance'),
                            Text('• Real-time input validation'),
                            Text('• Clear error messaging'),
                            Text('• Automatic unit handling'),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Calculations Include:',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('• Voltage (V) = Current (I) × Resistance (R)'),
                            Text('• Current (I) = Voltage (V) ÷ Resistance (R)'),
                            Text('• Resistance (R) = Voltage (V) ÷ Current (I)'),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Note: This calculator assumes ideal conditions and linear components. Real circuits may have additional factors affecting their behavior, such as temperature coefficients and parasitic effects.',
                          style: TextStyle(color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 