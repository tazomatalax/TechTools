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
import RCFilterLowPass from './components/RCFilterLowPass';
import RCFilterHighPass from './components/RCFilterHighPass';

const RcFilterCalculator = () => {
  const [filterType, setFilterType] = useState('lowpass');
  const [values, setValues] = useState({
    resistance: '',
    capacitance: '',
    frequency: '',
  });
  const [units, setUnits] = useState({
    resistance: 'k',
    capacitance: 'n',
    frequency: 'k',
  });
  const [results, setResults] = useState(null);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (results) {
      const cutoffFreq = results.cutoffFrequency;
      const points = [];
      // Generate points for frequency response
      for (let i = -2; i <= 2; i += 0.1) {
        const freq = cutoffFreq * Math.pow(10, i);
        const gain = filterType === 'lowpass' 
          ? 1 / Math.sqrt(1 + Math.pow(freq / cutoffFreq, 2))
          : freq / (Math.sqrt(freq * freq + cutoffFreq * cutoffFreq));
        points.push({
          frequency: freq,
          gain: 20 * Math.log10(gain) // Convert to dB
        });
      }
      setGraphData(points);
    }
  }, [results, filterType]);

  const handleFilterTypeChange = (event, newType) => {
    if (newType !== null) {
      setFilterType(newType);
    }
  };

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

  const handleCalculate = () => {
    // Validate inputs
    if (!values.resistance || !values.capacitance) {
      return;
    }

    // Convert values based on units
    const multipliers = {
      resistance: { k: 1e3, M: 1e6 },
      capacitance: { n: 1e-9, u: 1e-6 },
      frequency: { k: 1e3, M: 1e6 },
    };

    const R = parseFloat(values.resistance) * multipliers.resistance[units.resistance];
    const C = parseFloat(values.capacitance) * multipliers.capacitance[units.capacitance];

    if (isNaN(R) || isNaN(C) || R <= 0 || C <= 0) {
      return;
    }

    const cutoffFrequency = 1 / (2 * Math.PI * R * C);
    const timeConstant = R * C;

    setResults({
      cutoffFrequency,
      timeConstant,
    });
  };

  useEffect(() => {
    if (!results || !results.cutoffFrequency) {
      setGraphData([]);
      return;
    }

    try {
      const cutoffFreq = results.cutoffFrequency;
      const points = [];
      // Generate points for frequency response
      for (let i = -2; i <= 2; i += 0.1) {
        const freq = cutoffFreq * Math.pow(10, i);
        const gain = filterType === 'lowpass' 
          ? 1 / Math.sqrt(1 + Math.pow(freq / cutoffFreq, 2))
          : freq / (Math.sqrt(freq * freq + cutoffFreq * cutoffFreq));
        
        if (!isNaN(freq) && !isNaN(gain) && isFinite(freq) && isFinite(gain)) {
          points.push({
            frequency: freq,
            gain: 20 * Math.log10(gain)
          });
        }
      }
      setGraphData(points);
    } catch (error) {
      console.error('Error calculating frequency response:', error);
      setGraphData([]);
    }
  }, [results, filterType]);

  const renderResults = () => {
    if (!results || !results.cutoffFrequency || graphData.length === 0) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Results</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Circuit Parameters</Typography>
              <Typography>Cutoff Frequency: {results.cutoffFrequency.toFixed(2)} Hz</Typography>
              <Typography>
                Time Constant (τ):{' '}
                {results.timeConstant >= 1
                  ? `${results.timeConstant.toFixed(2)} s`
                  : results.timeConstant >= 0.001
                  ? `${(results.timeConstant * 1000).toFixed(2)} ms`
                  : `${(results.timeConstant * 1000000).toFixed(2)} µs`}
              </Typography>
              <Typography>Phase Shift at Cutoff: -45°</Typography>
              <Box sx={{ mt: 2 }}>
                {filterType === 'lowpass' ? (
                  <RCFilterLowPass
                    resistance={values.resistance}
                    capacitance={values.capacitance}
                    resistanceUnit={units.resistance}
                    capacitanceUnit={units.capacitance}
                  />
                ) : (
                  <RCFilterHighPass
                    resistance={values.resistance}
                    capacitance={values.capacitance}
                    resistanceUnit={units.resistance}
                    capacitanceUnit={units.capacitance}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>Frequency Response</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="frequency"
                      type="number"
                      scale="log"
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => (value ? `${value.toFixed(0)} Hz` : '0 Hz')}
                    />
                    <YAxis
                      domain={[-40, 5]}
                      tickFormatter={(value) => (value ? `${value.toFixed(0)} dB` : '0 dB')}
                    />
                    <Tooltip
                      formatter={(value, name) => [value ? `${value.toFixed(2)} dB` : '0 dB', 'Gain']}
                      labelFormatter={(value) => value ? `${value.toFixed(2)} Hz` : '0 Hz'}
                      contentStyle={{
                        backgroundColor: '#424242',
                        border: '1px solid #666',
                        color: '#fff'
                      }}
                      labelStyle={{
                        color: '#fff'
                      }}
                    />
                    <ReferenceLine y={-3} stroke="#666" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="gain"
                      stroke="#8884d8"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          RC Filter Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Calculate cutoff frequency and frequency response for RC filters
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={handleFilterTypeChange}
            fullWidth
          >
            <ToggleButton value="lowpass">Low-Pass Filter</ToggleButton>
            <ToggleButton value="highpass">High-Pass Filter</ToggleButton>
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
                  <MenuItem value="n">nF</MenuItem>
                  <MenuItem value="u">µF</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            fullWidth
          >
            Calculate
          </Button>
        </Box>

        {renderResults()}
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            About this Tool
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Low-Pass Filter
          </Typography>
          <Typography paragraph>
            • Attenuates high frequencies while passing low frequencies
            <br />
            • -20 dB/decade roll-off after cutoff frequency
            <br />
            • -3 dB point at cutoff frequency (fc = 1/2πRC)
            <br />
            • Typical applications: Audio smoothing, noise reduction, signal conditioning
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            High-Pass Filter
          </Typography>
          <Typography paragraph>
            • Attenuates low frequencies while passing high frequencies
            <br />
            • -20 dB/decade roll-off below cutoff frequency
            <br />
            • -3 dB point at cutoff frequency (fc = 1/2πRC)
            <br />
            • Typical applications: DC blocking, AC coupling, bass filtering
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Component Selection Tips
          </Typography>
          <Typography paragraph>
            <strong>Resistor Values (R):</strong>
            <br />
            • Choose values between 1kΩ and 100kΩ for most applications
            <br />
            • Higher values increase noise susceptibility
            <br />
            • Lower values increase current draw
          </Typography>

          <Typography paragraph>
            <strong>Capacitor Values (C):</strong>
            <br />
            • Select based on desired cutoff frequency
            <br />
            • Use quality capacitors (film or ceramic) for better performance
            <br />
            • Consider voltage rating and temperature stability
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Key Characteristics
          </Typography>
          <Typography paragraph>
            <strong>Phase Response:</strong>
            <br />
            • 45° phase shift at cutoff frequency
            <br />
            • 90° total phase shift (leading for high-pass, lagging for low-pass)
            <br />
            • Phase shift varies with frequency
          </Typography>

          <Typography paragraph>
            <strong>Filter Response:</strong>
            <br />
            • Simple first-order response (-20 dB/decade)
            <br />
            • Time constant τ = RC determines response speed
            <br />
            • Gain is -3 dB at cutoff frequency
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RcFilterCalculator;
