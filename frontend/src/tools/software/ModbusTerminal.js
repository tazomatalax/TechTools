import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Grid,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slider,
    Checkbox,
    FormControlLabel,
    Divider,
    Switch,
    FormLabel,
    RadioGroup,
    Radio,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import RepeatIcon from '@mui/icons-material/Repeat';
import MarkerIcon from '@mui/icons-material/Create';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import AboutToolSection from '../../components/AboutToolSection';

// Standard Modbus baud rates
const BAUD_RATES = [9600, 19200, 38400, 57600, 115200];
const LINE_TIMEOUT = 100; // ms to wait before considering data as a new line

// Modbus function codes
const MODBUS_FUNCTIONS = {
    '01': 'Read Coils',
    '02': 'Read Discrete Inputs',
    '03': 'Read Holding Registers',
    '04': 'Read Input Registers',
    '05': 'Write Single Coil',
    '06': 'Write Single Register',
    '0F': 'Write Multiple Coils',
    '10': 'Write Multiple Registers'
};

const MODBUS_EXCEPTIONS = {
    '01': 'Illegal Function (The function code received in the query is not recognized or allowed by the slave)',
    '02': 'Illegal Data Address (The data address received in the query is not an allowed address for the slave)',
    '03': 'Illegal Data Value (A value contained in the query data field is not an allowed value for the slave)',
    '04': 'Slave Device Failure (An unrecoverable error occurred while the slave was attempting to perform the requested action)',
    '05': 'Acknowledge (The slave has accepted the request and is processing it, but a long duration of time will be required to do so)',
    '06': 'Slave Device Busy (The slave is engaged in processing a long-duration program command)',
    '08': 'Memory Parity Error (The slave attempted to read extended memory, but detected a parity error in the memory)',
    '0A': 'Gateway Path Unavailable (The gateway was unable to establish a connection path to the target device)',
    '0B': 'Gateway Target Device Failed to Respond (No response was obtained from the target device)',
};

// CRC16 calculation for Modbus RTU
const calculateCRC16 = (data) => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data[i];
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x0001) !== 0) {
                crc >>= 1;
                crc ^= 0xA001;
            } else {
                crc >>= 1;
            }
        }
    }
    return crc;
};

const HIGHLIGHT_COLORS = [
    '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', 
    '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9',
    '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2'
];

// Helper function to format timestamp in local timezone
const formatLocalTime = (date) => {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const formatData = (data, format) => {
    if (!data) return '';
    
    // For ASCII mode, return the raw string
    if (format === 'ascii') {
        return data;
    }

    // For other formats, convert string to bytes and then format
    const bytes = new TextEncoder().encode(data);
    switch (format) {
        case 'hex':
            return Array.from(bytes)
                .map(b => b.toString(16).padStart(2, '0').toUpperCase())
                .join(' ');
        case 'decimal':
            return Array.from(bytes)
                .map(b => b.toString(10).padStart(3, ' '))
                .join(' ');
        case 'binary':
            return Array.from(bytes)
                .map(b => b.toString(2).padStart(8, '0'))
                .join(' ');
        default:
            return data;
    }
};

const parseHighlightPattern = (pattern, type) => {
    try {
        switch (type) {
            case 'hex': {
                const cleanHex = pattern.replace(/0x/g, '').replace(/\s+/g, '');
                if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
                    throw new Error('Invalid hex format');
                }
                return cleanHex;
            }
            case 'decimal': {
                const numbers = pattern.split(/[\s,;]+/).filter(x => x);
                if (!numbers.every(n => /^\d+$/.test(n) && parseInt(n) <= 255)) {
                    throw new Error('Invalid decimal format');
                }
                return numbers.map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
            }
            case 'text':
            default:
                return new TextEncoder().encode(pattern)
                    .reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '');
        }
    } catch (err) {
        throw new Error(`Parse error: ${err.message}`);
    }
};

