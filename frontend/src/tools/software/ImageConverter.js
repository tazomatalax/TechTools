import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import AboutToolSection from '../../components/AboutToolSection';

const ImageConverter = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [format, setFormat] = useState('uint8');
  const [arrayOutput, setArrayOutput] = useState('');
  const [imageInfo, setImageInfo] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      // Create URL for preview
      setImagePreview(URL.createObjectURL(file));
      
      // Read file for processing
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setOriginalDimensions({ width: img.width, height: img.height });
          setDimensions({ width: img.width, height: img.height });
          setImageInfo({
            width: img.width,
            height: img.height,
            size: Math.round(file.size / 1024), // Convert to KB
            type: file.type
          });
          setArrayOutput(''); // Clear previous output
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseInt(value) || 0;
    if (maintainAspectRatio) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      if (dimension === 'width') {
        setDimensions({
          width: numValue,
          height: Math.round(numValue / aspectRatio)
        });
      } else {
        setDimensions({
          width: Math.round(numValue * aspectRatio),
          height: numValue
        });
      }
    } else {
      setDimensions(prev => ({
        ...prev,
        [dimension]: numValue
      }));
    }
  };

  const handleGenerateArray = () => {
    if (image && dimensions.width > 0 && dimensions.height > 0) {
      convertImage(image, format);
    }
  };

  const convertImage = (img, selectedFormat) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Draw image on canvas with scaling
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let output = '';
    const bytesPerPixel = 3; // RGB
    const totalPixels = canvas.width * canvas.height;

    // Add image dimensions as comments
    output = `// Image dimensions: ${canvas.width}x${canvas.height}\n`;
    
    switch (selectedFormat) {
      case 'uint8': {
        output += 'const uint8_t image_data[] = {\n';
        let line = '';
        let count = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          line += `${r}, ${g}, ${b}, `;
          count += 3;
          
          // Add newline after every 12 values (4 pixels)
          if (count >= 36) {
            output += line.trim() + '\n';
            line = '';
            count = 0;
          }
        }
        
        if (line) {
          output += line.trim() + '\n';
        }
        output += '};\n';
        break;
      }
      case 'uint16': {
        output += 'const uint16_t image_data[] = {\n';
        let line = '';
        let count = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = (pixels[i] >> 3) & 0x1F;
          const g = (pixels[i + 1] >> 2) & 0x3F;
          const b = (pixels[i + 2] >> 3) & 0x1F;
          const rgb565 = (r << 11) | (g << 5) | b;
          
          line += `0x${rgb565.toString(16).padStart(4, '0')}, `;
          count++;
          
          // Add newline after every 12 values
          if (count >= 12) {
            output += line.trim() + '\n';
            line = '';
            count = 0;
          }
        }
        
        if (line) {
          output += line.trim() + '\n';
        }
        output += '};\n';
        break;
      }
      case 'uint32': {
        output += 'const uint32_t image_data[] = {\n';
        let line = '';
        let count = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          const rgba = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0; // Ensure unsigned 32-bit
          
          // Format as uppercase hex, ensuring 8 digits
          line += `0x${rgba.toString(16).toUpperCase().padStart(8, '0')}, `;
          count++;
          
          // Add newline after every 8 values
          if (count >= 8) {
            output += line.trim() + '\n';
            line = '';
            count = 0;
          }
        }
        
        if (line) {
          output += line.trim() + '\n';
        }
        output += '};\n';
        break;
      }
    }
    
    // Add array size information
    const arraySize = totalPixels * (selectedFormat === 'uint8' ? 3 : 1);
    output += `\n// Array size: ${arraySize} elements`;
    
    setArrayOutput(output);
  };

  const handleFormatChange = (event) => {
    const newFormat = event.target.value;
    setFormat(newFormat);
    setArrayOutput(''); // Clear previous output when format changes
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(arrayOutput);
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview('');
    setArrayOutput('');
    setImageInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Image to Array Converter
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Image Upload
              </Typography>
              <Box 
                sx={{ 
                  mb: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'action.hover',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  }
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Drag and drop an image here, or click to select
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports PNG, JPG, GIF, and other common image formats
                </Typography>
              </Box>
              {imagePreview && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearImage}
                    >
                      Clear Image
                    </Button>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Resize Image:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Width"
                          type="number"
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          InputProps={{
                            inputProps: { min: 1 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Height"
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          InputProps={{
                            inputProps: { min: 1 }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={maintainAspectRatio}
                          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        />
                      }
                      label="Maintain aspect ratio"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleGenerateArray}
                    fullWidth
                    disabled={!image || dimensions.width < 1 || dimensions.height < 1}
                  >
                    Generate Array
                  </Button>
                  {imageInfo && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Image Information:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Dimensions: {imageInfo.width} × {imageInfo.height} pixels<br />
                        • Size: {imageInfo.size} KB<br />
                        • Type: {imageInfo.type}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Array Output
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Output Format:
                </Typography>
                <Select
                  fullWidth
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    setArrayOutput('');
                  }}
                >
                  <MenuItem value="uint8">uint8_t (RGB888)</MenuItem>
                  <MenuItem value="uint16">uint16_t (RGB565)</MenuItem>
                  <MenuItem value="uint32">uint32_t (RGBA8888)</MenuItem>
                </Select>
              </Box>
              <Box sx={{ 
                position: 'relative',
                flexGrow: 1,
                minHeight: '300px',
                display: 'flex'
              }}>
                <TextField
                  multiline
                  fullWidth
                  variant="outlined"
                  value={arrayOutput}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontFamily: 'monospace',
                      height: '100%',
                      '& .MuiInputBase-input': {
                        height: '100% !important',
                        overflow: 'auto !important'
                      }
                    }
                  }}
                />
                {arrayOutput && (
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      onClick={handleCopyToClipboard}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 40, // Moved further right to avoid scrollbar
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <AboutToolSection
          title="Image to Array Converter"
          description="The Image to Array Converter is a powerful tool that converts images into various array formats 
            commonly used in embedded systems and software development. It processes image data and generates 
            code-ready arrays in multiple formats."
          features={[
            {
              title: 'Multiple Output Formats',
              items: [
                'uint8_t arrays (RGB888 format, 24-bit color)',
                'uint16_t arrays (RGB565 format, 16-bit color)',
                'uint32_t arrays (RGBA8888 format, 32-bit color)'
              ]
            },
            {
              title: 'Image Information',
              description: 'Displays image dimensions, file size, and format'
            },
            {
              title: 'Preview',
              description: 'Visual preview of the uploaded image'
            },
            {
              title: 'Copy Support',
              description: 'One-click copying of generated arrays'
            }
          ]}
          useCases={[
            'Embedded Displays: Convert images for use with LCD/OLED displays',
            'Game Development: Create sprite arrays for game graphics',
            'Firmware Development: Include images in firmware code',
            'Web Development: Generate color arrays for canvas or WebGL applications'
          ]}
        />
      </Box>
    </Container>
  );
};

export default ImageConverter;
