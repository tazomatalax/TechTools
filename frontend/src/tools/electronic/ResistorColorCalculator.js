import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const ResistorColorCalculator = () => {
  const [bands, setBands] = useState({
    band1: 'brown',
    band2: 'black',
    band3: 'red',
    band4: 'none',
    tolerance: 'gold',
  });

  const colors = {
    none: { color: '#e9c6af' },  // Same as resistor body color
    black: { value: 0, multiplier: 1, color: '#000000' },
    brown: { value: 1, multiplier: 10, tolerance: 1, color: '#654321' }, // Darker brown
    red: { value: 2, multiplier: 100, tolerance: 2, color: '#FF0000' },
    orange: { value: 3, multiplier: 1000, color: '#FFA500' },
    yellow: { value: 4, multiplier: 10000, color: '#FFFF00' },
    green: { value: 5, multiplier: 100000, tolerance: 0.5, color: '#008000' },
    blue: { value: 6, multiplier: 1000000, tolerance: 0.25, color: '#0000FF' },
    violet: { value: 7, multiplier: 10000000, tolerance: 0.1, color: '#8A2BE2' },
    gray: { value: 8, multiplier: 100000000, tolerance: 0.05, color: '#808080' },
    white: { value: 9, multiplier: 1000000000, color: '#FFFFFF' },
    gold: { multiplier: 0.1, tolerance: 5, color: '#CFB53B' },  // More metallic gold
    silver: { multiplier: 0.01, tolerance: 10, color: '#C0C0C0' },
  };

  const handleBandChange = (event) => {
    setBands({
      ...bands,
      [event.target.name]: event.target.value,
    });
  };

  const calculateResistance = () => {
    let value;
    if (bands.band4 === 'none') {
      // 4-band resistor: band3 is multiplier
      value = (colors[bands.band1].value * 10 + colors[bands.band2].value) 
        * colors[bands.band3].multiplier;
    } else {
      // 5-band resistor: band4 is multiplier
      value = (colors[bands.band1].value * 100 + colors[bands.band2].value * 10 + colors[bands.band3].value) 
        * colors[bands.band4].multiplier;
    }
    const tolerance = colors[bands.tolerance].tolerance;
    
    let formattedValue = value;
    let unit = 'Ω';
    
    if (value >= 1000000) {
      formattedValue = value / 1000000;
      unit = 'MΩ';
    } else if (value >= 1000) {
      formattedValue = value / 1000;
      unit = 'kΩ';
    }
    
    return {
      value: formattedValue,
      unit,
      tolerance,
    };
  };

  const result = calculateResistance();

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resistor Color Code Calculator
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Decode resistor values using the standard color code bands
        </Typography>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
          <svg
            width="242.8"
            height="57.8"
            viewBox="0 0 64.260925 15.296407"
            version="1.1"
          >
            <rect
              style={{ fill: '#b3b3b3' }}
              width="64.260925"
              height="2.2"  // Reduced wire thickness
              x="0"
              y="6.5"  // Adjusted y position to center the thinner wire
            />
            <g transform="translate(-71.366722,-75.042389)">
              <g transform="matrix(0.89184758,0,0,1,8.3106456,0)" style={{ fill: '#e9c6af' }}>
                <rect
                  style={{ fill: '#e9c6af' }}
                  width="43.279842"
                  height="11.877213"
                  x="84.910538"
                  y="76.751984"
                />
                <rect
                  style={{ fill: '#e9c6af' }}
                  width="16.736071"
                  height="15.296407"
                  x="76.841965"
                  y="75.042389"
                  ry="6.0285854"
                />
                <rect
                  style={{ fill: '#e9c6af' }}
                  width="16.736071"
                  height="15.296407"
                  x="119.52289"
                  y="75.042389"
                  ry="6.0285854"
                />
              </g>
            </g>
            <g transform="translate(-71.366722,-75.042389)">
              <rect
                id="band1"
                style={{ fill: colors[bands.band1].color }}
                width="4.5"
                height="26.273832"
                x="85"
                y="69.553673"
                ry="3.9582851"
                transform="matrix(0.89184757,0,0,1,8.3106455,0)"
              />
              <rect
                id="band2"
                style={{ fill: colors[bands.band2].color }}
                width="4.5"
                height="11.877213"
                x="93"
                y="76.751984"
              />
              <rect
                id="band3"
                style={{ fill: colors[bands.band3].color }}
                width="4.5"
                height="11.877213"
                x="101"
                y="76.751984"
              />
              <rect
                id="band4"
                style={{ fill: colors[bands.band4].color }}
                width="4.5"
                height="11.877213"
                x="109"
                y="76.751984"
              />
              <rect
                id="bandTolerance"
                style={{ fill: colors[bands.tolerance].color }}
                width="5.2"
                height="15.296407"
                x="120"
                y="75.042389"
              />
            </g>
          </svg>
        </Box>

        <Box sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Grid container spacing={2}>
            {['band1', 'band2', 'band3', 'band4', 'tolerance'].map((band) => (
              <Grid item xs={12} sm={6} md={2.4} key={band}>
                <FormControl fullWidth>
                  <InputLabel>{band.charAt(0).toUpperCase() + band.slice(1)}</InputLabel>
                  <Select
                    value={bands[band]}
                    label={band.charAt(0).toUpperCase() + band.slice(1)}
                    name={band}
                    onChange={handleBandChange}
                    sx={{
                      bgcolor: 'background.default'
                    }}
                  >
                    {band === 'band4' && (
                      <MenuItem 
                        key="none" 
                        value="none"
                        sx={{
                          bgcolor: colors.none.color,
                          color: 'black',
                          '&:hover': {
                            bgcolor: colors.none.color,
                            opacity: 0.9,
                          },
                        }}
                      >
                        None (4-band)
                      </MenuItem>
                    )}
                    {Object.entries(colors).map(([color, data]) => (
                      color !== 'none' && (
                        (band === 'tolerance' && data.tolerance !== undefined) ||
                        (band !== 'tolerance' && (data.value !== undefined || data.multiplier !== undefined)) ? (
                          <MenuItem 
                            key={color} 
                            value={color}
                            sx={{
                              bgcolor: data.color,
                              color: ['white', 'yellow', 'gold', 'silver'].includes(color) ? 'black' : 'white',
                              '&:hover': {
                                bgcolor: data.color,
                                opacity: 0.9,
                              },
                            }}
                          >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </MenuItem>
                        ) : null
                      )
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h5" gutterBottom>
            Result:
          </Typography>
          <Typography variant="h4">
            {result.value} {result.unit} ±{result.tolerance}%
          </Typography>
        </Box>
      </Paper>

      {/* About Panel */}
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About this Tool
        </Typography>
        
        <Typography variant="body1" paragraph>
          This calculator helps decode the resistance value of through-hole resistors using their color band markings. It supports both 4-band and 5-band resistors, which are the most common types used in electronic projects.
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Key Features:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Support for both 4-band and 5-band resistors</li>
            <li>Interactive visual resistor representation</li>
            <li>Real-time value calculation</li>
            <li>Automatic unit scaling (Ω, kΩ, MΩ)</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Color Code System:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>4-band resistors: [1st digit][2nd digit][multiplier][tolerance]</li>
            <li>5-band resistors: [1st digit][2nd digit][3rd digit][multiplier][tolerance]</li>
            <li>Example: Brown-Black-Red-Gold = 1-0-×100-±5% = 1kΩ ±5%</li>
          </ul>
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Usage Tips:
        </Typography>
        <Typography component="div" variant="body2">
          <ul>
            <li>Select band colors in order from left to right</li>
            <li>For 4-band resistors, set Band 4 to "None"</li>
            <li>The rightmost band (gold/silver) is always the tolerance</li>
            <li>The visual preview updates in real-time as you select colors</li>
          </ul>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: While this calculator provides accurate theoretical values, actual resistors may vary within their tolerance range. For precise measurements, always use a multimeter.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ResistorColorCalculator;
