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

const VoltageDividerCalculator = () => {
  const [mode, setMode] = useState('voltage');
  const [values, setValues] = useState({
    inputVoltage: '',
    outputVoltage: '',
    r1: '',
    r2: '',
    current: '',
  });
  const [units, setUnits] = useState({
    r1: 'k',
    r2: 'k',
  });

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

  const handleModeChange = (event) => {
    setMode(event.target.value);
    setValues({
      inputVoltage: '',
      outputVoltage: '',
      r1: '',
      r2: '',
      current: '',
    });
  };

  const calculate = () => {
    const Vin = parseFloat(values.inputVoltage);
    const multiplier = {
      'k': 1000,
      'M': 1000000,
    };

    if (mode === 'voltage') {
      const Vout = parseFloat(values.outputVoltage);
      const R2 = parseFloat(values.r2) * multiplier[units.r2];
      
      // Calculate R1 based on desired output voltage
      const R1 = R2 * (Vin / Vout - 1);
      const current = Vin / (R1 + R2);

      setValues({
        ...values,
        r1: (R1 / multiplier[units.r1]).toFixed(2),
        current: (current * 1000).toFixed(2), // Convert to mA
      });
    } else {
      const R1 = parseFloat(values.r1) * multiplier[units.r1];
      const R2 = parseFloat(values.r2) * multiplier[units.r2];
      
      // Calculate output voltage and current
      const Vout = (Vin * R2) / (R1 + R2);
      const current = Vin / (R1 + R2);

      setValues({
        ...values,
        outputVoltage: Vout.toFixed(2),
        current: (current * 1000).toFixed(2), // Convert to mA
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Voltage Divider Calculator
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A voltage divider is a circuit that converts a higher voltage to a lower voltage using two resistors in series. This calculator helps you design voltage divider circuits by finding either the required resistor values or the output voltage.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Calculation Mode</InputLabel>
            <Select
              value={mode}
              label="Calculation Mode"
              onChange={handleModeChange}
            >
              <MenuItem value="voltage">Find R1 (given output voltage)</MenuItem>
              <MenuItem value="resistor">Find output voltage (given resistors)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
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
          </Grid>

          {mode === 'voltage' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Desired Output Voltage"
                name="outputVoltage"
                type="number"
                value={values.outputVoltage}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: 'V',
                }}
              />
            </Grid>
          )}

          {mode === 'voltage' ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="R2"
                  name="r2"
                  type="number"
                  value={values.r2}
                  onChange={handleInputChange}
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={units.r2}
                    label="Unit"
                    name="r2"
                    onChange={handleUnitChange}
                  >
                    <MenuItem value="k">kΩ</MenuItem>
                    <MenuItem value="M">MΩ</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="R1"
                    name="r1"
                    type="number"
                    value={values.r1}
                    onChange={handleInputChange}
                  />
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={units.r1}
                      label="Unit"
                      name="r1"
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
                    label="R2"
                    name="r2"
                    type="number"
                    value={values.r2}
                    onChange={handleInputChange}
                  />
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={units.r2}
                      label="Unit"
                      name="r2"
                      onChange={handleUnitChange}
                    >
                      <MenuItem value="k">kΩ</MenuItem>
                      <MenuItem value="M">MΩ</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
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

        {(values.outputVoltage || values.r1) && values.current && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            {mode === 'voltage' ? (
              <>
                <Typography>Required R1: {values.r1} {units.r1}Ω</Typography>
                <Typography>Current through divider: {values.current} mA</Typography>
              </>
            ) : (
              <>
                <Typography>Output Voltage: {values.outputVoltage} V</Typography>
                <Typography>Current through divider: {values.current} mA</Typography>
              </>
            )}
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
              p: 2,
            }}
          >
            <svg
              width="300"
              height="180"
              viewBox="0 0 80 47.652656"
              version="1.1"
            >
              <g transform="translate(-69.171965,-130.78132)">
                <g transform="matrix(0.26458333,0,0,0.26458333,86.661805,-83.084217)">
                  <path d="M 7,836.41665 H 21" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 3.5, strokeLinecap: 'round' }} />
                  <path d="m 55.999996,836.41665 h 14" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 3.5, strokeLinecap: 'round' }} />
                  <rect
                    y="829.41669"
                    x="21.000002"
                    height="13.999982"
                    width="34.999996"
                    style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 3.5, strokeLinecap: 'square', strokeLinejoin: 'round' }}
                  />
                </g>
                <g transform="matrix(0,0.26458333,-0.26458333,0,332.61413,144.48563)">
                  <path d="M 7,836.41665 H 21" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 3.5, strokeLinecap: 'round' }} />
                  <path d="m 55.999996,836.41665 h 14" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 3.5, strokeLinecap: 'round' }} />
                  <rect
                    y="829.41669"
                    x="21.000002"
                    height="13.999982"
                    width="34.999996"
                    style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 3.5, strokeLinecap: 'square', strokeLinejoin: 'round' }}
                  />
                </g>
                <circle
                  style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.926042, strokeLinecap: 'square', strokeLinejoin: 'round' }}
                  cx="77.04332"
                  cy="158.22531"
                  r="7.4083333"
                />
                <path d="m 77.043321,165.63364 v 3.70417" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.926042, strokeLinecap: 'round' }} />
                <path d="m 77.043321,150.81697 v -3.70416" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.926042, strokeLinecap: 'round' }} />
                <path d="M 78.432384,153.5951 H 75.654259" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.529167 }} />
                <path d="m 77.043321,154.98416 v -2.77812" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.529167 }} />
                <path d="M 78.432384,162.85552 H 75.654259" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.529167 }} />
                <path d="m 77.043321,147.11281 -2e-6,-8.89513 h 11.470568" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.79375 }} />
                <text
                  x="86.5"
                  y="155"
                  style={{ 
                    fontFamily: 'Arial',
                    fontSize: '5px',
                    fill: '#ffffff'
                  }}
                >
                  {`${values.inputVoltage || '?'}V`}
                </text>
                <text
                  x="95"
                  y="135"
                  style={{ 
                    fontFamily: 'Arial',
                    fontSize: '5px',
                    fill: '#ffffff',
                    textAnchor: 'middle'
                  }}
                >
                  {`R1 (${values.r1 || '?'}${units.r1})`}
                </text>
                <text
                  x="115"
                  y="158"
                  style={{ 
                    fontFamily: 'Arial',
                    fontSize: '5px',
                    fill: '#ffffff'
                  }}
                >
                  {`R2 (${values.r2 || '?'}${units.r2})`}
                </text>
                <text
                  x="130"
                  y="135"
                  style={{ 
                    fontFamily: 'Arial',
                    fontSize: '5px',
                    fill: '#ffffff'
                  }}
                >
                  {`${values.outputVoltage || '?'}V`}
                </text>
                <path d="m 77.043321,169.33781 v 8.69917 h 34.268909 v -15.03052" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.793999 }} />
                <path d="m 105.18264,138.21769 h 14.69243" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.793999 }} />
                <path d="m 111.31223,146.33771 v -8.12002" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.793999 }} />
                <circle
                  style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 0.793999 }}
                  cx="121.47219"
                  cy="138.2177"
                  r="1.5971235"
                />
                <circle
                  style={{ fill: '#ffffff', stroke: '#ffffff', strokeWidth: 0.217151 }}
                  cx="111.31223"
                  cy="138.21768"
                  r="0.81867296"
                />
              </g>
            </svg>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ p: 3, mt: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            About this Tool
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This calculator offers two modes:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                <strong>Find R1:</strong> Calculate the required resistor values when you know your desired output voltage
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                <strong>Find Output Voltage:</strong> Calculate the output voltage when you know both resistor values
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" color="text.secondary" paragraph>
            The interactive circuit diagram updates in real-time to show your current configuration. All resistor values can be entered in Ω, kΩ, or MΩ using the unit selectors.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
            Formulas Used
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            The voltage divider calculations are based on these fundamental formulas:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                <strong>Output Voltage:</strong> Vout = Vin × (R2 / (R1 + R2))
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                <strong>Required R1:</strong> R1 = R2 × ((Vin / Vout) - 1)
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" color="text.secondary">
            Where:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                Vin = Input voltage
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Vout = Output voltage
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                R1 = Upper resistor value
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                R2 = Lower resistor value
              </Typography>
            </li>
          </ul>
        </Paper>
      </Paper>
    </Container>
  );
};

export default VoltageDividerCalculator;
