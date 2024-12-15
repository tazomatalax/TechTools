import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  InputAdornment,
  Button
} from '@mui/material';
import PwmDacSchematic from './components/PwmDacSchematic';

// Standard component values
const standardResistors = [
  100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
  1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200,
  10000, 12000, 15000, 18000, 22000, 27000, 33000, 39000, 47000, 56000, 68000, 82000,
  100000, 120000, 150000, 180000, 220000, 270000, 330000, 390000, 470000, 560000, 680000, 820000,
  1000000, 1200000, 1500000, 1800000, 2200000, 2700000, 3300000, 3900000, 4700000, 5600000, 6800000, 8200000,
  10000000
];

const standardCapacitors = [
  1, 2.2, 3.3, 4.7, 10, 22, 33, 47, 100, 220, 330, 470, 1000, 2200, 3300, 4700, 10000,
  22000, 33000, 47000, 100000, 220000, 330000, 470000, 1000000, 2200000, 3300000, 4700000, 10000000
];

// Function to find nearest standard value - used for recommendations only
const findClosestStandardValue = (value, standardValues) => {
  if (!value || value <= 0) return standardValues[0];

  return standardValues.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
};

// Function to get nearest standard value as string - for display purposes
const getNearestStandardValue = (value, type, unit) => {
  if (!value || value <= 0) return '';

  const numValue = parseFloat(value);
  const standardArray = type === 'R' ? standardResistors : standardCapacitors;
  
  // Convert the input value to base units (ohms or nF) before finding nearest
  let valueInBaseUnits = numValue;
  if (type === 'R') {
    // Convert to ohms
    if (unit === 'kΩ') valueInBaseUnits = numValue * 1000;
    else if (unit === 'MΩ') valueInBaseUnits = numValue * 1000000;
  } else {
    // Convert to nF
    if (unit === 'µF') valueInBaseUnits = numValue * 1000;
    else if (unit === 'mF') valueInBaseUnits = numValue * 1000000;
  }
  
  const nearest = findClosestStandardValue(valueInBaseUnits, standardArray);
  
  // Format the output with appropriate units
  if (type === 'R') {
    if (nearest >= 1000000) {
      return `Nearest standard value: ${(nearest / 1000000).toFixed(1)} MΩ`;
    } else if (nearest >= 1000) {
      return `Nearest standard value: ${(nearest / 1000).toFixed(1)} kΩ`;
    }
    return `Nearest standard value: ${nearest} Ω`;
  } else {
    // For capacitors (convert from nF to appropriate unit)
    if (nearest >= 1000000) {
      return `Nearest standard value: ${(nearest / 1000000).toFixed(1)} mF`;
    } else if (nearest >= 1000) {
      return `Nearest standard value: ${(nearest / 1000).toFixed(1)} µF`;
    }
    return `Nearest standard value: ${nearest} nF`;
  }
};

// Convert value based on unit
const convertToBaseUnit = (value, unit) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;

  switch (unit) {
    case 'kΩ':
      return numValue * 1000;
    case 'MΩ':
      return numValue * 1000000;
    case 'µF':
      return numValue * 1e-6;
    case 'mF':
      return numValue * 1e-3;
    case 'nF':
      return numValue * 1e-9;
    default:
      return numValue;
  }
};

// Convert from base unit to display unit
const convertFromBaseUnit = (value, unit) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';

  switch (unit) {
    case 'kΩ':
      return (numValue / 1000).toString();
    case 'MΩ':
      return (numValue / 1000000).toString();
    case 'µF':
      return (numValue / 1e-6).toString();
    case 'mF':
      return (numValue / 1e-3).toString();
    case 'nF':
      return (numValue / 1e-9).toString();
    default:
      return numValue.toString();
  }
};

// Convert frequency to Hz based on unit
const getFrequencyInHz = (value, unit) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;

  switch (unit) {
    case 'kHz':
      return numValue * 1000;
    case 'MHz':
      return numValue * 1000000;
    default:
      return numValue;
  }
};

