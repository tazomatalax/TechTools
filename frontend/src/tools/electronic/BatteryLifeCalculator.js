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

const BatteryLifeCalculator = () => {
  const [values, setValues] = useState({
    capacity: '',
    current: '',
    efficiency: '85',
    dutyCycle: '100',
  });

  const [units, setUnits] = useState({
    capacity: 'mAh',
    current: 'mA',
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
    // Convert all values to base units (mAh and mA)
    const capacity = parseFloat(values.capacity) * (units.capacity === 'Ah' ? 1000 : 1);
    const current = parseFloat(values.current) * (units.current === 'A' ? 1000 : 1);
    const efficiency = parseFloat(values.efficiency) / 100;
    const dutyCycle = parseFloat(values.dutyCycle) / 100;

    // Calculate effective current draw considering duty cycle
    const effectiveCurrent = current * dutyCycle;

    // Calculate battery life in hours
    const batteryLife = (capacity * efficiency) / effectiveCurrent;

    // Calculate various time formats
    const days = Math.floor(batteryLife / 24);
    const hours = Math.floor(batteryLife % 24);
    const minutes = Math.floor((batteryLife * 60) % 60);

    // Calculate power consumption
    const nominalVoltage = getBatteryVoltage(units.capacity);
    const powerConsumption = (effectiveCurrent * nominalVoltage) / 1000; // in watts

    setResults({
      batteryLife,
      days,
      hours,
      minutes,
      effectiveCurrent,
      powerConsumption,
      nominalVoltage,
    });
  };

  // Helper function to estimate battery voltage based on capacity unit
  const getBatteryVoltage = (capacityUnit) => {
    // This is a simple estimation - in reality, battery voltage varies with chemistry and state of charge
    return capacityUnit === 'Ah' ? 12 : 3.7; // Assume 12V for Ah (lead acid), 3.7V for mAh (Li-ion)
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Battery Life Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Estimate battery life based on capacity, load current, and usage pattern
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Battery Capacity"
                name="capacity"
                type="number"
                value={values.capacity}
                onChange={handleInputChange}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={units.capacity}
                  label="Unit"
                  name="capacity"
                  onChange={handleUnitChange}
                >
                  <MenuItem value="mAh">mAh</MenuItem>
                  <MenuItem value="Ah">Ah</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Load Current"
                name="current"
                type="number"
                value={values.current}
                onChange={handleInputChange}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={units.current}
                  label="Unit"
                  name="current"
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
                label="Battery Efficiency"
                name="efficiency"
                type="number"
                value={values.efficiency}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: '%',
                }}
              />
              <Tooltip title="Accounts for battery self-discharge and conversion losses">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Duty Cycle"
                name="dutyCycle"
                type="number"
                value={values.dutyCycle}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: '%',
                }}
              />
              <Tooltip title="Percentage of time the device is active">
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
                  <Typography variant="subtitle1" gutterBottom>
                    Estimated Battery Life:
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {results.days > 0 && `${results.days} days, `}
                    {results.hours} hours, {results.minutes} minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({results.batteryLife.toFixed(2)} hours total)
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">
                    Effective Current Draw: {results.effectiveCurrent.toFixed(2)} mA
                  </Typography>
                  <Typography variant="subtitle1">
                    Power Consumption: {results.powerConsumption.toFixed(2)} W
                  </Typography>
                  <Typography variant="subtitle1">
                    Nominal Battery Voltage: {results.nominalVoltage.toFixed(1)} V
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Notes:
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography paragraph>
                    • Battery life is an estimate and may vary based on:
                  </Typography>
                  <Typography sx={{ pl: 2 }} paragraph>
                    - Temperature conditions
                  </Typography>
                  <Typography sx={{ pl: 2 }} paragraph>
                    - Battery age and condition
                  </Typography>
                  <Typography sx={{ pl: 2 }} paragraph>
                    - Varying load conditions
                  </Typography>
                  <Typography>
                    • For more accurate results, consider using a battery monitor in your application
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

export default BatteryLifeCalculator;
