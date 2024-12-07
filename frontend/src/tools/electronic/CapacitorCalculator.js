import React, { useState, useEffect } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import RCCircuitSchematic from './components/RCCircuitSchematic';

const CapacitorCalculator = () => {
  const [values, setValues] = useState({
    resistance: '',
    capacitance: '',
    voltage: '',
    targetVoltage: '',
  });
  
  const [units, setUnits] = useState({
    resistance: 'k',
    capacitance: 'u',
  });
  
  const [mode, setMode] = useState('charge');
  const [results, setResults] = useState(null);

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleUnitChange = (event) => {
    setUnits({
      ...units,
      [event.target.name]: event.target.value,
    });
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const calculate = () => {
    // Convert values to base units
    const R = parseFloat(values.resistance) * (units.resistance === 'k' ? 1000 : 1000000);
    const C = parseFloat(values.capacitance) * (units.capacitance === 'u' ? 0.000001 : 0.000000001);
    const V = parseFloat(values.voltage);
    const Vt = parseFloat(values.targetVoltage);

    // Time constant
    const tau = R * C;
    
    // Calculate time to reach target voltage
    let time;
    if (mode === 'charge') {
      time = -tau * Math.log(1 - (Vt / V));
    } else {
      time = -tau * Math.log(Vt / V);
    }

    // Calculate voltages at different time points
    const timePoints = Array.from({ length: 50 }, (_, i) => {
      const t = (i / 49) * 5; // Generate 50 points from 0 to 5τ
      return {
        time: t * tau,
        voltage: mode === 'charge'
          ? V * (1 - Math.exp(-t))
          : V * Math.exp(-t),
      };
    });

    setResults({
      timeConstant: tau,
      targetTime: time,
      timePoints,
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Capacitor Charge/Discharge Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Calculate charging and discharging times for RC circuits
        </Typography>

        <RCCircuitSchematic
          voltage={values.voltage}
          resistance={values.resistance}
          capacitance={values.capacitance}
          outputVoltage={results ? results.timePoints[results.timePoints.length - 1].voltage.toFixed(2) : values.targetVoltage}
          resistanceUnit={units.resistance}
          capacitanceUnit={units.capacitance}
        />

        <Box sx={{ mb: 4 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
          >
            <ToggleButton value="charge">Charging</ToggleButton>
            <ToggleButton value="discharge">Discharging</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Resistance"
                name="resistance"
                type="number"
                value={values.resistance}
                onChange={handleInputChange}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={units.resistance}
                  label="Unit"
                  name="resistance"
                  onChange={handleUnitChange}
                >
                  <MenuItem value="k">kΩ</MenuItem>
                  <MenuItem value="M">MΩ</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Capacitance"
                name="capacitance"
                type="number"
                value={values.capacitance}
                onChange={handleInputChange}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={units.capacitance}
                  label="Unit"
                  name="capacitance"
                  onChange={handleUnitChange}
                >
                  <MenuItem value="u">µF</MenuItem>
                  <MenuItem value="n">nF</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={mode === 'charge' ? 'Supply Voltage' : 'Initial Voltage'}
              name="voltage"
              type="number"
              value={values.voltage}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: 'V',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target Voltage"
              name="targetVoltage"
              type="number"
              value={values.targetVoltage}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: 'V',
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculate}
            fullWidth
          >
            Calculate
          </Button>
        </Box>

        {results && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1">
                    Time Constant (τ): {(results.timeConstant * 1000).toFixed(2)} ms
                  </Typography>
                  <Typography variant="subtitle1">
                    Time to reach target: {(results.targetTime * 1000).toFixed(2)} ms
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Voltage/Time Curve:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={results.timePoints}
                      margin={{ top: 10, right: 110, bottom: 30, left: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        tickFormatter={(value) => `${(value * 1000).toFixed(1)}ms`}
                        label={{ value: 'Time', position: 'bottom', offset: 15 }}
                      />
                      <YAxis
                        label={{ value: 'Voltage (V)', angle: -90, position: 'left', offset: 20 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value.toFixed(2)}V`, 'Voltage']}
                        labelFormatter={(time) => `Time: ${(time * 1000).toFixed(1)}ms`}
                        contentStyle={{
                          backgroundColor: '#424242',
                          border: '1px solid #666',
                          color: '#fff'
                        }}
                        labelStyle={{
                          color: '#fff'
                        }}
                      />
                      <ReferenceLine
                        y={parseFloat(values.targetVoltage)}
                        stroke="#ff9800"
                        strokeDasharray="3 3"
                        label={{
                          value: 'Target',
                          position: 'right',
                          fill: '#ff9800',
                          offset: 10
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="voltage"
                        stroke="#2196f3"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* About Panel */}
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About this Tool
        </Typography>
        
        <Typography variant="body1" paragraph>
          This calculator helps engineers and hobbyists analyze RC (Resistor-Capacitor) circuits, calculating charging and discharging times and visualizing voltage changes over time. It's particularly useful for timing circuits, filters, and smoothing applications.
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Key Features:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Interactive voltage/time curve visualization</li>
            <li>Calculation of time constant (τ) and target voltage timing</li>
            <li>Support for both charging and discharging scenarios</li>
            <li>Automatic unit handling (kΩ/MΩ, µF/nF)</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Key Concepts:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Time Constant (τ) = Resistance (R) × Capacitance (C)</li>
            <li>Charging: V(t) = V₀(1 - e^(-t/τ))</li>
            <li>Discharging: V(t) = V₀e^(-t/τ)</li>
            <li>63.2% of final value reached after one time constant</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Usage Tips:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Select charging or discharging mode based on your application</li>
            <li>Enter resistance and capacitance values with appropriate units</li>
            <li>Set initial and target voltages</li>
            <li>The graph will show the complete voltage curve over time</li>
          </ul>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: This calculator assumes ideal components and conditions. Real circuits may be affected by factors such as component tolerances, temperature coefficients, and parasitic effects.
        </Typography>
      </Paper>
    </Container>
  );
};

export default CapacitorCalculator;