// Component for value input with unit selection
const ValueWithUnit = ({ label, value, onChange, units, selectedUnit, onUnitChange, helperText, error }) => {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          variant="outlined"
          fullWidth
          InputProps={{
            sx: {
              bgcolor: 'background.default',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
            }
          }}
        />
        <Select
          value={selectedUnit}
          onChange={onUnitChange}
          size="small"
          sx={{
            minWidth: 80,
            height: '40px',
            bgcolor: 'background.default',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          {units.map(unit => (
            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

const PwmDacCalculator = () => {
  const [filterType, setFilterType] = useState('first');
  const [pwmFreq, setPwmFreq] = useState('0.5');  // 500 Hz default
  const [pwmFreqUnit, setPwmFreqUnit] = useState('kHz');
  const [maxOutputFreq, setMaxOutputFreq] = useState('1');  // 1 Hz default
  const [maxOutputFreqUnit, setMaxOutputFreqUnit] = useState('Hz');
  const [outputImpedance, setOutputImpedance] = useState('1'); // 1 MΩ default
  const [outputImpedanceUnit, setOutputImpedanceUnit] = useState('MΩ');
  const [recommendedR1, setRecommendedR1] = useState('7.5');  // 7.5 kΩ default
  const [recommendedR2, setRecommendedR2] = useState('7.5');  // 7.5 kΩ default
  const [recommendedC1, setRecommendedC1] = useState('390');  // 390 nF default
  const [recommendedC2, setRecommendedC2] = useState('390');  // 390 nF default
  const [r1Unit, setR1Unit] = useState('kΩ');
  const [r2Unit, setR2Unit] = useState('kΩ');
  const [c1Unit, setC1Unit] = useState('nF');
  const [c2Unit, setC2Unit] = useState('nF');
  const [cutoffFreq, setCutoffFreq] = useState('');
  const [rippleVoltage, setRippleVoltage] = useState('');
  const [vin, setVin] = useState('3.3');
  const [pwmFreqError, setPwmFreqError] = useState(false);
  const [pwmFreqHelperText, setPwmFreqHelperText] = useState('');
  const [manualMode, setManualMode] = useState(false);

  // Handle manual component value changes
  const handleComponentChange = (value, setter, type, unit) => {
    setter(value);
  };

  // Effect to calculate initial values
  useEffect(() => {
    calculateComponents();
  }, []); // Only run once on mount

  // Effect to validate PWM frequency
  useEffect(() => {
    const pwm = getFrequencyInHz(pwmFreq, pwmFreqUnit);
    const fmax = getFrequencyInHz(maxOutputFreq, maxOutputFreqUnit);
    
    if (pwm < fmax * 20) {
      setPwmFreqError(true);
      setPwmFreqHelperText('PWM frequency too low for target output frequency. Recommend at least 20x max output frequency.');
    } else {
      setPwmFreqError(false);
      setPwmFreqHelperText('');
    }
  }, [pwmFreq, pwmFreqUnit, maxOutputFreq, maxOutputFreqUnit]);

  // Function to handle recommend button click
  const handleRecommend = () => {
    calculateComponents();
  };

  // Function to calculate cutoff frequency
  const calculateCutoff = () => {
    const r1 = convertToBaseUnit(recommendedR1, r1Unit);
    const c1 = convertToBaseUnit(recommendedC1, c1Unit);
    
    if (filterType === 'first') {
      const fc = 1 / (2 * Math.PI * r1 * c1);
      setCutoffFreq(fc.toFixed(2));
    } else {
      const r2 = convertToBaseUnit(recommendedR2, r2Unit);
      const c2 = convertToBaseUnit(recommendedC2, c2Unit);
      
      // For second order filters, cutoff frequency calculation
      const fc = 1 / (2 * Math.PI * Math.sqrt(r1 * r2 * c1 * c2));
      setCutoffFreq(fc.toFixed(2));
    }
  };

  // Calculate cutoff frequency whenever component values change
  useEffect(() => {
    calculateCutoff();
  }, [
    recommendedR1, r1Unit,
    recommendedC1, c1Unit,
    recommendedR2, r2Unit,
    recommendedC2, c2Unit,
    filterType
  ]);

  // Calculate ripple voltage whenever component values change
  useEffect(() => {
    calculateRipple();
  }, [
    recommendedR1, r1Unit,
    recommendedC1, c1Unit,
    recommendedR2, r2Unit,
    recommendedC2, c2Unit,
    pwmFreq, pwmFreqUnit,
    vin,
    filterType
  ]);

  // Function to calculate initial values
  const calculateComponents = () => {
    const pwmFreqHz = getFrequencyInHz(pwmFreq, pwmFreqUnit);
    const fmax = Math.max(getFrequencyInHz(maxOutputFreq, maxOutputFreqUnit), 0.1); // Minimum 0.1Hz
    const zoutValue = convertToBaseUnit(outputImpedance, outputImpedanceUnit);
    
    // Set cutoff frequency to 5x the max output frequency
    // This provides better ripple attenuation - users can increase PWM frequency for faster response
    const fc = fmax * 5;
    
    // Calculate recommended component values based on output impedance
    // Limit R to 10k instead of 100k for better noise performance
    const recommendedR = Math.min(zoutValue / 10, 10000); // R should be <= 10k and < Zout/10
    
    // Calculate C in Farads, then convert to nF for display
    const recommendedC = 1 / (2 * Math.PI * recommendedR * fc);
    const recommendedC_nF = recommendedC * 1e9; // Convert to nF for finding standard value

    // Find closest standard values
    const stdR1 = findClosestStandardValue(recommendedR, standardResistors);
    const stdC1 = findClosestStandardValue(recommendedC_nF, standardCapacitors);

    // Set recommended values (C1 will be in nF)
    setRecommendedR1(convertFromBaseUnit(stdR1, r1Unit));
    setRecommendedC1(stdC1.toString());

    if (filterType !== 'first') {
      const stdR2 = findClosestStandardValue(recommendedR, standardResistors);
      const stdC2 = findClosestStandardValue(recommendedC_nF, standardCapacitors);
      
      setRecommendedR2(convertFromBaseUnit(stdR2, r2Unit));
      setRecommendedC2(stdC2.toString());
    }
  };

  const calculateRipple = () => {
    const pwmFreqHz = getFrequencyInHz(pwmFreq, pwmFreqUnit);
    const vinValue = parseFloat(vin);
    const zoutValue = convertToBaseUnit(outputImpedance, outputImpedanceUnit);

    // Get current component values in base units
    const r1Value = convertToBaseUnit(recommendedR1, r1Unit);
    const c1Value = convertToBaseUnit(recommendedC1, c1Unit); // This now returns Farads directly

    // Only calculate if we have valid values
    if (r1Value && c1Value && pwmFreqHz && vinValue) {
      let ripple;

      // Calculate first order capacitive reactance
      const x1 = 1 / (2 * Math.PI * pwmFreqHz * c1Value);
      console.log('x1: ', x1);

      // Calculate ripple voltage (1st order filter)
      if (filterType === 'first') {
        ripple = vinValue * (x1 / (x1 + r1Value)) * Math.sqrt(2);
        console.log('ripple: ', ripple);
      }
      // Calculate ripple voltage (2nd order filter)
      else {
        const r2Value = convertToBaseUnit(recommendedR2, r2Unit);
        const c2Value = convertToBaseUnit(recommendedC2, c2Unit);

        // Calculate second order capacitive reactance
        const x2 = 1 / (2 * Math.PI * pwmFreqHz * c2Value);
        console.log('x2: ', x2);

        // Calculate effective reactance of first stage with load of second stage
        const z2 = Math.sqrt(r2Value * r2Value + x2 * x2);
        const x1eff = (x1 * z2) / Math.sqrt(x1 * x1 + z2 * z2);
        console.log('z2: ', z2);
        console.log('x1eff: ', x1eff);

        // Calculate ripple voltage
        ripple = vinValue * (x1eff / (x1eff + r1Value)) * (x2 / (x2 + r2Value)) * Math.sqrt(2);
      }

      if (ripple > vinValue) ripple = vinValue;
      setRippleVoltage((ripple * 1000).toFixed(2)); // Convert to mV
    } else {
      setRippleVoltage(''); 
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        PWM DAC Filter Calculator
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Filter Type
            </Typography>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              fullWidth
              sx={{
                height: '56px',
                bgcolor: 'background.default',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              }}
            >
              <MenuItem value="first">First Order (RC)</MenuItem>
              <MenuItem value="second">Second Order (RC-RC)</MenuItem>
              <MenuItem value="buffered">Buffered (Op-amp Output)</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <ValueWithUnit
              label="PWM Frequency"
              value={pwmFreq}
              onChange={(e) => setPwmFreq(e.target.value)}
              units={['Hz', 'kHz', 'MHz']}
              selectedUnit={pwmFreqUnit}
              onUnitChange={(e) => setPwmFreqUnit(e.target.value)}
              error={pwmFreqError}
              helperText={pwmFreqHelperText}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ValueWithUnit
              label="Max Output Frequency"
              value={maxOutputFreq}
              onChange={(e) => setMaxOutputFreq(e.target.value)}
              units={['Hz', 'kHz']}
              selectedUnit={maxOutputFreqUnit}
              onUnitChange={(e) => setMaxOutputFreqUnit(e.target.value)}
              helperText="Minimum 0.1Hz"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ValueWithUnit
              label="Output Impedance"
              value={outputImpedance}
              onChange={(e) => setOutputImpedance(e.target.value)}
              units={['Ω', 'kΩ', 'MΩ']}
              selectedUnit={outputImpedanceUnit}
              onUnitChange={(e) => setOutputImpedanceUnit(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Input Voltage (V)
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr', 
              gap: 2
            }}>
              <TextField
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => handleRecommend()}
                sx={{ 
                  height: '56px',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  textTransform: 'none',
                }}
              >
                Recommend RC Values
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', mt: 2, mb: 1 }}>
              Recommended Component Values:
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <ValueWithUnit
              label="R1"
              value={recommendedR1}
              onChange={(e) => handleComponentChange(e.target.value, setRecommendedR1, 'R', r1Unit)}
              units={['Ω', 'kΩ', 'MΩ']}
              selectedUnit={r1Unit}
              onUnitChange={(e) => setR1Unit(e.target.value)}
              helperText={getNearestStandardValue(recommendedR1, 'R', r1Unit)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ValueWithUnit
              label="C1"
              value={recommendedC1}
              onChange={(e) => handleComponentChange(e.target.value, setRecommendedC1, 'C', c1Unit)}
              units={['nF', 'µF', 'mF']}
              selectedUnit={c1Unit}
              onUnitChange={(e) => setC1Unit(e.target.value)}
              helperText={getNearestStandardValue(recommendedC1, 'C', c1Unit)}
            />
          </Grid>

          {filterType !== 'first' && (
            <>
              <Grid item xs={12} sm={6}>
                <ValueWithUnit
                  label="R2"
                  value={recommendedR2}
                  onChange={(e) => handleComponentChange(e.target.value, setRecommendedR2, 'R', r2Unit)}
                  units={['Ω', 'kΩ', 'MΩ']}
                  selectedUnit={r2Unit}
                  onUnitChange={(e) => setR2Unit(e.target.value)}
                  helperText={getNearestStandardValue(recommendedR2, 'R', r2Unit)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ValueWithUnit
                  label="C2"
                  value={recommendedC2}
                  onChange={(e) => handleComponentChange(e.target.value, setRecommendedC2, 'C', c2Unit)}
                  units={['nF', 'µF', 'mF']}
                  selectedUnit={c2Unit}
                  onUnitChange={(e) => setC2Unit(e.target.value)}
                  helperText={getNearestStandardValue(recommendedC2, 'C', c2Unit)}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1,
              mt: 2  // Add top margin
            }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Cutoff Frequency: {cutoffFreq} Hz
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Output Ripple: {rippleVoltage} mVpp
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 3 }}>
              <PwmDacSchematic
                filterType={filterType}
                pwmFreq={getFrequencyInHz(pwmFreq, pwmFreqUnit)}
                r1={convertToBaseUnit(recommendedR1, r1Unit)}
                r2={convertToBaseUnit(recommendedR2, r2Unit)}
                c1={convertToBaseUnit(recommendedC1, c1Unit)}
                c2={convertToBaseUnit(recommendedC2, c2Unit)}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          About This Tool
        </Typography>

        <Typography variant="h6" gutterBottom>
          How to Use
        </Typography>
        <Typography paragraph>
          1. Enter your PWM frequency (typically 500Hz - 20kHz for most applications)
        </Typography>
        <Typography paragraph>
          2. Set your maximum output frequency (the highest frequency your DAC needs to reproduce)
        </Typography>
        <Typography paragraph>
          3. Choose your filter type based on your requirements (see filter selection guide below)
        </Typography>
        <Typography paragraph>
          4. Enter your output load impedance (typically 1MΩ for high-impedance inputs)
        </Typography>
        <Typography paragraph>
          5. Set your PWM input voltage level (usually your microcontroller's voltage, e.g., 3.3V or 5V)
        </Typography>
        <Typography paragraph>
          The calculator will recommend component values and show you the expected ripple voltage.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
          Filter Type Selection Guide
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          First Order (RC)
        </Typography>
        <Typography paragraph>
          • Simplest implementation - just one resistor and capacitor
          <br />
          • Good for basic applications where some ripple is acceptable
          <br />
          • Best when your PWM frequency is at least 50x higher than your maximum output frequency
          <br />
          • Typical applications: LED dimming, simple voltage control
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          Second Order (Cascaded RC)
        </Typography>
        <Typography paragraph>
          • Better ripple reduction (-40dB/decade vs -20dB/decade)
          <br />
          • Improved high-frequency noise rejection
          <br />
          • Good when PWM frequency is 20-50x higher than max output frequency
          <br />
          • Typical applications: Audio DAC, precision voltage control
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          Buffered (Op-amp Output)
        </Typography>
        <Typography paragraph>
          • Best performance - eliminates load impedance effects
          <br />
          • Provides low output impedance
          <br />
          • Ideal for driving varying loads
          <br />
          • Typical applications: Precision DAC, driving multiple loads, audio applications
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
          Component Selection Tips
        </Typography>
        <Typography paragraph>
          <strong>Resistor Values (R):</strong>
          <br />
          • Keep below 10kΩ to minimize noise pickup
          <br />
          • Higher values reduce power consumption but increase noise susceptibility
          <br />
          • For buffered filters, values between 1kΩ and 10kΩ are typically optimal
        </Typography>

        <Typography paragraph>
          <strong>Capacitor Values (C):</strong>
          <br />
          • Use good quality capacitors (ceramic or film) for better stability
          <br />
          • Larger values give better filtering but slower response
          <br />
          • For audio applications, film capacitors are preferred over ceramic
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
          Performance Optimization
        </Typography>
        <Typography paragraph>
          <strong>Reducing Ripple:</strong>
          <br />
          • Increase PWM frequency
          <br />
          • Use second order or buffered filter
          <br />
          • Increase RC time constant (but this reduces bandwidth)
        </Typography>

        <Typography paragraph>
          <strong>Improving Response Time:</strong>
          <br />
          • Keep RC time constant as low as possible while meeting ripple requirements
          <br />
          • Consider using a buffered filter for faster response with good filtering
          <br />
          • Balance between ripple and response time based on your application
        </Typography>
      </Paper>
    </Container>
  );
};

export default PwmDacCalculator;
