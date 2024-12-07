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
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const PcbTraceCalculator = () => {
  const [values, setValues] = useState({
    current: '',
    temperature: '10',
    thickness: '35',
    length: '10',
    ambientTemp: '25',
    layerType: 'external',
    maxVoltageDrop: '100',
    limitVoltageDrop: false
  });
  const [units, setUnits] = useState({
    current: 'mA',
    length: 'mm',
  });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

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

  const validateFields = () => {
    const newErrors = {};
    
    // Current validation
    const current = parseFloat(values.current);
    if (!current || current <= 0) {
      newErrors.current = 'Current must be greater than 0';
    } else if (current > 1000000 * (units.current === 'mA' ? 1 : 0.001)) { // 1000A max
      newErrors.current = 'Current exceeds maximum limit of 1000A';
    }

    // Temperature rise validation
    const tempRise = parseFloat(values.temperature);
    if (!tempRise || tempRise <= 0) {
      newErrors.temperature = 'Temperature rise must be greater than 0°C';
    } else if (tempRise > 120) {
      newErrors.temperature = 'Temperature rise should not exceed 120°C';
    }

    // Ambient temperature validation
    const ambientTemp = parseFloat(values.ambientTemp);
    if (isNaN(ambientTemp)) {
      newErrors.ambientTemp = 'Invalid ambient temperature';
    } else if (ambientTemp < -50 || ambientTemp > 125) {
      newErrors.ambientTemp = 'Ambient temperature must be between -50°C and 125°C';
    }

    // Copper thickness validation
    const thickness = parseFloat(values.thickness);
    if (!thickness || thickness <= 0) {
      newErrors.thickness = 'Copper thickness must be greater than 0';
    } else if (thickness > 420) { // 12oz copper max
      newErrors.thickness = 'Copper thickness exceeds maximum (420μm)';
    }

    // Length validation
    const length = parseFloat(values.length);
    if (!length || length <= 0) {
      newErrors.length = 'Length must be greater than 0';
    } else if (length > 10000) { // 10m max
      newErrors.length = 'Length exceeds maximum limit';
    }

    // Voltage drop validation (only if enabled)
    if (values.limitVoltageDrop) {
      const maxVoltageDrop = parseFloat(values.maxVoltageDrop);
      if (!maxVoltageDrop || maxVoltageDrop <= 0) {
        newErrors.maxVoltageDrop = 'Voltage drop must be greater than 0';
      } else if (maxVoltageDrop > 1000) { // 1V max
        newErrors.maxVoltageDrop = 'Voltage drop exceeds maximum (1000mV)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validateFields()) {
      return;
    }
    // Convert current to amps
    const current = parseFloat(values.current) * (units.current === 'mA' ? 0.001 : 1);
    
    // Convert length to meters
    const length = parseFloat(values.length) * (units.length === 'mm' ? 0.001 : 0.0254);
    
    // User specified temperature rise in °C
    const specifiedTempRise = parseFloat(values.temperature);
    
    // Ambient temperature in °C
    const ambientTemp = parseFloat(values.ambientTemp);
    
    // Maximum allowable temperature for FR4 is typically 130°C
    const maxTemp = 130;
    
    // Calculate available temperature rise (difference between max temp and ambient)
    const availableTempRise = maxTemp - ambientTemp;
    
    // Use the smaller of the specified rise and available rise, but ensure it's at least 1°C
    const effectiveTempRise = Math.max(Math.min(specifiedTempRise, availableTempRise), 1);
    
    // Copper thickness in microns (1 oz/ft² = 35 microns)
    const thickness = parseFloat(values.thickness);
    
    // Constants for copper
    const resistivity = 1.68e-8; // Ω⋅m at 20°C
    const tempCoeff = 0.0039; // per °C
    
    // Adjust resistivity for ambient temperature
    const adjustedResistivity = resistivity * (1 + tempCoeff * (ambientTemp - 20));
    
    // Convert thickness from microns to meters
    const thicknessInMeters = thickness * 1e-6;
    
    // Calculate minimum width using IPC-2221 formula
    // I = k × ΔT^0.44 × A^0.725
    // where A is the cross-sectional area in mils²
    const k = values.layerType === 'external' ? 0.048 : 0.024; // constant for external/internal traces
    
    // Calculate required area in square mils
    const area = Math.pow(current / (k * Math.pow(effectiveTempRise, 0.44)), 1/0.725);
    
    // Convert area to width (given thickness)
    // First convert area from sq mils to sq meters
    const areaInSqMeters = area * (6.4516e-10); // 1 sq mil = 6.4516e-10 sq meters
    
    // Calculate width in meters
    const width = areaInSqMeters / thicknessInMeters;
    
    // Calculate resistance (using SI units)
    const resistance = (adjustedResistivity * length) / (width * thicknessInMeters);
    
    // Calculate power loss
    const powerLoss = current * current * resistance;

    // Calculate voltage drop (V = IR)
    const voltageDrop = current * resistance;

    // Calculate recommended width with 25% safety margin
    let recommendedWidth = width * 1.25;
    let finalVoltageDrop = voltageDrop;
    let voltageDropLimited = false;

    // If voltage drop limiting is enabled, calculate minimum width needed for voltage drop
    if (values.limitVoltageDrop) {
      const maxVoltageDrop = parseFloat(values.maxVoltageDrop) / 1000; // Convert from mV to V
      
      // Calculate required width for target voltage drop
      // V = IR, R = (ρ * L) / (w * t)
      // Solve for w: w = (ρ * L * I) / (V * t)
      // All units must be in base SI units (m, A, V, Ω)
      const minWidthForVoltageDrop = (adjustedResistivity * length * current) / (maxVoltageDrop * (thickness * 1e-6));
      
      if (minWidthForVoltageDrop > recommendedWidth) {
        recommendedWidth = minWidthForVoltageDrop;
        voltageDropLimited = true;
        
        // Recalculate resistance and voltage drop with new width
        const newResistance = (adjustedResistivity * length) / (recommendedWidth * (thickness * 1e-6));
        finalVoltageDrop = current * newResistance;
      }
    }
    
    // Convert recommendedWidth from meters to mm
    recommendedWidth = recommendedWidth * 1000;
    
    // Calculate current density in A/mm²
    const currentDensity = current / (recommendedWidth * thicknessInMeters * 1000); // Convert m² to mm²
    
    setResults({
      width: width * 1000, // Convert to mm
      recommendedWidth,
      resistance,
      voltageDrop: finalVoltageDrop,
      powerLoss: finalVoltageDrop * current,
      currentDensity,
      effectiveTempRise,
      availableTempRise,
      specifiedTempRise,
      voltageDropLimited
    });
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        {/* Calculator Panel */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
              PCB Trace Width Calculator
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Calculate the minimum trace width needed for a given current and temperature rise
            </Typography>

            <Grid container spacing={3}>
              {/* First Row */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Current"
                    type="number"
                    name="current"
                    value={values.current}
                    onChange={handleInputChange}
                    error={!!errors.current}
                    helperText={errors.current}
                    InputProps={{
                      sx: { bgcolor: 'background.default' }
                    }}
                  />
                  <FormControl sx={{ minWidth: 80 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={units.current}
                      name="current"
                      label="Unit"
                      onChange={handleUnitChange}
                      sx={{ bgcolor: 'background.default' }}
                    >
                      <MenuItem value="mA">mA</MenuItem>
                      <MenuItem value="A">A</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Temperature Rise"
                  type="number"
                  name="temperature"
                  value={values.temperature}
                  onChange={handleInputChange}
                  error={!!errors.temperature}
                  helperText={errors.temperature}
                  InputProps={{
                    endAdornment: <Typography>°C</Typography>,
                    sx: { bgcolor: 'background.default' }
                  }}
                />
              </Grid>

              {/* Second Row */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ambient Temperature"
                  type="number"
                  name="ambientTemp"
                  value={values.ambientTemp}
                  onChange={handleInputChange}
                  error={!!errors.ambientTemp}
                  helperText={errors.ambientTemp}
                  InputProps={{
                    endAdornment: <Typography>°C</Typography>,
                    sx: { bgcolor: 'background.default' }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Copper Thickness"
                  type="number"
                  name="thickness"
                  value={values.thickness}
                  onChange={handleInputChange}
                  error={!!errors.thickness}
                  helperText={errors.thickness}
                  InputProps={{
                    endAdornment: <Typography>μm</Typography>,
                    sx: { bgcolor: 'background.default' }
                  }}
                />
              </Grid>

              {/* Third Row */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Trace Length"
                    type="number"
                    name="length"
                    value={values.length}
                    onChange={handleInputChange}
                    error={!!errors.length}
                    helperText={errors.length}
                    InputProps={{
                      sx: { bgcolor: 'background.default' }
                    }}
                  />
                  <FormControl sx={{ minWidth: 80 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={units.length}
                      name="length"
                      label="Unit"
                      onChange={handleUnitChange}
                      sx={{ bgcolor: 'background.default' }}
                    >
                      <MenuItem value="mm">mm</MenuItem>
                      <MenuItem value="in">in</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Layer Type</InputLabel>
                  <Select
                    name="layerType"
                    value={values.layerType}
                    label="Layer Type"
                    onChange={handleInputChange}
                    sx={{ bgcolor: 'background.default' }}
                  >
                    <MenuItem value="external">External (Top/Bottom)</MenuItem>
                    <MenuItem value="internal">Internal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Voltage Drop Limit Row */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 1,
                  mt: 1
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.limitVoltageDrop}
                        onChange={(e) => setValues(prev => ({
                          ...prev,
                          limitVoltageDrop: e.target.checked
                        }))}
                        name="limitVoltageDrop"
                      />
                    }
                    label="Limit voltage drop"
                  />
                  <TextField
                    label="Maximum voltage drop"
                    type="number"
                    name="maxVoltageDrop"
                    value={values.maxVoltageDrop}
                    onChange={handleInputChange}
                    error={!!errors.maxVoltageDrop}
                    helperText={errors.maxVoltageDrop}
                    disabled={!values.limitVoltageDrop}
                    InputProps={{
                      endAdornment: <Typography>mV</Typography>,
                      sx: { bgcolor: 'background.default' }
                    }}
                    sx={{ width: 200 }}
                  />
                </Box>
              </Grid>

              {/* Calculate Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={calculate}
                  fullWidth
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Calculate
                </Button>
              </Grid>

              {/* Results Section */}
              {results && (
                <Grid item xs={12}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3,
                      mt: 2,
                      bgcolor: 'background.default'
                    }}
                  >
                    <Typography variant="subtitle1" color="primary" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                      Recommended Trace Width: {results.recommendedWidth.toFixed(2)} mm ({(results.recommendedWidth / 0.0254).toFixed(2)} mils)
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                        ({results.voltageDropLimited ? 'limited by voltage drop' : 'includes 25% safety margin'})
                      </Typography>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                      Minimum Trace Width: {results.width.toFixed(2)} mm ({(results.width / 0.0254).toFixed(2)} mils)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Maximum temperature: {(parseFloat(values.ambientTemp) + results.effectiveTempRise).toFixed(1)}°C calculated from Tambient({values.ambientTemp}°C) + Trise({results.effectiveTempRise.toFixed(1)}°C)
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">
                          Trace Resistance: {(results.resistance * 1000).toFixed(2)} mΩ
                        </Typography>
                        <Typography variant="subtitle1">
                          Voltage Drop: {(results.voltageDrop * 1000).toFixed(2)} mV
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">
                          Power Loss: {(results.powerLoss * 1000).toFixed(2)} mW
                        </Typography>
                        <Typography variant="subtitle1">
                          Current Density: {results.currentDensity.toFixed(2)} A/mm²
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* About Panel */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              About this Tool
            </Typography>
            
            <Typography variant="body1" paragraph>
              This calculator helps PCB designers determine appropriate trace widths based on the IPC-2221 standard, which is the Generic Standard on Printed Board Design.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Key Features:
            </Typography>
            <Typography component="div" variant="body2">
              <ul>
                <li>Calculates minimum and recommended trace widths</li>
                <li>Accounts for both internal and external layers</li>
                <li>Considers ambient temperature effects</li>
                <li>Includes 25% safety margin in recommendations</li>
                <li>Supports both metric (mm) and imperial (mils) units</li>
              </ul>
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Calculations Include:
            </Typography>
            <Typography component="div" variant="body2">
              <ul>
                <li>Trace resistance based on copper resistivity</li>
                <li>Voltage drop across the trace</li>
                <li>Power loss in the trace</li>
                <li>Current density</li>
                <li>Maximum trace temperature</li>
              </ul>
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Design Considerations:
            </Typography>
            <Typography component="div" variant="body2">
              <ul>
                <li>Maximum PCB temperature limited to 130°C for FR4</li>
                <li>Different k-factors for internal (0.024) and external (0.048) layers</li>
                <li>Temperature effects on copper resistivity</li>
                <li>Manufacturing variations through safety margin</li>
              </ul>
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Formula Used:
            </Typography>
            <Typography variant="body2" paragraph>
              Based on IPC-2221 formula: I = k × ΔT^0.44 × A^0.725
              <br />
              where:
              <br />
              I = current in amps
              <br />
              k = conductor constant (0.048 for external layers, 0.024 for internal)
              <br />
              ΔT = temperature rise in °C
              <br />
              A = cross-sectional area in sq mils
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: This calculator provides guidelines based on thermal considerations. Additional factors such as impedance requirements, EMI concerns, or specific manufacturer capabilities may require different trace widths.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PcbTraceCalculator;
