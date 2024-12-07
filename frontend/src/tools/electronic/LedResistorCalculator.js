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
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LEDSchematic from './components/LEDSchematic';

const LedResistorCalculator = () => {
  const [values, setValues] = useState({
    sourceVoltage: '',
    ledVoltage: '',
    ledCurrent: '',
  });
  const [units, setUnits] = useState({
    sourceVoltage: 'V',
    ledVoltage: 'V',
    ledCurrent: 'mA',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const ledPresets = {
    'Select LED Type': { voltage: '', current: '', color: '#ffffff' },
    'Red (Standard)': { voltage: '2.0', current: '20', color: '#ff0000' },
    'Green (Standard)': { voltage: '2.1', current: '20', color: '#00ff00' },
    'Blue (Standard)': { voltage: '3.2', current: '20', color: '#0000ff' },
    'White (Standard)': { voltage: '3.2', current: '20', color: '#ffffff' },
    'Yellow (Standard)': { voltage: '2.1', current: '20', color: '#ffff00' },
    'IR (940nm)': { voltage: '1.5', current: '50', color: '#330000' },
    'UV (405nm)': { voltage: '3.8', current: '20', color: '#8a2be2' },
    'High Power Red': { voltage: '2.2', current: '350', color: '#ff0000' },
    'High Power White': { voltage: '3.4', current: '350', color: '#ffffff' },
  };

  const [selectedPreset, setSelectedPreset] = useState('Select LED Type');

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

  const handlePresetChange = (event) => {
    const preset = event.target.value;
    setSelectedPreset(preset);
    if (preset !== 'Select LED Type') {
      setValues(prev => ({
        ...prev,
        ledVoltage: ledPresets[preset].voltage,
        ledCurrent: ledPresets[preset].current,
      }));
      setUnits(prev => ({
        ...prev,
        ledVoltage: 'V',
        ledCurrent: 'mA',
      }));
    }
  };

  const validateInputs = () => {
    const errors = [];
    
    // Validate source voltage
    if (!values.sourceVoltage) {
      errors.push('Source voltage is required');
    } else {
      const sourceVoltage = parseFloat(values.sourceVoltage);
      if (isNaN(sourceVoltage) || sourceVoltage <= 0) {
        errors.push('Source voltage must be a positive number');
      } else if (sourceVoltage > 1000) { // 1000V limit
        errors.push('Source voltage exceeds maximum limit (1000V)');
      }
    }

    // Validate LED forward voltage
    if (!values.ledVoltage) {
      errors.push('LED forward voltage is required');
    } else {
      const ledVoltage = parseFloat(values.ledVoltage);
      if (isNaN(ledVoltage) || ledVoltage <= 0) {
        errors.push('LED forward voltage must be a positive number');
      } else if (ledVoltage > 50) { // 50V limit for LEDs
        errors.push('LED forward voltage seems too high (max 50V)');
      }
    }

    // Validate LED current
    if (!values.ledCurrent) {
      errors.push('LED current is required');
    } else {
      const ledCurrent = parseFloat(values.ledCurrent);
      if (isNaN(ledCurrent) || ledCurrent <= 0) {
        errors.push('LED current must be a positive number');
      } else if (ledCurrent > 3000) { // 3A limit
        errors.push('LED current exceeds maximum limit (3000mA)');
      }
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
      case 'A': return val;
      default: return val;
    }
  };

  const formatWithUnit = (value, type) => {
    if (value === null || value === undefined) return '';
    
    const units = {
      voltage: [
        { threshold: 0.001, unit: 'μV', factor: 1000000 },
        { threshold: 1, unit: 'mV', factor: 1000 },
        { threshold: 1000, unit: 'V', factor: 1 },
        { threshold: Infinity, unit: 'kV', factor: 0.001 }
      ],
      current: [
        { threshold: 0.001, unit: 'μA', factor: 1000000 },
        { threshold: 1, unit: 'mA', factor: 1000 },
        { threshold: 1000, unit: 'A', factor: 1 }
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
        { threshold: Infinity, unit: 'kW', factor: 0.001 }
      ]
    };

    const range = units[type].find(range => value < range.threshold) || units[type][units[type].length - 1];
    const scaledValue = value * range.factor;
    
    let formattedValue;
    if (scaledValue < 10) {
      formattedValue = scaledValue.toFixed(3);
    } else if (scaledValue < 100) {
      formattedValue = scaledValue.toFixed(2);
    } else {
      formattedValue = scaledValue.toFixed(1);
    }

    formattedValue = formattedValue.replace(/\.?0+$/, '');
    return `${formattedValue} ${range.unit}`;
  };

  const calculateResistor = () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    try {
      // Convert values based on units
      const sourceV = parseFloat(values.sourceVoltage);
      const ledV = parseFloat(values.ledVoltage);
      const ledI = parseFloat(values.ledCurrent) * (units.ledCurrent === 'mA' ? 0.001 : 1);

      if (sourceV <= ledV) {
        setError('Source voltage must be greater than LED forward voltage');
        setResult(null);
        return;
      }

      // Calculate resistor value
      const resistance = (sourceV - ledV) / ledI;
      
      // Round to 2 decimal places and convert to ohms
      const resistanceOhms = Math.round(resistance * 100) / 100;
      
      // Find nearest standard resistor value (optional)
      const standardValues = [
        1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10,
        // Multiply each by powers of 10
      ].flatMap(x => [x, x * 10, x * 100, x * 1000, x * 10000, x * 100000]);
      
      const nearestStandard = standardValues.reduce((prev, curr) => 
        Math.abs(curr - resistanceOhms) < Math.abs(prev - resistanceOhms) ? curr : prev
      );

      setResult({
        calculated: resistanceOhms,
        standard: nearestStandard,
        power: (sourceV - ledV) * ledI
      });
      setError('');
    } catch (err) {
      setError('Please fill in all fields with valid numbers');
      setResult(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          LED Series Resistor Calculator
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 4,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 1
        }}>
          <LEDSchematic 
            sourceVoltage={values.sourceVoltage || 'Vin'}
            ledVoltage={values.ledVoltage || 'Vf'}
            current={values.ledCurrent || 'If'}
            resistorValue={result ? result.standard : 'R'}
            ledColor={selectedPreset !== 'Select LED Type' ? ledPresets[selectedPreset].color : '#ffffff'}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" paragraph>
              Calculate the required series resistor value for LEDs
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>LED Type Preset</InputLabel>
              <Select
                value={selectedPreset}
                label="LED Type Preset"
                onChange={handlePresetChange}
              >
                {Object.keys(ledPresets).map((preset) => (
                  <MenuItem key={preset} value={preset}>
                    {preset}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Source Voltage"
                name="sourceVoltage"
                type="number"
                value={values.sourceVoltage}
                onChange={handleInputChange}
                helperText="Supply voltage of your power source"
                InputProps={{
                  sx: { bgcolor: 'background.default' }
                }}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={`sourceVoltage_${units.sourceVoltage}`}
                  onChange={handleUnitChange}
                  label="Unit"
                >
                  <MenuItem value="sourceVoltage_mV">mV</MenuItem>
                  <MenuItem value="sourceVoltage_V">V</MenuItem>
                  <MenuItem value="sourceVoltage_kV">kV</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="LED Forward Voltage"
                name="ledVoltage"
                type="number"
                value={values.ledVoltage}
                onChange={handleInputChange}
                helperText="Forward voltage drop of your LED"
                InputProps={{
                  sx: { bgcolor: 'background.default' }
                }}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={`ledVoltage_${units.ledVoltage}`}
                  onChange={handleUnitChange}
                  label="Unit"
                >
                  <MenuItem value="ledVoltage_mV">mV</MenuItem>
                  <MenuItem value="ledVoltage_V">V</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="LED Current"
                name="ledCurrent"
                type="number"
                value={values.ledCurrent}
                onChange={handleInputChange}
                helperText="Desired LED current"
                InputProps={{
                  sx: { bgcolor: 'background.default' }
                }}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={`ledCurrent_${units.ledCurrent}`}
                  onChange={handleUnitChange}
                  label="Unit"
                >
                  <MenuItem value="ledCurrent_μA">μA</MenuItem>
                  <MenuItem value="ledCurrent_mA">mA</MenuItem>
                  <MenuItem value="ledCurrent_A">A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateResistor}
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
                      Required Resistor: {formatWithUnit(result.calculated, 'resistance')} (calculated)
                    </Typography>
                    <Typography variant="subtitle1">
                      Nearest Standard Resistor: {formatWithUnit(result.standard, 'resistance')} (standard)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      Resistor Power: {formatWithUnit(result.power, 'power')}
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
          This calculator helps you determine the correct series resistor value needed when connecting LEDs to a power source. It ensures your LED operates within its specifications while limiting the current to a safe value.
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Key Features:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Calculates required series resistor value</li>
            <li>Determines power rating for the resistor</li>
            <li>Supports various voltage and current units</li>
            <li>Real-time input validation</li>
            <li>Automatic unit conversion</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Calculations Include:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Series Resistance (R = (Vs - Vf) / I)</li>
            <li>Resistor Power Dissipation (P = (Vs - Vf) × I)</li>
            <li>LED Power Consumption (P = Vf × I)</li>
            <li>Voltage Drop Across Resistor</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Usage Tips:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Source Voltage (Vs): Your power supply voltage</li>
            <li>LED Forward Voltage (Vf): Found in LED datasheet (typically 1.8V-3.3V for standard LEDs)</li>
            <li>LED Current: Also found in LED datasheet (typically 20mA for standard LEDs)</li>
            <li>Choose a resistor with the next higher standard value</li>
            <li>Select a resistor with a power rating at least 2x the calculated value</li>
          </ul>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: This calculator assumes a simple single LED circuit. For multiple LEDs or more complex configurations, consider using our LED Array Calculator. Always verify the LED specifications from its datasheet.
        </Typography>
      </Paper>
    </Container>
  );
};

export default LedResistorCalculator;
