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
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AdcCalculator = () => {
  // Default values as strings to avoid decimal syntax issues
  const defaultAdcRef = '3.3';
  const defaultAdcRes = '10';
  const defaultQuiescentCurrent = '5';
  const defaultThermalResistance = '65';

  const [values, setValues] = useState({
    inputVoltageMin: '',
    inputVoltageMax: '',
    adcVoltageRef: defaultAdcRef,
    adcResolution: defaultAdcRes,
    r1: '',
    r2: '',
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const standardResistors = [
    100, 220, 330, 470, 680, 1000, 2200, 3300, 4700, 6800,
    10000, 22000, 33000, 47000, 68000, 100000, 220000, 330000, 470000, 1000000
  ];

  const handleInputChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const findClosestStandardResistors = (targetRatio) => {
    let bestR1 = 0;
    let bestR2 = 0;
    let bestError = Number.MAX_VALUE;

    for (const r1 of standardResistors) {
      for (const r2 of standardResistors) {
        const ratio = r2 / (r1 + r2);
        const error = Math.abs(ratio - targetRatio);

        if (error < bestError) {
          bestError = error;
          bestR1 = r1;
          bestR2 = r2;
        }
      }
    }

    return { r1: bestR1, r2: bestR2 };
  };

  const calculateRecommendedResistors = () => {
    const Vin_max = parseFloat(values.inputVoltageMax);
    const Vadc = parseFloat(values.adcVoltageRef);
    
    const targetRatio = Vadc / Vin_max;
    const { r1, r2 } = findClosestStandardResistors(targetRatio);
    const actualRatio = r2 / (r1 + r2);
    const actualMaxVoltage = Vadc / actualRatio;
    
    return {
      r1,
      r2,
      actualRatio,
      actualMaxVoltage,
      currentDraw: (Vin_max / (r1 + r2)) * 1000,
    };
  };

  const calculate = () => {
    try {
      const Vin_min = parseFloat(values.inputVoltageMin);
      const Vin_max = parseFloat(values.inputVoltageMax);
      const Vadc = parseFloat(values.adcVoltageRef);
      const bits = parseInt(values.adcResolution);
      const R1 = parseFloat(values.r1);
      const R2 = parseFloat(values.r2);

      if (Vin_max <= Vin_min) {
        throw new Error('Maximum voltage must be greater than minimum voltage');
      }

      if (R1 <= 0 || R2 <= 0) {
        throw new Error('Resistor values must be greater than 0');
      }

      const ratio = R2 / (R1 + R2);
      const Vout_min = Vin_min * ratio;
      const Vout_max = Vin_max * ratio;

      const maxCount = Math.pow(2, bits) - 1;
      const resolution = Vadc / maxCount;
      const counts_min = Math.floor(Vout_min / resolution);
      const counts_max = Math.floor(Vout_max / resolution);

      const actual_min = counts_min * resolution;
      const actual_max = counts_max * resolution;

      const current = (Vin_max / (R1 + R2)) * 1000;

      let rangeStatus = 'optimal';
      if (Vout_max > Vadc) {
        rangeStatus = 'overflow';
      } else if (Vout_max < (Vadc * 0.9)) {
        rangeStatus = 'underutilized';
      }

      setResults({
        dividerRatio: ratio,
        outputRange: { min: Vout_min, max: Vout_max },
        adcCounts: { min: counts_min, max: counts_max },
        resolution,
        actualVoltages: { min: actual_min, max: actual_max },
        rangeStatus,
        currentDraw: current,
        usedBits: Math.floor(Math.log2(counts_max - counts_min + 1)),
      });

      if (rangeStatus !== 'optimal') {
        const rec = calculateRecommendedResistors();
        setRecommendations(rec);
      } else {
        setRecommendations(null);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const formatNumber = (num, decimals = 3) => {
    return Number(num).toFixed(decimals);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ADC Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Design and validate voltage dividers for ADC inputs
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Input Voltage (Min)"
                name="inputVoltageMin"
                type="number"
                value={values.inputVoltageMin}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'V',
                }}
              />
              <Tooltip title="Minimum voltage to measure">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Input Voltage (Max)"
                name="inputVoltageMax"
                type="number"
                value={values.inputVoltageMax}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'V',
                }}
              />
              <Tooltip title="Maximum voltage to measure">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="ADC Reference Voltage"
                name="adcVoltageRef"
                type="number"
                value={values.adcVoltageRef}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'V',
                }}
              />
              <Tooltip title="ADC reference voltage (usually 3.3V or 5V)">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl fullWidth>
                <InputLabel>ADC Resolution</InputLabel>
                <Select
                  value={values.adcResolution}
                  label="ADC Resolution"
                  name="adcResolution"
                  onChange={handleInputChange}
                >
                  <MenuItem value="8">8-bit</MenuItem>
                  <MenuItem value="10">10-bit</MenuItem>
                  <MenuItem value="12">12-bit</MenuItem>
                  <MenuItem value="16">16-bit</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Number of bits in ADC conversion">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Voltage Divider Resistors
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="R1 (Top)"
                name="r1"
                type="number"
                value={values.r1}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'ohm',
                }}
              />
              <Tooltip title="Top resistor in voltage divider">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="R2 (Bottom)"
                name="r2"
                type="number"
                value={values.r2}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'ohm',
                }}
              />
              <Tooltip title="Bottom resistor in voltage divider">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

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
                  <Typography variant="subtitle1" gutterBottom>
                    Voltage Divider Output:
                  </Typography>
                  <Typography>
                    • Range: {formatNumber(results.outputRange.min)}V to {formatNumber(results.outputRange.max)}V
                  </Typography>
                  <Typography>
                    • Ratio: {formatNumber(results.dividerRatio * 100, 1)}%
                  </Typography>
                  <Typography>
                    • Current Draw: {formatNumber(results.currentDraw, 1)} µA
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    ADC Performance:
                  </Typography>
                  <Typography>
                    • Resolution: {formatNumber(results.resolution * 1000, 2)} mV per count
                  </Typography>
                  <Typography>
                    • Count Range: {results.adcCounts.min} to {results.adcCounts.max}
                  </Typography>
                  <Typography>
                    • Effective Resolution: {results.usedBits} bits
                  </Typography>
                  <Typography>
                    • Actual Voltage Range: {formatNumber(results.actualVoltages.min)}V to {formatNumber(results.actualVoltages.max)}V
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Alert 
                  severity={
                    results.rangeStatus === 'optimal' ? 'success' :
                    results.rangeStatus === 'overflow' ? 'error' : 'warning'
                  }
                >
                  {results.rangeStatus === 'optimal' && 'Voltage divider ratio is optimal for the ADC range'}
                  {results.rangeStatus === 'overflow' && 'Warning: Output voltage exceeds ADC reference voltage!'}
                  {results.rangeStatus === 'underutilized' && 'Note: ADC range is not fully utilized'}
                </Alert>
              </Grid>

              {recommendations && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Recommended Resistor Values:
                    </Typography>
                    <Typography>
                      • R1 (Top): {recommendations.r1.toLocaleString()} ohm
                    </Typography>
                    <Typography>
                      • R2 (Bottom): {recommendations.r2.toLocaleString()} ohm
                    </Typography>
                    <Typography>
                      • Resulting Max Voltage: {formatNumber(recommendations.actualMaxVoltage, 2)}V
                    </Typography>
                    <Typography>
                      • Current Draw: {formatNumber(recommendations.currentDraw, 1)} µA
                    </Typography>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Design Considerations:
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography paragraph>
                    • Keep total resistance high enough to limit current draw (typically &lt; 1mA)
                  </Typography>
                  <Typography paragraph>
                    • Consider using 1% tolerance resistors for better accuracy
                  </Typography>
                  <Typography paragraph>
                    • Add a small capacitor (0.1µF) in parallel with R2 for noise filtering
                  </Typography>
                  <Typography>
                    • Use multiple ADC samples and averaging for better resolution
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AdcCalculator;
