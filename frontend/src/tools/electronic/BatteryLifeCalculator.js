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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

// Battery chemistry presets with their characteristics
const BATTERY_CHEMISTRIES = {
  'li-ion': {
    name: 'Lithium-Ion',
    nominalVoltage: 3.7,
    maxDischarge: 0.8, // Can typically use 80% of rated capacity
    typicalEfficiency: 0.9,
    dischargeCurve: [
      { capacity: 100, voltage: 4.2 },
      { capacity: 90, voltage: 4.0 },
      { capacity: 80, voltage: 3.8 },
      { capacity: 70, voltage: 3.7 },
      { capacity: 60, voltage: 3.65 },
      { capacity: 50, voltage: 3.6 },
      { capacity: 40, voltage: 3.55 },
      { capacity: 30, voltage: 3.5 },
      { capacity: 20, voltage: 3.4 },
      { capacity: 10, voltage: 3.3 },
      { capacity: 5, voltage: 3.0 },
      { capacity: 0, voltage: 2.7 },
    ],
  },
  'lipo': {
    name: 'Lithium Polymer',
    nominalVoltage: 3.7,
    maxDischarge: 0.8,
    typicalEfficiency: 0.9,
    dischargeCurve: [
      { capacity: 100, voltage: 4.2 },
      { capacity: 90, voltage: 4.0 },
      { capacity: 80, voltage: 3.8 },
      { capacity: 70, voltage: 3.7 },
      { capacity: 60, voltage: 3.65 },
      { capacity: 50, voltage: 3.6 },
      { capacity: 40, voltage: 3.55 },
      { capacity: 30, voltage: 3.5 },
      { capacity: 20, voltage: 3.4 },
      { capacity: 10, voltage: 3.3 },
      { capacity: 5, voltage: 3.0 },
      { capacity: 0, voltage: 2.7 },
    ],
  },
  'lifepo4': {
    name: 'LiFePO4',
    nominalVoltage: 3.2,
    maxDischarge: 0.9, // Can use up to 90% of rated capacity
    typicalEfficiency: 0.95,
    dischargeCurve: [
      { capacity: 100, voltage: 3.65 },
      { capacity: 90, voltage: 3.4 },
      { capacity: 80, voltage: 3.3 },
      { capacity: 70, voltage: 3.25 },
      { capacity: 60, voltage: 3.2 },
      { capacity: 50, voltage: 3.2 },
      { capacity: 40, voltage: 3.2 },
      { capacity: 30, voltage: 3.2 },
      { capacity: 20, voltage: 3.15 },
      { capacity: 10, voltage: 3.0 },
      { capacity: 5, voltage: 2.7 },
      { capacity: 0, voltage: 2.5 },
    ],
  },
  'nimh': {
    name: 'NiMH',
    nominalVoltage: 1.2,
    maxDischarge: 0.7,
    typicalEfficiency: 0.8,
    dischargeCurve: [
      { capacity: 100, voltage: 1.4 },
      { capacity: 90, voltage: 1.3 },
      { capacity: 80, voltage: 1.25 },
      { capacity: 70, voltage: 1.23 },
      { capacity: 60, voltage: 1.2 },
      { capacity: 50, voltage: 1.18 },
      { capacity: 40, voltage: 1.15 },
      { capacity: 30, voltage: 1.12 },
      { capacity: 20, voltage: 1.05 },
      { capacity: 10, voltage: 1.0 },
      { capacity: 5, voltage: 0.9 },
      { capacity: 0, voltage: 0.8 },
    ],
  },
  'lead-acid': {
    name: 'Lead Acid',
    nominalVoltage: 2.0,
    maxDischarge: 0.5, // Typically only use 50% to preserve life
    typicalEfficiency: 0.75,
    dischargeCurve: [
      { capacity: 100, voltage: 2.1 },
      { capacity: 90, voltage: 2.08 },
      { capacity: 80, voltage: 2.05 },
      { capacity: 70, voltage: 2.03 },
      { capacity: 60, voltage: 2.0 },
      { capacity: 50, voltage: 1.98 },
      { capacity: 40, voltage: 1.95 },
      { capacity: 30, voltage: 1.93 },
      { capacity: 20, voltage: 1.9 },
      { capacity: 10, voltage: 1.85 },
      { capacity: 5, voltage: 1.7 },
      { capacity: 0, voltage: 1.5 },
    ],
  },
};

