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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

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

  const calculate = () => {
    // Convert values to base units
    const R = parseFloat(values.resistance) * (units.resistance === 'k' ? 1000 : 1000000); // to ohms
    const C = parseFloat(values.capacitance) * (units.capacitance === 'n' ? 1e-9 : 1e-6); // to farads
    
    // Calculate cutoff frequency
    const fc = 1 / (2 * Math.PI * R * C);
    
    // Calculate response at different frequencies
    const frequencies = [];
    const decades = 4;
    const pointsPerDecade = 10;
    const fStart = fc / 100;
    
    for (let i = 0; i <= decades * pointsPerDecade; i++) {
      const f = fStart * Math.pow(10, i / pointsPerDecade);
      const ratio = f / fc;
      // Calculate magnitude in dB
      const magnitude = filterType === 'lowpass'
        ? -20 * Math.log10(Math.sqrt(1 + Math.pow(ratio, 2)))
        : -20 * Math.log10(Math.sqrt(1 + Math.pow(1/ratio, 2)));
      
      frequencies.push({ frequency: f, magnitude });
    }

    setResults({
      cutoffFrequency: fc,
      frequencies,
      timeConstant: R * C,
    });
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
                    Cutoff Frequency (f₀): {(results.cutoffFrequency).toFixed(2)} Hz
                  </Typography>
                  <Typography variant="subtitle1">
                    Time Constant (τ): {(results.timeConstant * 1000).toFixed(2)} ms
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Frequency Response:
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <Grid container spacing={1}>
                    {results.frequencies.filter((_, i) => i % 10 === 0).map((point, index) => (
                      <Grid item xs={6} key={index}>
                        <Paper variant="outlined" sx={{ p: 1 }}>
                          <Typography variant="body2">
                            At {point.frequency.toFixed(1)} Hz: {point.magnitude.toFixed(1)} dB
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Circuit Diagram:
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '200px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <pre style={{ fontFamily: 'monospace', fontSize: '14px' }}>
              {filterType === 'lowpass' ? `
Vin
  |
  ⎯⎯⎯[R]⎯⎯⎯
  |         |
  |         |
  |        Vout
  |         |
  ⎯⎯⎯[C]⎯⎯⎯
  |         |
  ⎯⎯⎯⎯GND⎯⎯⎯
` : `
Vin
  |
  ⎯⎯⎯[C]⎯⎯⎯
  |         |
  |         |
  |        Vout
  |         |
  ⎯⎯⎯[R]⎯⎯⎯
  |         |
  ⎯⎯⎯⎯GND⎯⎯⎯
`}
            </pre>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RcFilterCalculator;
