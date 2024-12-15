import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const OhmsLawCalculator = () => {
  const [values, setValues] = useState({
    voltage: '',
    current: '',
    resistance: ''
  });
  const [units, setUnits] = useState({
    voltage: 'V',
    current: 'mA',
    resistance: 'Ω'
  });
  const [solveFor, setSolveFor] = useState('resistance');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setError('');
    setResult(null);
  };

  const handleUnitChange = (event) => {
    const [name, value] = event.target.value.split('_');
    setUnits(prev => ({
      ...prev,
      [name]: value
    }));
    setResult(null);
  };

  const handleSolveForChange = (event) => {
    setSolveFor(event.target.value);
    setValues({
      voltage: '',
      current: '',
      resistance: ''
    });
    setError('');
    setResult(null);
  };

  const validateInputs = () => {
    const errors = [];
    
    // Validate voltage if it's not being solved for
    if (solveFor !== 'voltage' && values.voltage) {
      const voltage = parseFloat(values.voltage);
      if (isNaN(voltage) || voltage <= 0) {
        errors.push('Voltage must be a positive number');
      } else if (voltage > 1000000) { // 1MV limit
        errors.push('Voltage exceeds maximum limit (1MV)');
      }
    }

    // Validate current if it's not being solved for
    if (solveFor !== 'current' && values.current) {
      const current = parseFloat(values.current);
      if (isNaN(current) || current <= 0) {
        errors.push('Current must be a positive number');
      } else if (current > 1000) { // 1000A limit
        errors.push('Current exceeds maximum limit (1000A)');
      }
    }

    // Validate resistance if it's not being solved for
    if (solveFor !== 'resistance' && values.resistance) {
      const resistance = parseFloat(values.resistance);
      if (isNaN(resistance) || resistance <= 0) {
        errors.push('Resistance must be a positive number');
      } else if (resistance > 1000000) { // 1MΩ limit
        errors.push('Resistance exceeds maximum limit (1MΩ)');
      }
    }

    // Check if we have enough values based on what we're solving for
    const requiredFields = ['voltage', 'current', 'resistance'].filter(field => field !== solveFor);
    const missingFields = requiredFields.filter(field => !values[field]);
    if (missingFields.length > 0) {
      errors.push(`Please enter values for: ${missingFields.join(', ')}`);
    }

    return errors;
  };

  const convertToBaseUnits = (value, unit) => {
    const val = parseFloat(value);
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
  };

  const handleCalculate = () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    try {
      // Convert all values to base units (V, A, Ω)
      const voltage = solveFor !== 'voltage' ? convertToBaseUnits(values.voltage, units.voltage) : null;
      const current = solveFor !== 'current' ? convertToBaseUnits(values.current, units.current) : null;
      const resistance = solveFor !== 'resistance' ? convertToBaseUnits(values.resistance, units.resistance) : null;

      let calculatedResult = {};

      // Calculate based on what we're solving for
      switch (solveFor) {
        case 'voltage':
          calculatedResult.voltage = current * resistance;
          calculatedResult.current = current;
          calculatedResult.resistance = resistance;
          break;
        case 'current':
          calculatedResult.current = voltage / resistance;
          calculatedResult.voltage = voltage;
          calculatedResult.resistance = resistance;
          break;
        case 'resistance':
          calculatedResult.resistance = voltage / current;
          calculatedResult.voltage = voltage;
          calculatedResult.current = current;
          break;
      }

      // Calculate power for display
      calculatedResult.power = calculatedResult.voltage * calculatedResult.current;
      setResult(calculatedResult);
      setError('');
    } catch (err) {
      setError('Calculation error: ' + err.message);
    }
  };

  const formatWithUnit = (value, type) => {
    if (value === null || value === undefined) return '';
    
    // Define unit ranges for each type
    const units = {
      voltage: [
        { threshold: 0.001, unit: 'μV', factor: 1000000 },
        { threshold: 1, unit: 'mV', factor: 1000 },
        { threshold: 1000, unit: 'V', factor: 1 },
        { threshold: 1000000, unit: 'kV', factor: 0.001 },
        { threshold: Infinity, unit: 'MV', factor: 0.000001 }
      ],
      current: [
        { threshold: 0.000001, unit: 'nA', factor: 1000000000 },
        { threshold: 0.001, unit: 'μA', factor: 1000000 },
        { threshold: 1, unit: 'mA', factor: 1000 },
        { threshold: 1000, unit: 'A', factor: 1 },
        { threshold: Infinity, unit: 'kA', factor: 0.001 }
      ],
      resistance: [
        { threshold: 1, unit: 'mΩ', factor: 1000 },
        { threshold: 1000, unit: 'Ω', factor: 1 },
        { threshold: 1000000, unit: 'kΩ', factor: 0.001 },
        { threshold: Infinity, unit: 'MΩ', factor: 0.000001 }
      ],
      power: [
        { threshold: 0.001, unit: 'μW', factor: 1000000 },
        { threshold: 1, unit: 'mW', factor: 1000 },
        { threshold: 1000, unit: 'W', factor: 1 },
        { threshold: 1000000, unit: 'kW', factor: 0.001 },
        { threshold: Infinity, unit: 'MW', factor: 0.000001 }
      ]
    };

    // Find appropriate unit range
    const range = units[type].find(range => value < range.threshold) || units[type][units[type].length - 1];
    const scaledValue = value * range.factor;
    
    // Format number to appropriate decimal places
    let formattedValue;
    if (scaledValue < 10) {
      formattedValue = scaledValue.toFixed(3);
    } else if (scaledValue < 100) {
      formattedValue = scaledValue.toFixed(2);
    } else {
      formattedValue = scaledValue.toFixed(1);
    }

    // Remove trailing zeros after decimal point
    formattedValue = formattedValue.replace(/\.?0+$/, '');

    return `${formattedValue} ${range.unit}`;
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Ohm's Law Calculator
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Calculate voltage, current, or resistance using Ohm's Law (V = IR)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Solve For</InputLabel>
              <Select value={solveFor} onChange={handleSolveForChange}>
                <MenuItem value="voltage">Voltage (V = IR)</MenuItem>
                <MenuItem value="current">Current (I = V/R)</MenuItem>
                <MenuItem value="resistance">Resistance (R = V/I)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {solveFor !== 'voltage' && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Voltage"
                  name="voltage"
                  type="number"
                  value={values.voltage}
                  onChange={handleInputChange}
                  InputProps={{
                    sx: { bgcolor: 'background.default' }
                  }}
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={`voltage_${units.voltage}`}
                    onChange={handleUnitChange}
                    label="Unit"
                  >
                    <MenuItem value="voltage_mV">mV</MenuItem>
                    <MenuItem value="voltage_V">V</MenuItem>
                    <MenuItem value="voltage_kV">kV</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          )}

          {solveFor !== 'current' && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Current"
                  name="current"
                  type="number"
                  value={values.current}
                  onChange={handleInputChange}
                  InputProps={{
                    sx: { bgcolor: 'background.default' }
                  }}
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={`current_${units.current}`}
                    onChange={handleUnitChange}
                    label="Unit"
                  >
                    <MenuItem value="current_μA">μA</MenuItem>
                    <MenuItem value="current_mA">mA</MenuItem>
                    <MenuItem value="current_A">A</MenuItem>
                    <MenuItem value="current_kA">kA</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          )}
          
          {solveFor !== 'resistance' && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Resistance"
                  name="resistance"
                  type="number"
                  value={values.resistance}
                  onChange={handleInputChange}
                  InputProps={{
                    sx: { bgcolor: 'background.default' }
                  }}
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={`resistance_${units.resistance}`}
                    onChange={handleUnitChange}
                    label="Unit"
                  >
                    <MenuItem value="resistance_mΩ">mΩ</MenuItem>
                    <MenuItem value="resistance_Ω">Ω</MenuItem>
                    <MenuItem value="resistance_kΩ">kΩ</MenuItem>
                    <MenuItem value="resistance_MΩ">MΩ</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              fullWidth
              sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
            >
              Calculate
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Grid>
          )}

          {result && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, mt: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Results:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      Voltage: {formatWithUnit(result.voltage, 'voltage')}
                    </Typography>
                    <Typography variant="subtitle1">
                      Current: {formatWithUnit(result.current, 'current')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      Resistance: {formatWithUnit(result.resistance, 'resistance')}
                    </Typography>
                    <Typography variant="subtitle1">
                      Power: {formatWithUnit(result.power, 'power')}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* About Panel */}
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About this Tool
        </Typography>
        
        <Typography variant="body1" paragraph>
          This calculator helps engineers and hobbyists calculate electrical values using Ohm's Law, which describes the relationship between voltage, current, and resistance in an electrical circuit.
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Key Features:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Dynamic calculation of voltage, current, or resistance</li>
            <li>Real-time input validation</li>
            <li>Clear error messaging</li>
            <li>Automatic unit handling</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Calculations Include:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Voltage (V) = Current (I) × Resistance (R)</li>
            <li>Current (I) = Voltage (V) ÷ Resistance (R)</li>
            <li>Resistance (R) = Voltage (V) ÷ Current (I)</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Usage Tips:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Select what you want to solve for (voltage, current, or resistance)</li>
            <li>Enter the known values in their respective fields</li>
            <li>Results are calculated automatically</li>
          </ul>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: This calculator assumes ideal conditions and linear components. Real circuits may have additional factors affecting their behavior, such as temperature coefficients and parasitic effects.
        </Typography>
      </Paper>
    </Container>
  );
};

export default OhmsLawCalculator;
