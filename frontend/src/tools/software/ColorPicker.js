import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Tooltip,
  IconButton,
  Slider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AboutToolSection from '../../components/AboutToolSection';

const ColorBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
}));

const PaletteColor = styled(Box)(({ theme }) => ({
  width: '50px',
  height: '50px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  margin: theme.spacing(0.5),
}));

const ColorPicker = () => {
  const [color, setColor] = useState('#FF0000');
  const [format, setFormat] = useState('rgb565');
  const [paletteType, setPaletteType] = useState('material');
  const [alpha, setAlpha] = useState(255);
  const [inputValue, setInputValue] = useState('0xF800');
  const [lastValidInput, setLastValidInput] = useState('0xF800');
  const [inputError, setInputError] = useState(false);
  const [isUserInput, setIsUserInput] = useState(false);

  // Only update the input value when the format changes
  useEffect(() => {
    console.log('Format change effect. New format:', format);
    console.log('Current color:', color);
    console.log('Is user input:', isUserInput);
    
    if (!isUserInput) {
      const formattedColor = getColorFormats();
      console.log('Formatted color:', formattedColor);
      setLastValidInput(formattedColor);
      setInputValue(formattedColor);
      setInputError(false);
    }
  }, [format]); // Only depend on format changes

  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
  };

  const handleColorPickerChange = (e) => {
    const newColor = e.target.value;
    console.log('Color picker changed:', newColor);
    setColor(newColor);
    if (!isUserInput) {
      const formattedColor = getColorFormats(newColor);
      console.log('Formatted color from picker:', formattedColor);
      setLastValidInput(formattedColor);
      setInputValue(formattedColor);
    }
  };

  const getColorFormats = (currentColor = color) => {
    try {
      const rgb = hexToRGB(currentColor);
      const formats = {
        hex: currentColor.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha / 255).toFixed(2)})`,
        'rgb565': rgb565Format(rgb),
        'rgb888': rgb888Format(rgb),
        'rgba8888': rgba8888Format(rgb, alpha),
        'argb8888': argb8888Format(rgb, alpha),
        'bgr888': bgr888Format(rgb),
        'bgra8888': bgra8888Format(rgb, alpha),
      };
      return formats[format];
    } catch (error) {
      console.error('Error formatting color:', error);
      return 'Invalid color';
    }
  };

  const getPaletteColors = () => {
    switch (paletteType) {
      case 'material':
        return [
          '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
          '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
          '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
          '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
        ];
      case 'analogous':
        const hsl = hexToHSL(color);
        return [
          hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l),
          color,
          hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        ];
      case 'complementary': {
        const hsl = hexToHSL(color);
        const complement = (hsl.h + 180) % 360;
        const hue1 = (hsl.h + 150) % 360;
        const hue2 = (hsl.h + 210) % 360;
        
        return [
          // Original color
          color,
          // Colors before complement
          hslToHex(hue1, hsl.s, 50),
          hslToHex(hue1, hsl.s, 70),
          // Complement
          hslToHex(complement, hsl.s, 50),
          // Colors after complement
          hslToHex(hue2, hsl.s, 50),
          hslToHex(hue2, hsl.s, 70),
        ];
      }
      case 'triadic':
        const triHsl = hexToHSL(color);
        return [
          color,
          hslToHex((triHsl.h + 120) % 360, triHsl.s, triHsl.l),
          hslToHex((triHsl.h + 240) % 360, triHsl.s, triHsl.l),
        ];
      case 'tetradic':
        const tetHsl = hexToHSL(color);
        return [
          color,
          hslToHex((tetHsl.h + 90) % 360, tetHsl.s, tetHsl.l),
          hslToHex((tetHsl.h + 180) % 360, tetHsl.s, tetHsl.l),
          hslToHex((tetHsl.h + 270) % 360, tetHsl.s, tetHsl.l),
        ];
      default:
        return [];
    }
  };

  const convertToCurrentFormat = (hexColor) => {
    switch (format) {
      case 'rgb565': {
        const rgb = hexToRGB(hexColor);
        // Convert to RGB565
        const r5 = Math.round((rgb.r * 31) / 255);
        const g6 = Math.round((rgb.g * 63) / 255);
        const b5 = Math.round((rgb.b * 31) / 255);
        const rgb565 = (r5 << 11) | (g6 << 5) | b5;
        return `0x${rgb565.toString(16).padStart(4, '0').toUpperCase()}`;
      }
      case 'rgb888': {
        const rgb = hexToRGB(hexColor);
        return `0x${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`.toUpperCase();
      }
      case 'bgr888': {
        const rgb = hexToRGB(hexColor);
        return `0x${rgb.b.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.r.toString(16).padStart(2, '0')}`.toUpperCase();
      }
      case 'rgba8888': {
        const rgb = hexToRGB(hexColor);
        return `0x${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}${alpha.toString(16).padStart(2, '0')}`.toUpperCase();
      }
      case 'argb8888': {
        const rgb = hexToRGB(hexColor);
        return `0x${alpha.toString(16).padStart(2, '0')}${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`.toUpperCase();
      }
      case 'bgra8888': {
        const rgb = hexToRGB(hexColor);
        return `0x${rgb.b.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.r.toString(16).padStart(2, '0')}${alpha.toString(16).padStart(2, '0')}`.toUpperCase();
      }
      case 'rgb': {
        const rgb = hexToRGB(hexColor);
        return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      }
      case 'rgba': {
        const rgb = hexToRGB(hexColor);
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${(alpha / 255).toFixed(2)})`;
      }
      case 'hex':
      default:
        return hexColor;
    }
  };

  const handleColorInput = (newValue) => {
    console.log('handleColorInput called with:', newValue);
    setInputValue(newValue);
    
    try {
      // Remove whitespace first
      newValue = newValue.replace(/\s/g, '');
      
      // For RGB565, preserve the '0x' prefix case and uppercase the rest
      if (format === 'rgb565' && newValue.toLowerCase().startsWith('0x')) {
        newValue = '0x' + newValue.substring(2).toUpperCase();
      }
      
      console.log('Formatted value:', newValue);
      console.log('Current format:', format);
      
      let newColor = color;
      let isValid = false;
      
      switch (format) {
        case 'rgb565': {
          console.log('Validating RGB565 format');
          // Test the regex pattern directly
          const isValidPattern = /^0x[A-F0-9]{4}$/.test(newValue);
          console.log('Is valid pattern:', isValidPattern);
          
          // Break down the validation steps
          const hasPrefix = newValue.startsWith('0x');
          console.log('Has 0x prefix:', hasPrefix);
          
          const valueAfterPrefix = newValue.substring(2);
          console.log('Value after prefix:', valueAfterPrefix);
          
          const isValidLength = valueAfterPrefix.length === 4;
          console.log('Is valid length:', isValidLength);
          
          const hasValidChars = /^[A-F0-9]+$/.test(valueAfterPrefix);
          console.log('Has valid chars:', hasValidChars);
          
          if (isValidPattern) {
            console.log('Valid RGB565 format');
            const value = parseInt(valueAfterPrefix, 16);
            console.log('Parsed value:', value.toString(16));
            
            const r = (value >> 11) & 0x1F;
            const g = (value >> 5) & 0x3F;
            const b = value & 0x1F;
            console.log('RGB565 components:', { 
              r: r.toString(2).padStart(5, '0'),
              g: g.toString(2).padStart(6, '0'),
              b: b.toString(2).padStart(5, '0')
            });
            
            // Convert from 5/6/5 bits to 8 bits
            const r8 = Math.round((r * 255) / 31);
            const g8 = Math.round((g * 255) / 63);
            const b8 = Math.round((b * 255) / 31);
            console.log('RGB888 components:', { r8, g8, b8 });
            
            newColor = rgbToHex(r8, g8, b8);
            console.log('New color:', newColor);
            isValid = true;
          }
          break;
        }

        case 'rgb888':
        case 'bgr888': {
          const hex6Match = newValue.match(/^0x([A-F0-9]{6})$/);
          if (hex6Match) {
            if (format === 'bgr888') {
              // Convert BGR to RGB
              const value = hex6Match[1];
              const r = value.slice(4, 6);
              const g = value.slice(2, 4);
              const b = value.slice(0, 2);
              newColor = `#${r}${g}${b}`;
            } else {
              newColor = '#' + hex6Match[1];
            }
            isValid = true;
          }
          break;
        }

        case 'rgba8888':
        case 'argb8888':
        case 'bgra8888': {
          const hex8Match = newValue.match(/^0x([A-F0-9]{8})$/);
          if (hex8Match) {
            const value = hex8Match[1];
            let r, g, b, a;
            
            if (format === 'rgba8888') {
              r = value.slice(0, 2);
              g = value.slice(2, 4);
              b = value.slice(4, 6);
              a = value.slice(6, 8);
            } else if (format === 'argb8888') {
              a = value.slice(0, 2);
              r = value.slice(2, 4);
              g = value.slice(4, 6);
              b = value.slice(6, 8);
            } else { // bgra8888
              b = value.slice(0, 2);
              g = value.slice(2, 4);
              r = value.slice(4, 6);
              a = value.slice(6, 8);
            }
            
            setAlpha(parseInt(a, 16));
            newColor = `#${r}${g}${b}`;
            isValid = true;
          }
          break;
        }

        case 'rgb': {
          const rgbMatch = newValue.match(/^RGB\((\d+),(\d+),(\d+)\)$/i);
          if (rgbMatch) {
            const [_, r, g, b] = rgbMatch;
            newColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
            isValid = true;
          }
          break;
        }

        case 'rgba': {
          const rgbaMatch = newValue.match(/^RGBA\((\d+),(\d+),(\d+),([\d.]+)\)$/i);
          if (rgbaMatch) {
            const [_, r, g, b, a] = rgbaMatch;
            setAlpha(Math.round(parseFloat(a) * 255));
            newColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
            isValid = true;
          }
          break;
        }

        case 'hex':
        default: {
          if (newValue.startsWith('#') && /^#[A-F0-9]{6}$/.test(newValue)) {
            newColor = newValue;
            isValid = true;
          } else if (/^[A-F0-9]{6}$/.test(newValue)) {
            newColor = '#' + newValue;
            isValid = true;
          } else if (/^[A-F0-9]{3}$/.test(newValue)) {
            newColor = '#' + newValue.split('').map(char => char + char).join('');
            isValid = true;
          }
          break;
        }
      }

      if (isValid) {
        console.log('Setting new color:', newColor);
        setInputError(false);
        setColor(newColor);
        setLastValidInput(newValue);
      } else {
        console.log('Invalid input');
        setInputError(true);
      }
    } catch (error) {
      console.error('Error parsing color:', error);
      setInputError(true);
    }
  };

  const hexToRGB = (hex) => {
    // Remove the hash if present
    const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
    
    // Handle both shorthand (3 chars) and full (6 chars) hex
    const fullHex = cleanHex.length === 3 
      ? cleanHex.split('').map(char => char + char).join('')
      : cleanHex;

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (!result) {
      return { r: 0, g: 0, b: 0 }; // Return default color instead of null
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  };

  const hexToHSL = (hex) => {
    const rgb = hexToRGB(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const rgb565Format = (rgb) => {
    // Convert 8-bit RGB to 5-6-5 bits
    const r5 = Math.round((rgb.r * 31) / 255);
    const g6 = Math.round((rgb.g * 63) / 255);
    const b5 = Math.round((rgb.b * 31) / 255);
    
    // Combine into 16-bit value
    const value = (r5 << 11) | (g6 << 5) | b5;
    
    // Format as 0xXXXX
    const formatted = `0x${value.toString(16).padStart(4, '0').toUpperCase()}`;
    console.log('rgb565Format:', {
      input: rgb,
      r5: r5.toString(2).padStart(5, '0'),
      g6: g6.toString(2).padStart(6, '0'),
      b5: b5.toString(2).padStart(5, '0'),
      value: value.toString(16).padStart(4, '0'),
      formatted
    });
    return formatted;
  };

  const rgb888Format = (rgb) => {
    try {
      return `0x${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`.toUpperCase();
    } catch (error) {
      return '0x000000';
    }
  };

  const rgba8888Format = (rgb, a) => {
    try {
      return `0x${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`.toUpperCase();
    } catch (error) {
      return '0x00000000';
    }
  };

  const argb8888Format = (rgb, a) => {
    try {
      return `0x${a.toString(16).padStart(2, '0')}${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`.toUpperCase();
    } catch (error) {
      return '0x00000000';
    }
  };

  const bgr888Format = (rgb) => {
    try {
      return `0x${rgb.b.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.r.toString(16).padStart(2, '0')}`.toUpperCase();
    } catch (error) {
      return '0x000000';
    }
  };

  const bgra8888Format = (rgb, a) => {
    try {
      return `0x${rgb.b.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.r.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`.toUpperCase();
    } catch (error) {
      return '0x00000000';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const addToPalette = () => {
    // Removed this function as it was not being used
  };

  const removeFromPalette = (colorToRemove) => {
    // Removed this function as it was not being used
  };

  const getColorInputPlaceholder = () => {
    switch (format) {
      case 'hex':
        return 'Enter color (e.g., #FF0000 or FF0000)';
      case 'rgb':
        return 'Enter color (e.g., rgb(255,0,0))';
      case 'rgba':
        return 'Enter color (e.g., rgba(255,0,0,1.0))';
      case 'rgb565':
        return 'Enter color (e.g., 0xF800 for red)';
      case 'rgb888':
        return 'Enter color (e.g., 0xFF0000)';
      case 'rgba8888':
        return 'Enter color (e.g., 0xFF0000FF)';
      case 'argb8888':
        return 'Enter color (e.g., 0xFFFF0000)';
      case 'bgr888':
        return 'Enter color (e.g., 0x0000FF for red)';
      case 'bgra8888':
        return 'Enter color (e.g., 0x0000FFFF for red)';
      default:
        return 'Enter color value';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Color Picker & Palette Generator
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Color Picker
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ColorBox 
                    sx={{ 
                      backgroundColor: color,
                      mb: 2,
                      height: '120px',
                      boxShadow: 1,
                      transition: 'box-shadow 0.3s',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={handleColorPickerChange}
                      style={{ width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                  </ColorBox>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Color Format</InputLabel>
                    <Select
                      value={format}
                      label="Color Format"
                      onChange={(e) => handleFormatChange(e.target.value)}
                    >
                      <MenuItem value="hex">Hex (#RRGGBB)</MenuItem>
                      <MenuItem value="rgb">RGB</MenuItem>
                      <MenuItem value="rgba">RGBA</MenuItem>
                      <MenuItem value="rgb565">RGB565 (16-bit)</MenuItem>
                      <MenuItem value="rgb888">RGB888 (24-bit)</MenuItem>
                      <MenuItem value="rgba8888">RGBA8888 (32-bit)</MenuItem>
                      <MenuItem value="argb8888">ARGB8888 (32-bit)</MenuItem>
                      <MenuItem value="bgr888">BGR888 (24-bit)</MenuItem>
                      <MenuItem value="bgra8888">BGRA8888 (32-bit)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {format.includes('rgba') || format.includes('argb') || format.includes('bgra') ? (
                  <Grid item xs={12}>
                    <Typography gutterBottom>Alpha</Typography>
                    <Slider
                      value={alpha}
                      onChange={(e, newValue) => setAlpha(newValue)}
                      min={0}
                      max={255}
                      valueLabelDisplay="auto"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Color Value"
                      value={inputValue}
                      onChange={(e) => {
                        console.log('TextField onChange:', e.target.value);
                        setIsUserInput(true);
                        handleColorInput(e.target.value);
                      }}
                      error={inputError}
                      helperText={inputError ? `Enter a valid ${format.toUpperCase()} value (e.g., ${getColorInputPlaceholder()})` : ''}
                      placeholder={getColorInputPlaceholder()}
                      onFocus={(e) => {
                        console.log('TextField focus');
                        e.target.select();
                      }}
                      onBlur={() => {
                        console.log('TextField blur');
                        if (inputError) {
                          setInputValue(lastValidInput);
                          setInputError(false);
                        }
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                    <Tooltip title="Copy color value">
                      <IconButton 
                        onClick={() => {
                          navigator.clipboard.writeText(inputValue);
                        }}
                        sx={{ 
                          ml: 1,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Color Palette
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Palette Type</InputLabel>
                <Select
                  value={paletteType}
                  label="Palette Type"
                  onChange={(e) => setPaletteType(e.target.value)}
                >
                  <MenuItem value="material">Material Design</MenuItem>
                  <MenuItem value="analogous">Analogous (5 colors)</MenuItem>
                  <MenuItem value="complementary">Complementary (6 colors)</MenuItem>
                  <MenuItem value="triadic">Triadic (3 colors)</MenuItem>
                  <MenuItem value="tetradic">Tetradic (4 colors)</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                justifyContent: paletteType === 'material' ? 'flex-start' : 'center'
              }}>
                {getPaletteColors().map((paletteColor, index) => (
                  <PaletteColor
                    key={index}
                    sx={{
                      backgroundColor: paletteColor,
                      width: paletteType === 'material' ? '45px' : '60px',
                      height: paletteType === 'material' ? '45px' : '60px',
                      boxShadow: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => {
                      setColor(paletteColor);
                      setInputValue(convertToCurrentFormat(paletteColor));
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <AboutToolSection
          title="Color Format Converter"
          description="The Color Format Converter is a versatile tool designed for developers working with different 
            color formats across various platforms and display technologies. It provides real-time conversion between 
            common color formats used in embedded displays, web development, and graphics programming."
          features={[
            {
              title: 'Color Format Support',
              items: [
                'RGB565 (16-bit color)',
                'RGB888/RGB24 (24-bit color)',
                'RGBA8888 (32-bit color)',
                'Hex color codes (#RRGGBB)',
                'RGB/RGBA values'
              ]
            },
            {
              title: 'Interactive Features',
              items: [
                'Visual color picker',
                'Alpha channel support',
                'Color palette generation',
                'One-click copying of values'
              ]
            },
            {
              title: 'Color Palettes',
              description: 'Generate complementary and analogous color schemes'
            },
            {
              title: 'Real-time Preview',
              description: 'Live preview of selected colors and instant format conversion'
            }
          ]}
          useCases={[
            'Embedded Display Development: Convert colors for LCD and OLED displays',
            'Web Development: Work with CSS colors and transparency',
            'UI Design: Create consistent color schemes',
            'Graphics Programming: Convert between different color spaces'
          ]}
        />
      </Box>
    </Container>
  );
};

export default ColorPicker;
