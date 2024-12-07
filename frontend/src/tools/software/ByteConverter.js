/* global BigInt */
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    TextField, 
    Grid, 
    Typography, 
    ToggleButton, 
    ToggleButtonGroup,
    IconButton,
    Button,
    Paper,
    Tooltip,
    Container
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import AboutToolSection from '../../components/AboutToolSection';

const ByteConverter = () => {
    const theme = useTheme();
    const [bytes, setBytes] = useState(Array(8).fill('00'));
    const [endianness, setEndianness] = useState('little');
    const [numbers, setNumbers] = useState({
        int8: 0,
        uint8: 0,
        int16: 0,
        uint16: 0,
        int32: 0,
        uint32: 0,
        int64: BigInt(0),
        uint64: BigInt(0),
        float32: 0,
        float64: 0
    });
    const [tempInputs, setTempInputs] = useState({});
    const [activeField, setActiveField] = useState(null);

    // Store temporary input values
    // const [tempInputs, setTempInputs] = useState({});

    // Convert byte string to number
    const bytesToNumber = (format) => {
        try {
            const validBytes = bytes.filter(byte => byte.length === 2);
            const byteArray = new Uint8Array(
                validBytes.map(byte => parseInt(byte, 16))
            );

            if (endianness === 'big') {
                byteArray.reverse();
            }

            const dataView = new DataView(byteArray.buffer);
            
            switch(format) {
                case 'int8': return dataView.getInt8(0);
                case 'uint8': return dataView.getUint8(0);
                case 'int16': return dataView.getInt16(0, true);
                case 'uint16': return dataView.getUint16(0, true);
                case 'int32': return dataView.getInt32(0, true);
                case 'uint32': return dataView.getUint32(0, true);
                case 'int64': return dataView.getBigInt64(0, true);
                case 'uint64': return dataView.getBigUint64(0, true);
                case 'float32': return dataView.getFloat32(0, true);
                case 'float64': return dataView.getFloat64(0, true);
                default: return 0;
            }
        } catch (error) {
            console.error('Error converting bytes to number:', error);
            return 0;
        }
    };

    // Convert number to bytes
    const numberToBytes = (value, format) => {
        try {
            const buffer = new ArrayBuffer(8);
            const dataView = new DataView(buffer);
            
            switch(format) {
                case 'int8':
                    dataView.setInt8(0, parseInt(value));
                    return Array.from(new Uint8Array(buffer.slice(0, 1)));
                case 'uint8':
                    dataView.setUint8(0, parseInt(value));
                    return Array.from(new Uint8Array(buffer.slice(0, 1)));
                case 'int16':
                    dataView.setInt16(0, parseInt(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 2)));
                case 'uint16':
                    dataView.setUint16(0, parseInt(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 2)));
                case 'int32':
                    dataView.setInt32(0, parseInt(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 4)));
                case 'int64':
                    dataView.setBigInt64(0, BigInt(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 8)));
                case 'uint64':
                    dataView.setBigUint64(0, BigInt(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 8)));
                case 'float32':
                    dataView.setFloat32(0, parseFloat(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 4)));
                case 'float64':
                    dataView.setFloat64(0, parseFloat(value), true);
                    return Array.from(new Uint8Array(buffer.slice(0, 8)));
                default:
                    return Array(8).fill(0);
            }
        } catch (error) {
            console.error('Error converting number to bytes:', error);
            return Array(8).fill(0);
        }
    };

    // Handle number input changes
    const handleNumberChange = (format, value) => {
        try {
            // Filter input based on field type
            let filteredValue = value;
            if (format.startsWith('uint')) {
                // Only allow digits for unsigned integers
                filteredValue = value.replace(/[^0-9]/g, '');
            } else if (format.startsWith('int')) {
                // Allow digits and one minus sign at start for signed integers
                filteredValue = value.replace(/[^0-9-]/g, '');
                if (filteredValue.startsWith('-')) {
                    filteredValue = '-' + filteredValue.substring(1).replace(/-/g, '');
                }
            } else if (format.startsWith('float')) {
                // Allow digits, one decimal point, and one minus sign at start for floats
                filteredValue = value.replace(/[^0-9.-]/g, '');
                if (filteredValue.startsWith('-')) {
                    filteredValue = '-' + filteredValue.substring(1).replace(/-/g, '');
                }
                const parts = filteredValue.split('.');
                if (parts.length > 2) {
                    filteredValue = parts[0] + '.' + parts.slice(1).join('');
                }
            }

            // Only update if the filtered value is different from the original
            if (filteredValue === value) {
                setTempInputs(prev => ({ ...prev, [format]: value }));
                setActiveField(format);
            }
        } catch (error) {
            console.error('Error updating input:', error);
        }
    };

    // Handle calculate button click or enter key
    const handleCalculate = () => {
        if (!activeField || !tempInputs[activeField]) return;

        try {
            let value = tempInputs[activeField];
            let parsedValue;

            if (activeField.startsWith('float')) {
                if (!/^-?\d*\.?\d*$/.test(value)) return;
                if (value === '.' || value === '-' || value === '-.') return;
                parsedValue = parseFloat(value);
            } else if (activeField.startsWith('uint')) {
                if (!/^\d+$/.test(value)) return;
                parsedValue = parseInt(value);
            } else {
                if (!/^-?\d+$/.test(value)) return;
                parsedValue = parseInt(value);
            }

            if (!isNaN(parsedValue)) {
                const newBytes = numberToBytes(parsedValue, activeField);
                if (endianness === 'big') {
                    newBytes.reverse();
                }
                const paddedBytes = [...newBytes.map(b => b.toString(16).padStart(2, '0')), ...Array(8 - newBytes.length).fill('00')];
                setBytes(paddedBytes);
            }
        } catch (error) {
            console.error('Error calculating:', error);
        }
    };

    // Handle key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCalculate();
        }
    };

    // Handle clear button
    const handleClear = () => {
        setBytes(Array(8).fill('00'));
        setNumbers({
            int8: 0,
            uint8: 0,
            int16: 0,
            uint16: 0,
            int32: 0,
            uint32: 0,
            int64: BigInt(0),
            uint64: BigInt(0),
            float32: 0,
            float64: 0
        });
        setTempInputs({});
        setActiveField(null);
    };

    // Handle byte input changes
    const handleByteChange = (index, value) => {
        // Allow temporary invalid hex values during typing
        const newValue = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 2);
        const newBytes = [...bytes];
        newBytes[index] = newValue;
        setBytes(newBytes);
    };

    // Update all number formats when bytes change
    useEffect(() => {
        const newNumbers = {};
        Object.keys(numbers).forEach(format => {
            newNumbers[format] = bytesToNumber(format);
        });
        setNumbers(newNumbers);
        // Clear temp inputs when bytes are updated
        setTempInputs({});
        setActiveField(null);
    }, [bytes, endianness]);

    // Get display value for a field
    const getDisplayValue = (format, value) => {
        if (tempInputs[format] !== undefined) {
            return tempInputs[format];
        }
        if (format.startsWith('float')) {
            return value.toString();
        }
        return value.toString();
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Byte Converter
                </Typography>
                
                <Grid container spacing={3}>
                    {/* Left Panel - Byte Input */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Raw Bytes (Hex)
                            </Typography>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 1,
                                mb: 2
                            }}>
                                {bytes.map((byte, index) => (
                                    <TextField
                                        key={index}
                                        size="small"
                                        value={byte}
                                        onChange={(e) => handleByteChange(index, e.target.value)}
                                        sx={{
                                            fontFamily: 'monospace',
                                            '& input': { textAlign: 'center' }
                                        }}
                                        inputProps={{ 
                                            style: { fontFamily: 'monospace' },
                                            maxLength: 2
                                        }}
                                        placeholder="00"
                                    />
                                ))}
                            </Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: 2 
                            }}>
                                <Typography variant="body2" color="textSecondary">
                                    Endianness:
                                </Typography>
                                <ToggleButtonGroup
                                    value={endianness}
                                    exclusive
                                    onChange={(e, value) => value && setEndianness(value)}
                                    size="small"
                                >
                                    <ToggleButton value="little">
                                        Little
                                    </ToggleButton>
                                    <ToggleButton value="big">
                                        Big
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Panel - Number Formats */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={3}>
                                {/* Integers Panel */}
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        {/* Signed Integers */}
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                Signed Integers
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Int8"
                                                        value={getDisplayValue('int8', numbers.int8)}
                                                        onChange={(e) => handleNumberChange('int8', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Int16"
                                                        value={getDisplayValue('int16', numbers.int16)}
                                                        onChange={(e) => handleNumberChange('int16', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Int32"
                                                        value={getDisplayValue('int32', numbers.int32)}
                                                        onChange={(e) => handleNumberChange('int32', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Int64"
                                                        value={getDisplayValue('int64', numbers.int64.toString())}
                                                        onChange={(e) => handleNumberChange('int64', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* Unsigned Integers */}
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                Unsigned Integers
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="UInt8"
                                                        value={getDisplayValue('uint8', numbers.uint8)}
                                                        onChange={(e) => handleNumberChange('uint8', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="UInt16"
                                                        value={getDisplayValue('uint16', numbers.uint16)}
                                                        onChange={(e) => handleNumberChange('uint16', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="UInt32"
                                                        value={getDisplayValue('uint32', numbers.uint32)}
                                                        onChange={(e) => handleNumberChange('uint32', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="UInt64"
                                                        value={getDisplayValue('uint64', numbers.uint64.toString())}
                                                        onChange={(e) => handleNumberChange('uint64', e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Floating Point Panel */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                        Floating Point
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Float32 (Single)"
                                                value={getDisplayValue('float32', numbers.float32)}
                                                onChange={(e) => handleNumberChange('float32', e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                size="small"
                                                inputProps={{
                                                    inputMode: 'decimal',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Float64 (Double)"
                                                value={getDisplayValue('float64', numbers.float64)}
                                                onChange={(e) => handleNumberChange('float64', e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                size="small"
                                                inputProps={{
                                                    inputMode: 'decimal',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                justifyContent: 'flex-end', 
                                mt: 3,
                                borderTop: 1,
                                borderColor: 'divider',
                                pt: 3
                            }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<ClearIcon />}
                                    onClick={handleClear}
                                >
                                    Clear
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CalculateIcon />}
                                    onClick={handleCalculate}
                                >
                                    Calculate
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <AboutToolSection
                title="Byte Converter"
                description="The Byte Converter is a comprehensive tool for converting between different numeric 
                    data types and their byte representations. It supports both little and big endian byte orders, 
                    making it invaluable for cross-platform development and data format analysis."
                features={[
                    {
                        title: 'Data Type Support',
                        items: [
                            'Integer types (8-bit to 64-bit)',
                            'Unsigned integers (uint8 to uint64)',
                            'Floating point (32-bit and 64-bit)',
                            'Byte array representation'
                        ]
                    },
                    {
                        title: 'Endianness Options',
                        description: 'Switch between little and big endian byte orders'
                    },
                    {
                        title: 'Real-time Conversion',
                        description: 'Instant updates across all formats as you type'
                    },
                    {
                        title: 'Input Validation',
                        description: 'Automatic validation of hex values and numeric ranges'
                    }
                ]}
                useCases={[
                    'Embedded Systems: Convert between different numeric representations for various microcontrollers',
                    'Network Protocols: Analyze and prepare network packet data',
                    'File Formats: Work with binary file formats and data structures',
                    'Cross-platform Development: Handle data between different architectures'
                ]}
            />
        </Container>
    );
};

export default ByteConverter;