const BatteryLifeCalculator = () => {
  const [values, setValues] = useState({
    capacity: '',
    current: '',
    efficiency: '85',
    dutyCycle: '100',
    chemistry: 'li-ion',
    cells: '1',
  });

  const [units, setUnits] = useState({
    capacity: 'mAh',
    current: 'mA',
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues(prev => {
      const newValues = {
        ...prev,
        [name]: value,
      };
      
      // Update efficiency when chemistry changes
      if (name === 'chemistry') {
        newValues.efficiency = (BATTERY_CHEMISTRIES[value].typicalEfficiency * 100).toString();
      }
      
      return newValues;
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
    const cells = parseInt(values.cells);
    const chemistry = BATTERY_CHEMISTRIES[values.chemistry];

    // Calculate effective current draw considering duty cycle
    const effectiveCurrent = current * dutyCycle;

    // Calculate battery voltage and energy
    const totalVoltage = chemistry.nominalVoltage * cells;
    const wattHours = (capacity * totalVoltage) / 1000; // Convert mAh to Wh
    const usableWattHours = wattHours * chemistry.maxDischarge * efficiency;

    // Calculate power consumption
    const powerConsumption = (effectiveCurrent * totalVoltage) / 1000; // in watts

    // Calculate battery life in hours
    const batteryLife = usableWattHours / powerConsumption;

    // Calculate various time formats
    const days = Math.floor(batteryLife / 24);
    const hours = Math.floor(batteryLife % 24);
    const minutes = Math.floor((batteryLife * 60) % 60);

    setResults({
      batteryLife,
      days,
      hours,
      minutes,
      effectiveCurrent,
      powerConsumption,
      totalVoltage,
      wattHours,
      usableWattHours,
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Battery Life Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Estimate battery life based on chemistry, capacity, and usage pattern
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl fullWidth>
                <InputLabel>Battery Chemistry</InputLabel>
                <Select
                  value={values.chemistry}
                  label="Battery Chemistry"
                  name="chemistry"
                  onChange={handleInputChange}
                >
                  {Object.entries(BATTERY_CHEMISTRIES).map(([key, { name }]) => (
                    <MenuItem key={key} value={key}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="Different chemistries have different characteristics affecting battery life">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Number of Cells"
                name="cells"
                type="number"
                value={values.cells}
                onChange={handleInputChange}
                inputProps={{ min: "1", step: "1" }}
              />
              <Tooltip title="Number of cells in series">
                <InfoIcon color="action" />
              </Tooltip>
            </Box>
          </Grid>

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
          <>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Battery Life:</Typography>
                  <Typography>
                    {results.days} days, {results.hours} hours, {results.minutes} minutes
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Total Battery Voltage:</Typography>
                  <Typography>{results.totalVoltage.toFixed(1)} V</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Total Energy:</Typography>
                  <Typography>{results.wattHours.toFixed(2)} Wh</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Usable Energy:</Typography>
                  <Typography>{results.usableWattHours.toFixed(2)} Wh</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Effective Current Draw:</Typography>
                  <Typography>
                    {(results.effectiveCurrent / 1000).toFixed(2)} A
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Power Consumption:</Typography>
                  <Typography>{results.powerConsumption.toFixed(2)} W</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Discharge Curve
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Typical voltage vs. capacity curve for {BATTERY_CHEMISTRIES[values.chemistry].name} battery
                {parseInt(values.cells) > 1 ? ` (${values.cells} cells in series)` : ''}
              </Typography>
              <Box sx={{ width: '100%', height: 400, pb: 4 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={BATTERY_CHEMISTRIES[values.chemistry].dischargeCurve.map(point => ({
                      ...point,
                      voltage: point.voltage * parseInt(values.cells),
                    }))}
                    margin={{ top: 20, right: 80, left: 50, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="capacity"
                      label={{ value: 'Remaining Capacity (%)', position: 'bottom', offset: 15 }}
                      padding={{ left: 10, right: 10 }}
                      domain={[100, 0]}
                    />
                    <YAxis
                      label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', offset: 10 }}
                      domain={['auto', 'auto']}
                      padding={{ top: 20, bottom: 20 }}
                    />
                    <RechartsTooltip
                      formatter={(value, name) => [
                        name === 'voltage' ? `${value.toFixed(2)}V` : `${value}%`,
                        name === 'voltage' ? 'Voltage' : 'Capacity'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="voltage"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                • The discharge curve shows how battery voltage changes as capacity depletes
                <br />
                • Actual curve may vary based on temperature, age, and discharge rate
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            About this Tool
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Battery Chemistry Types
          </Typography>
          <Typography paragraph>
            • <strong>Lithium-Ion (Li-ion):</strong> High energy density, 3.7V nominal, good for portable devices
            <br />
            • <strong>Lithium Polymer (LiPo):</strong> Similar to Li-ion, more flexible form factor, good for thin devices
            <br />
            • <strong>LiFePO4:</strong> Very stable, long cycle life, 3.2V nominal, good for solar and backup power
            <br />
            • <strong>NiMH:</strong> 1.2V nominal, good capacity, economical, suitable for consumer devices
            <br />
            • <strong>Lead Acid:</strong> 2.0V nominal, heavy but reliable, common in vehicles and UPS systems
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Key Characteristics
          </Typography>
          <Typography paragraph>
            • <strong>Nominal Voltage:</strong> The typical operating voltage of the battery
            <br />
            • <strong>Maximum Discharge:</strong> Safe depth of discharge to maintain battery life
            <br />
            • <strong>Efficiency:</strong> Energy conversion efficiency including losses
            <br />
            • <strong>Duty Cycle:</strong> Percentage of time the device is actively drawing current
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Energy Calculations
          </Typography>
          <Typography paragraph>
            • <strong>Watt-hours (Wh):</strong> Total energy = Voltage × Capacity (in Ah)
            <br />
            • <strong>Usable Energy:</strong> Accounts for chemistry-specific discharge limits and efficiency
            <br />
            • <strong>Multiple Cells:</strong> Total voltage increases with cells in series
            <br />
            • <strong>Power Draw:</strong> Calculated as Voltage × Current
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Discharge Curve
          </Typography>
          <Typography paragraph>
            • Shows voltage variation across the battery's discharge cycle
            <br />
            • Different chemistries have characteristic discharge profiles:
            <br />
            &nbsp;&nbsp;- Li-ion/LiPo: Relatively flat middle section
            <br />
            &nbsp;&nbsp;- LiFePO4: Very flat discharge curve
            <br />
            &nbsp;&nbsp;- NiMH: More linear voltage drop
            <br />
            &nbsp;&nbsp;- Lead Acid: Steeper voltage decline
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Usage Tips
          </Typography>
          <Typography paragraph>
            • Consider temperature effects on battery capacity
            <br />
            • Account for aging effects in long-term applications
            <br />
            • Add safety margin for critical applications
            <br />
            • Monitor actual usage to refine calculations
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default BatteryLifeCalculator;
