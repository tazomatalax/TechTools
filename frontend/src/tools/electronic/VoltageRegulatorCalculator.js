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
  Divider,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const VoltageRegulatorCalculator = () => {
  const [values, setValues] = useState({
    inputVoltage: '',
    outputVoltage: '',
    loadCurrent: '',
    quiescentCurrent: '5', // typical value in mA
    thermalResistance: '65', // typical value in °C/W for TO-220 package
    ambientTemperature: '25',
  });

  const [units, setUnits] = useState({
    loadCurrent: 'mA',
  });

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

  const calculate = () => {
    // Convert values to base units
    const Vin = parseFloat(values.inputVoltage);
    const Vout = parseFloat(values.outputVoltage);
    const Iload = parseFloat(values.loadCurrent) * (units.loadCurrent === 'A' ? 1000 : 1); // convert to mA
    const Iq = parseFloat(values.quiescentCurrent); // in mA
    const Rth = parseFloat(values.thermalResistance); // °C/W
    const Tamb = parseFloat(values.ambientTemperature); // °C

    // Calculate voltage drop
    const Vdrop = Vin - Vout;

    // Calculate total current (load + quiescent)
    const Itotal = Iload + Iq;

    // Calculate power dissipation (W)
    const Pdiss = (Vdrop * Itotal) / 1000;

    // Calculate junction temperature
    const Tj = Tamb + (Pdiss * Rth);

    // Calculate efficiency
    const Pout = (Vout * Iload) / 1000;
    const Pin = (Vin * Itotal) / 1000;
    const efficiency = (Pout / Pin) * 100;

    // Calculate minimum input voltage (assuming 2V dropout)
    const minVin = Vout + 2;

    setResults({
      voltageDrop: Vdrop,
      powerDissipation: Pdiss,
      junctionTemperature: Tj,
      efficiency,
      minInputVoltage: minVin,
      totalCurrent: Itotal,
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Voltage Regulator Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Calculate power dissipation, efficiency, and thermal characteristics of linear voltage regulators
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Input Voltage"
                name="inputVoltage"
                type="number"
                value={values.inputVoltage}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'V',
                }}
              />
              <Tooltip title="Source voltage before the regulator">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Output Voltage"
                name="outputVoltage"
                type="number"
                value={values.outputVoltage}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'V',
                }}
              />
              <Tooltip title="Desired regulated output voltage">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Load Current"
                name="loadCurrent"
                type="number"
                value={values.loadCurrent}
                onChange={handleInputChange}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={units.loadCurrent}
                  label="Unit"
                  name="loadCurrent"
                  onChange={handleUnitChange}
                >
                  <MenuItem value="mA">mA</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Quiescent Current"
                name="quiescentCurrent"
                type="number"
                value={values.quiescentCurrent}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'mA',
                }}
              />
              <Tooltip title="Regulator's own current consumption (ground pin current)">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Thermal Resistance"
                name="thermalResistance"
                type="number"
                value={values.thermalResistance}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: '°C/W',
                }}
              />
              <Tooltip title="Junction-to-ambient thermal resistance (from datasheet)">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Ambient Temperature"
                name="ambientTemperature"
                type="number"
                value={values.ambientTemperature}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: '°C',
                }}
              />
              <Tooltip title="Environmental temperature">
                <InfoIcon color="action" />
              </Tooltip>
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
                    Power Dissipation: {results.powerDissipation.toFixed(2)} W
                  </Typography>
                  <Typography variant="subtitle1">
                    Junction Temperature: {results.junctionTemperature.toFixed(1)} °C
                  </Typography>
                  <Typography variant="subtitle1" color={results.junctionTemperature > 125 ? 'error' : 'inherit'}>
                    Temperature Status: {results.junctionTemperature > 125 ? 'EXCEEDS MAXIMUM!' : 'Within safe limits'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">
                    Voltage Drop: {results.voltageDrop.toFixed(2)} V
                  </Typography>
                  <Typography variant="subtitle1">
                    Efficiency: {results.efficiency.toFixed(1)}%
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Current: {results.totalCurrent.toFixed(1)} mA
                  </Typography>
                  <Typography variant="subtitle1">
                    Minimum Input Voltage: {results.minInputVoltage.toFixed(1)} V
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Recommendations:
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  {results.junctionTemperature > 125 && (
                    <Typography color="error" paragraph>
                      • Warning: Junction temperature exceeds maximum rating (125°C)!
                    </Typography>
                  )}
                  {results.efficiency < 50 && (
                    <Typography paragraph>
                      • Consider using a switching regulator for better efficiency
                    </Typography>
                  )}
                  {results.powerDissipation > 1 && (
                    <Typography paragraph>
                      • Heat sink recommended for power dissipation gretaer than 1W
                    </Typography>
                  )}
                  <Typography>
                    • Ensure adequate PCB copper area for thermal dissipation
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About this Tool
        </Typography>
        
        <Typography variant="body1" paragraph>
          The Voltage Regulator Calculator helps design power supply circuits using linear voltage regulators. It calculates key parameters like power dissipation, efficiency, and component requirements while ensuring safe operating conditions.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          Key Parameters
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li><strong>Dropout Voltage</strong>
              <br />• Minimum voltage difference required between input and output
              <br />• Varies by regulator type (LDO vs standard)
              <br />• Critical for efficiency and heat management
            </li>
            <li><strong>Power Dissipation</strong>
              <br />• P = (Vin - Vout) × Load Current
              <br />• Determines heatsink requirements
              <br />• Key factor in regulator selection
            </li>
            <li><strong>Efficiency</strong>
              <br />• η = (Vout × Iout) / (Vin × Iin) × 100%
              <br />• Higher with smaller input-output differential
              <br />• Trade-off between regulation and efficiency
            </li>
          </ul>
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          Design Considerations
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li><strong>Thermal Management</strong>
              <br />• Maximum junction temperature
              <br />• Thermal resistance calculations
              <br />• Heatsink selection criteria
            </li>
            <li><strong>Input/Output Capacitors</strong>
              <br />• Required for stability
              <br />• ESR requirements
              <br />• Placement guidelines
            </li>
            <li><strong>Protection Features</strong>
              <br />• Overcurrent protection
              <br />• Thermal shutdown
              <br />• Reverse polarity protection
            </li>
          </ul>
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          Common Applications
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Converting higher voltage supplies to logic levels (e.g., 12V to 5V/3.3V)</li>
            <li>Battery-powered devices with stable voltage requirements</li>
            <li>Sensitive analog circuits requiring clean power</li>
            <li>Point-of-load regulation in distributed power systems</li>
          </ul>
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          Usage Tips
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Always include margin in input voltage for dropout requirements</li>
            <li>Consider thermal design early in the project</li>
            <li>Check regulator datasheet for specific requirements</li>
            <li>Monitor efficiency for battery-powered applications</li>
          </ul>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: This calculator provides estimates for ideal conditions. Always consult component datasheets and consider safety margins in your final design.
        </Typography>
      </Paper>
    </Container>
  );
};

export default VoltageRegulatorCalculator;