const applyHighlights = (data, format, highlights) => {
    if (!highlights.length) {
        return formatData(data, format);
    }

    // Convert data to hex for matching
    let hexData;
    try {
        hexData = parseHighlightPattern(data, 'text');  // Always convert from text for matching
    } catch {
        return formatData(data, format); // Return formatted data if conversion fails
    }

    // Find all matches for all patterns
    const matches = [];
    highlights.forEach(highlight => {
        let pattern = highlight.hexPattern;
        let searchIn = hexData;
        if (!highlight.caseSensitive) {
            pattern = pattern.toLowerCase();
            searchIn = hexData.toLowerCase();
        }

        let index = 0;
        while ((index = searchIn.indexOf(pattern, index)) !== -1) {
            matches.push({
                start: index / 2,
                end: (index + pattern.length) / 2,
                color: highlight.color,
                pattern: highlight.pattern,
                name: highlight.name
            });
            index += 2;
        }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Convert data to array for highlighting
    const formattedData = formatData(data, format);
    const chars = Array.from(formattedData);
    let result = [];
    let pos = 0;

    // Adjust positions based on format
    const getAdjustedPosition = (rawPos) => {
        switch (format) {
            case 'hex':
                return rawPos * 3;  // Each byte becomes 2 hex chars + 1 space
            case 'decimal':
                return rawPos * 4;  // Each byte becomes 3 decimal chars + 1 space
            case 'binary':
                return rawPos * 9;  // Each byte becomes 8 binary chars + 1 space
            case 'ascii':
            default:
                return rawPos;
        }
    };

    matches.forEach(match => {
        const startPos = getAdjustedPosition(match.start);
        const endPos = getAdjustedPosition(match.end);
        
        if (startPos > pos) {
            result.push(<span key={`text-${pos}`}>{chars.slice(pos, startPos).join('')}</span>);
        }
        result.push(
            <Tooltip key={`highlight-${startPos}`} title={`${match.name}: ${match.pattern}`}>
                <span style={{ backgroundColor: match.color }}>
                    {chars.slice(startPos, endPos).join('')}
                </span>
            </Tooltip>
        );
        pos = endPos;
    });

    if (pos < chars.length) {
        result.push(<span key={`text-${pos}`}>{chars.slice(pos).join('')}</span>);
    }

    return result;
};

const ModbusTerminal = () => {
    const theme = useTheme();
    const [port, setPort] = useState(null);
    const [portInfo, setPortInfo] = useState(null);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [baudRate, setBaudRate] = useState(9600);
    const [displayFormat, setDisplayFormat] = useState('hex');
    const [receivedData, setReceivedData] = useState([]);
    const [modbusConfig, setModbusConfig] = useState({
        slaveId: 1,
        functionCode: '03',
        startAddress: 0,
        quantity: 1,
        values: [] // For write operations
    });
    const [autoRepeat, setAutoRepeat] = useState(false);
    const [repeatInterval, setRepeatInterval] = useState(1000);
    const [highlights, setHighlights] = useState([]);
    const [showHighlightDialog, setShowHighlightDialog] = useState(false);
    const [newHighlight, setNewHighlight] = useState({
        pattern: '',
        type: 'hex',
        name: '',
        color: HIGHLIGHT_COLORS[0],
        caseSensitive: true
    });

    const [autoScroll, setAutoScroll] = useState(true);

    const [writeFormat, setWriteFormat] = useState('hex'); // 'hex' or 'dec'

    const reader = useRef(null);
    const writer = useRef(null);
    const analyticsInterval = useRef(null);
    const lastSecondBytes = useRef(0);
    const terminalRef = useRef(null);
    const decodedTerminalRef = useRef(null);
    const [lineBuffer, setLineBuffer] = useState('');
    const lineTimeoutRef = useRef(null);
    const isReadingRef = useRef(false);
    const autoRepeatRef = useRef(null);
    const lastUpdateTime = useRef(Date.now());

    const LINE_ENDINGS = {
        'none': '',
        'cr': '\r',
        'lf': '\n',
        'crlf': '\r\n'
    };

    const handleFormatChange = (event, newFormat) => {
        if (newFormat !== null) {
            setDisplayFormat(newFormat);
        }
    };

    const scrollToBottom = (ref) => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom(terminalRef);
        scrollToBottom(decodedTerminalRef);
    }, [receivedData]);

    const processIncomingData = (text) => {
        // Add to received data with the original text
        setReceivedData(prev => [...prev, {
            timestamp: new Date(),
            data: text,
            type: text.startsWith('TX:') ? 'tx' : 'rx'
        }]);
    };

    const handleSerialData = (value) => {
        // Convert the received data to hex string
        const hexData = Array.from(value)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join(' ')
            .toUpperCase();

        // Add to received data with RX prefix
        setReceivedData(prev => [...prev, { 
            timestamp: new Date(), 
            data: `RX: ${hexData}`,
            type: 'rx'
        }]);
    };

    const connectPort = async () => {
        try {
            setError('');
            
            // Open the port
            await port.open({ baudRate });
            
            // Get writer
            const portWriter = port.writable.getWriter();
            writer.current = portWriter;

            // Start reading
            const portReader = port.readable.getReader();
            reader.current = portReader;

            // Start the read loop
            readLoop();

            setIsConnected(true);
        } catch (err) {
            console.error('Error connecting to port:', err);
            setError(err.message);
            setIsConnected(false);
        }
    };

    const disconnect = async () => {
        try {
            if (reader.current) {
                await reader.current.cancel();
                reader.current.releaseLock();
                reader.current = null;
            }
            if (writer.current) {
                await writer.current.close();
                writer.current.releaseLock();
                writer.current = null;
            }
            if (port) {
                await port.close();
            }
            setIsConnected(false);
        } catch (err) {
            console.error('Error disconnecting:', err);
            setError(err.message);
        }
    };

    const readLoop = async () => {
        while (true) {
            try {
                if (!reader.current) break;
                
                const { value, done } = await reader.current.read();
                if (done) {
                    reader.current.releaseLock();
                    break;
                }
                
                if (value) {
                    handleSerialData(value);
                }
            } catch (error) {
                console.error('Error in read loop:', error);
                break;
            }
        }
    };

    const sendDataToPort = async () => {
        if (!port || !isConnected || !writer.current) {
            console.error('Port is not ready for writing');
            return;
        }

        try {
            const message = createModbusMessage();
            if (!message) {
                console.error('Failed to create Modbus message');
                return;
            }

            // Convert the message array to Uint8Array for sending
            const data = new Uint8Array(message);
            
            // Format for display
            const txData = Array.from(data)
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join(' ')
                .toUpperCase();

            // Add to received data
            setReceivedData(prev => [...prev, { 
                timestamp: new Date(), 
                data: `TX: ${txData}`,
                type: 'tx'
            }]);

            // Send the data
            await writer.current.write(data);

        } catch (error) {
            console.error('Error sending data:', error);
            if (error.message.includes('write') || error.message.includes('closed')) {
                await disconnect();
                setError('Write error occurred. Please reconnect.');
            }
        }
    };

    const requestPort = async () => {
        try {
            const selectedPort = await navigator.serial.requestPort();
            const portInfo = await selectedPort.getInfo();
            setPort(selectedPort);
            setPortInfo(portInfo);
        } catch (err) {
            console.error('Error selecting port:', err);
        }
    };

    const getPortDisplayName = () => {
        if (!port || !portInfo) return 'No Port Selected';
        
        return portInfo.usbVendorId ? 
            `Serial Device (VID:${portInfo.usbVendorId.toString(16).padStart(4, '0')} PID:${portInfo.usbProductId.toString(16).padStart(4, '0')})` : 
            'Serial Device';
    };

    const addToHistory = (text) => {
        // setSendHistory(prev => {
        //     const newHistory = [text, ...prev.filter(cmd => cmd !== text)].slice(0, 20);
        //     return newHistory;
        // });
        // setHistoryIndex(-1);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // sendDataToPort();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            // setHistoryIndex(prev => {
            //     const newIndex = prev < sendHistory.length - 1 ? prev + 1 : prev;
            //     if (newIndex >= 0 && sendHistory[newIndex]) {
            //         setSendData(sendHistory[newIndex]);
            //     }
            //     return newIndex;
            // });
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            // setHistoryIndex(prev => {
            //     const newIndex = prev > -1 ? prev - 1 : -1;
            //     setSendData(newIndex === -1 ? '' : sendHistory[newIndex]);
            //     return newIndex;
            // });
        }
    };

    const startAutoRepeat = () => {
        if (autoRepeatRef.current) {
            clearInterval(autoRepeatRef.current);
        }
        autoRepeatRef.current = setInterval(() => {
            // sendDataToPort();
        }, repeatInterval);
    };

    const stopAutoRepeat = () => {
        if (autoRepeatRef.current) {
            clearInterval(autoRepeatRef.current);
            autoRepeatRef.current = null;
        }
    };

    useEffect(() => {
        if (autoRepeat && isConnected) {
            startAutoRepeat();
        } else {
            stopAutoRepeat();
        }
        return () => stopAutoRepeat();
    }, [autoRepeat, isConnected, repeatInterval]);

    const parseInputData = (input, format) => {
        try {
            let data = input;
            
            // For Modbus RTU, we don't need line endings
            switch (format) {
                case 'hex': {
                    // Remove spaces and 0x prefixes
                    const cleanHex = data.replace(/0x/g, '').replace(/\s+/g, '');
                    if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
                        throw new Error('Invalid hex format. Use format like "0A 0B 0C" or "0x0A 0x0B"');
                    }
                    const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                    return bytes;
                }
                case 'decimal': {
                    // Split on spaces, commas, or semicolons
                    const numbers = data.split(/[\s,;]+/).filter(x => x);
                    if (!numbers.every(n => /^\d+$/.test(n) && parseInt(n) <= 255)) {
                        throw new Error('Invalid decimal format. Use numbers 0-255 separated by spaces');
                    }
                    return new Uint8Array(numbers.map(n => parseInt(n)));
                }
                case 'ascii':
                default:
                    return new TextEncoder().encode(data);
            }
        } catch (err) {
            throw new Error(`Parse error: ${err.message}`);
        }
    };

    const isWriteFunction = (functionCode) => {
        const writeOps = ['05', '06', '0F', '10'];
        return writeOps.includes(functionCode);
    };

    const getDefaultValue = (functionCode) => {
        switch(functionCode) {
            case '05': // Write Single Coil
            case '0F': // Write Multiple Coils
                return false;
            case '06': // Write Single Register
            case '10': // Write Multiple Registers
                return 0;
            default:
                return 0;
        }
    };

    useEffect(() => {
        if (isWriteFunction(modbusConfig.functionCode)) {
            const defaultValue = getDefaultValue(modbusConfig.functionCode);
            setModbusConfig(prev => ({
                ...prev,
                values: Array(prev.quantity).fill(defaultValue)
            }));
        }
    }, [modbusConfig.quantity, modbusConfig.functionCode]);

    const handleValueChange = (index, value) => {
        let numValue;
        if (writeFormat === 'hex') {
            // Remove '0x' prefix if present and convert hex string to number
            numValue = parseInt(value.replace(/^0x/, ''), 16);
        } else {
            numValue = parseInt(value);
        }

        // Ensure the value is within valid range (0-65535)
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 65535) {
            setModbusConfig(prev => ({
                ...prev,
                values: {
                    ...prev.values,
                    [index]: numValue
                }
            }));
        }
    };

    const formatWriteValue = (value) => {
        if (writeFormat === 'hex') {
            return '0x' + (value || 0).toString(16).toUpperCase().padStart(4, '0');
        }
        return value || 0;
    };

    const createModbusMessage = () => {
        // Convert values to numbers and validate
        const slaveId = parseInt(modbusConfig.slaveId);
        const functionCode = parseInt(modbusConfig.functionCode, 16);
        const startAddr = parseInt(modbusConfig.startAddress);
        const quantity = parseInt(modbusConfig.quantity);

        // Basic validation
        if (isNaN(slaveId) || isNaN(functionCode) || isNaN(startAddr) || isNaN(quantity)) {
            console.error('Invalid parameters');
            return null;
        }

        let message = [slaveId, functionCode];

        // Add start address (2 bytes)
        message.push((startAddr >> 8) & 0xFF);
        message.push(startAddr & 0xFF);

        // Handle different function codes
        switch (modbusConfig.functionCode) {
            case '01': // Read Coils
            case '02': // Read Discrete Inputs
            case '03': // Read Holding Registers
            case '04': // Read Input Registers
                message.push((quantity >> 8) & 0xFF);
                message.push(quantity & 0xFF);
                break;

            case '05': // Write Single Coil
                message.push((startAddr >> 8) & 0xFF);
                message.push(startAddr & 0xFF);
                message.push(modbusConfig.values[0] ? 0xFF : 0x00);
                message.push(0x00);
                break;

            case '06': // Write Single Register
                const value = parseInt(modbusConfig.values[0]) || 0;
                message.push((startAddr >> 8) & 0xFF);
                message.push(startAddr & 0xFF);
                message.push((value >> 8) & 0xFF);
                message.push(value & 0xFF);
                break;

            case '0F': // Write Multiple Coils
                message.push((startAddr >> 8) & 0xFF);
                message.push(startAddr & 0xFF);
                message.push((quantity >> 8) & 0xFF);
                message.push(quantity & 0xFF);
                
                // Calculate bytes needed for coils
                const byteCount = Math.ceil(quantity / 8);
                message.push(byteCount);
                
                // Pack coils into bytes
                for (let i = 0; i < byteCount; i++) {
                    let byteval = 0;
                    for (let bit = 0; bit < 8; bit++) {
                        const coilIndex = i * 8 + bit;
                        if (coilIndex < quantity && modbusConfig.values[coilIndex]) {
                            byteval |= (1 << bit);
                        }
                    }
                    message.push(byteval);
                }
                break;

            case '10': // Write Multiple Registers
                message.push((startAddr >> 8) & 0xFF);
                message.push(startAddr & 0xFF);
                message.push((quantity >> 8) & 0xFF);
                message.push(quantity & 0xFF);
                message.push(quantity * 2); // Byte count (2 bytes per register)
                
                // Add register values
                for (let i = 0; i < quantity; i++) {
                    const value = parseInt(modbusConfig.values[i]) || 0;
                    message.push((value >> 8) & 0xFF);
                    message.push(value & 0xFF);
                }
                break;

            default:
                console.error('Unsupported function code');
                return null;
        }

        // Calculate and append CRC
        const crc = calculateCRC16(message);
        message.push(crc & 0xFF);
        message.push((crc >> 8) & 0xFF);

        return message;
    };

    const decodeModbusResponse = (data) => {
        if (!data || typeof data !== 'string') return null;
        
        // Remove any TX/RX prefix if present and determine type
        let messageType = 'rx';  // default to rx
        let cleanData = data;
        
        if (data.startsWith('TX:')) {
            messageType = 'tx';
            cleanData = data.substring(3).trim();
        } else if (data.startsWith('RX:')) {
            messageType = 'rx';
            cleanData = data.substring(3).trim();
        }
        
        // Split the data into bytes and validate
        const bytes = cleanData.split(' ').map(byte => parseInt(byte, 16));
        if (bytes.some(isNaN)) return null;
        if (bytes.length < 5) return null;

        try {
            const slaveId = bytes[0];
            const functionCode = bytes[1];
            
            // Check if it's an exception response
            if (functionCode & 0x80) {
                const originalFunctionCode = functionCode & 0x7F;
                const exceptionCode = bytes[2];
                const exceptionHex = exceptionCode.toString(16).padStart(2, '0').toUpperCase();
                const functionName = MODBUS_FUNCTIONS[originalFunctionCode.toString(16).padStart(2, '0')] || 'Unknown Function';
                
                return {
                    slaveId,
                    functionCode: originalFunctionCode,
                    functionName: `Exception: ${functionName}`,
                    values: [{
                        code: exceptionCode,
                        hex: exceptionHex,
                        description: MODBUS_EXCEPTIONS[exceptionHex] || 'Unknown Exception'
                    }],
                    crcValid: validateCRC(bytes),
                    rawData: cleanData,
                    isException: true,
                    type: messageType
                };
            }

            // Handle normal response
            const functionName = MODBUS_FUNCTIONS[functionCode.toString(16).padStart(2, '0')] || 'Unknown Function';
            let values = [];
            
            // Parse based on function code
            switch (functionCode) {
                case 0x01: // Read Coils
                case 0x02: // Read Discrete Inputs
                    const byteCount = bytes[2];
                    const coilStates = [];
                    for (let i = 0; i < byteCount; i++) {
                        const byte = bytes[3 + i];
                        for (let bit = 0; bit < 8; bit++) {
                            coilStates.push((byte & (1 << bit)) !== 0);
                        }
                    }
                    values = coilStates;
                    break;

                case 0x03: // Read Holding Registers
                case 0x04: // Read Input Registers
                    const regByteCount = bytes[2];
                    const regCount = regByteCount / 2;
                    for (let i = 0; i < regCount; i++) {
                        const high = bytes[3 + i * 2];
                        const low = bytes[4 + i * 2];
                        values.push((high << 8) | low);
                    }
                    break;

                // Add other function codes as needed
            }

            return {
                slaveId,
                functionCode,
                functionName,
                values,
                crcValid: validateCRC(bytes),
                rawData: cleanData,
                type: messageType
            };

        } catch (error) {
            console.error('Error decoding Modbus response:', error);
            return null;
        }
    };

    const validateCRC = (bytes) => {
        if (bytes.length < 3) return false;
        const messageBytes = bytes.slice(0, -2);
        const receivedCrc = (bytes[bytes.length - 1] << 8) | bytes[bytes.length - 2];
        const calculatedCrc = calculateCRC16(new Uint8Array(messageBytes));
        return receivedCrc === calculatedCrc;
    };

    const formatModbusData = (data) => {
        if (!data || typeof data !== 'string') return '';
        
        // If it's already a TX/RX message, just return it
        if (data.startsWith('TX:') || data.startsWith('RX:')) {
            return data;
        }

        // Otherwise, try to decode it as a Modbus message
        return decodeModbusResponse(data);
    };

    const handlePresetSave = () => {
        // if (newPreset.name && newPreset.command) {
        //     setPresets(prev => [...prev, newPreset]);
        //     setNewPreset({ name: '', command: '' });
        //     setShowPresetDialog(false);
        // }
    };

    const handleHighlightSave = () => {
        try {
            if (!newHighlight.pattern || !newHighlight.name) return;
            
            // Convert pattern to hex for consistent matching
            const hexPattern = parseHighlightPattern(newHighlight.pattern, newHighlight.type);
            
            setHighlights(prev => [...prev, {
                ...newHighlight,
                hexPattern,
                id: Date.now()
            }]);
            
            setNewHighlight({
                pattern: '',
                type: 'hex',
                name: '',
                color: HIGHLIGHT_COLORS[highlights.length % HIGHLIGHT_COLORS.length],
                caseSensitive: true
            });
            setShowHighlightDialog(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (lineTimeoutRef.current) {
                clearTimeout(lineTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
                Modbus Terminal
            </Typography>
            
            <Grid container spacing={2}>
                {/* Main content area */}
                <Grid item xs={12} md={8}>
                    {/* Raw Data Terminal */}
                    <Paper
                        ref={terminalRef}
                        variant="outlined"
                        sx={{
                            height: '40vh',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'black',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ 
                            p: 1, 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="subtitle2" sx={{ color: 'white' }}>
                                Raw Data
                            </Typography>
                            <Button
                                startIcon={<DeleteIcon />}
                                onClick={() => setReceivedData([])}
                                size="small"
                                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                            >
                                Clear
                            </Button>
                        </Box>
                        <Box sx={{ 
                            p: 1,
                            flexGrow: 1,
                            overflow: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                        }}>
                            {receivedData.map((item, index) => (
                                <Box 
                                    key={index} 
                                    sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 0.5,
                                        color: item.type === 'tx' ? '#4CAF50' : '#2196F3'
                                    }}
                                >
                                    <Typography 
                                        component="div" 
                                        sx={{ 
                                            fontFamily: 'monospace',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-all'
                                        }}
                                    >
                                        {item.data}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    {/* Decoded Data Terminal */}
                    <Paper
                        ref={decodedTerminalRef}
                        variant="outlined"
                        sx={{
                            mt: 2,
                            height: '40vh',
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'black',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ 
                            p: 1, 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="subtitle2" sx={{ color: 'white' }}>
                                Decoded Modbus Data
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            p: 1,
                            flexGrow: 1,
                            overflow: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                        }}>
                            {receivedData.map((item, index) => {
                                // Only try to decode if it's an RX message
                                if (item.type !== 'rx') return null;

                                // Remove the RX prefix for decoding
                                const cleanData = item.data.replace(/^RX:\s*/, '');
                                const decoded = decodeModbusResponse(cleanData);
                                if (!decoded) return null;

                                return (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            mb: 2,
                                            pl: 1,
                                            borderLeft: '2px solid #2196F3'
                                        }}
                                    >
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#2196F3',
                                                mb: 1
                                            }}
                                        >
                                            Response #{index + 1}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'text.secondary',
                                                '& > div': { mb: 0.5 }
                                            }}
                                        >
                                            <div>Slave ID: {decoded.slaveId}</div>
                                            <div>Function: {decoded.functionName}</div>
                                            <div>
                                                CRC Status: {' '}
                                                <span style={{ 
                                                    color: decoded.crcValid ? '#4CAF50' : '#f44336'
                                                }}>
                                                    {decoded.crcValid ? 'Valid' : 'Invalid'}
                                                </span>
                                            </div>
                                        </Typography>
                                        
                                        {decoded.values && decoded.values.length > 0 && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Values:
                                                </Typography>
                                                <Box sx={{ ml: 2 }}>
                                                    {decoded.isException ? (
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: '#f44336',
                                                                '& > div': { mb: 0.5 }
                                                            }}
                                                        >
                                                            <div>Exception Code: {decoded.values[0].code} (0x{decoded.values[0].hex})</div>
                                                            <div>{decoded.values[0].description}</div>
                                                        </Typography>
                                                    ) : (
                                                        decoded.values.map((value, i) => (
                                                            <Typography 
                                                                key={i} 
                                                                variant="body2" 
                                                                sx={{ color: 'text.secondary', mb: 0.5 }}
                                                            >
                                                                {decoded.functionCode === 0x01 || decoded.functionCode === 0x02 ? 
                                                                    `Coil ${decoded.startAddress + i}: ${value ? 'ON' : 'OFF'}` :
                                                                    `Register ${decoded.startAddress + i}: ${value} (0x${value.toString(16).padStart(4, '0')})`
                                                                }
                                                            </Typography>
                                                        ))
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Grid>

                {/* Settings Panel */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            p: 2,
                            height: '82vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Connection Settings
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                onClick={requestPort}
                                disabled={isConnected}
                                fullWidth
                            >
                                Select COM Port
                            </Button>
                            {(port || isConnected) && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                    Connected to: {getPortDisplayName()}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="baud-rate-label">Baud Rate</InputLabel>
                                <Select
                                    labelId="baud-rate-label"
                                    value={baudRate}
                                    label="Baud Rate"
                                    onChange={(e) => setBaudRate(e.target.value)}
                                    disabled={isConnected}
                                >
                                    {BAUD_RATES.map((rate) => (
                                        <MenuItem key={rate} value={rate}>
                                            {rate}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                color={isConnected ? "error" : "primary"}
                                onClick={isConnected ? disconnect : connectPort}
                                startIcon={isConnected ? <StopIcon /> : <PlayArrowIcon />}
                                fullWidth
                                disabled={!port}
                            >
                                {isConnected ? 'Disconnect' : 'Connect'}
                            </Button>
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                            Modbus Settings
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="slave-id-label">Slave ID</InputLabel>
                                <Select
                                    labelId="slave-id-label"
                                    value={modbusConfig.slaveId}
                                    label="Slave ID"
                                    onChange={(e) => setModbusConfig(prev => ({
                                        ...prev,
                                        slaveId: parseInt(e.target.value)
                                    }))}
                                >
                                    {[...Array(247)].map((_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="function-code-label">Function</InputLabel>
                                <Select
                                    labelId="function-code-label"
                                    value={modbusConfig.functionCode}
                                    label="Function"
                                    onChange={(e) => setModbusConfig(prev => ({
                                        ...prev,
                                        functionCode: e.target.value
                                    }))}
                                >
                                    {Object.entries(MODBUS_FUNCTIONS).map(([code, name]) => (
                                        <MenuItem key={code} value={code}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Start Address"
                                type="number"
                                value={modbusConfig.startAddress}
                                onChange={(e) => setModbusConfig(prev => ({
                                    ...prev,
                                    startAddress: parseInt(e.target.value) || 0
                                }))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity"
                                value={modbusConfig.quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 1 && val <= 12) {
                                        setModbusConfig(prev => ({
                                            ...prev,
                                            quantity: val
                                        }));
                                    }
                                }}
                                inputProps={{ min: 1, max: 21 }}
                                sx={{ mb: 2 }}
                            />
                        </Box>

                        {isWriteFunction(modbusConfig.functionCode) && (
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle2">Write Values</Typography>
                                    <ToggleButtonGroup
                                        size="small"
                                        value={writeFormat}
                                        exclusive
                                        onChange={(e, newFormat) => {
                                            if (newFormat !== null) {
                                                setWriteFormat(newFormat);
                                            }
                                        }}
                                    >
                                        <ToggleButton value="hex">HEX</ToggleButton>
                                        <ToggleButton value="dec">DEC</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                                <Grid container spacing={2}>
                                    {Array.from({ length: Math.min(modbusConfig.quantity, 21) }).map((_, i) => (
                                        <Grid item xs={4} key={i}>
                                            <Box>
                                                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                                                    Register {modbusConfig.startAddress + i}
                                                </Typography>
                                                <TextField
                                                    size="small"
                                                    value={formatWriteValue(modbusConfig.values[i])}
                                                    onChange={(e) => handleValueChange(i, e.target.value)}
                                                    inputProps={{
                                                        style: { fontFamily: 'monospace' }
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={sendDataToPort}
                                disabled={!isConnected}
                                fullWidth
                            >
                                Send Modbus Request
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* About section */}
            <Paper variant="outlined" sx={{ p: 2, mt: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                    About this tool
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The Modbus Terminal is a tool for communicating with Modbus devices through USB/COM ports.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ModbusTerminal;
