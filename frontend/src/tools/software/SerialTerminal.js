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
    Chip
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

const BAUD_RATES = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600, 1000000, 1500000, 2000000];
const LINE_TIMEOUT = 50; // ms to wait before considering data as a new line

const HIGHLIGHT_COLORS = [
    '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', 
    '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9',
    '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2'
];

const getContrastTextColor = (bgColor) => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
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
                return pattern;
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
        return data;
    }

    // Find all matches for all patterns
    const matches = [];
    highlights.forEach(highlight => {
        let pattern = highlight.pattern;
        let searchIn = data;
        
        if (!highlight.caseSensitive) {
            pattern = pattern.toLowerCase();
            searchIn = data.toLowerCase();
        }

        let index = 0;
        while ((index = searchIn.indexOf(pattern, index)) !== -1) {
            matches.push({
                start: index,
                end: index + pattern.length,
                color: highlight.color,
                pattern: highlight.pattern,
                name: highlight.name
            });
            index += 1;
        }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Convert data to array for highlighting
    const chars = Array.from(data);
    let result = [];
    let pos = 0;

    matches.forEach(match => {
        if (match.start > pos) {
            result.push(<span key={`text-${pos}`}>{chars.slice(pos, match.start).join('')}</span>);
        }
        result.push(
            <Tooltip key={`highlight-${match.start}`} title={`${match.name}: ${match.pattern}`}>
                <span style={{ 
                    backgroundColor: match.color,
                    color: getContrastTextColor(match.color)
                }}>
                    {chars.slice(match.start, match.end).join('')}
                </span>
            </Tooltip>
        );
        pos = match.end;
    });

    if (pos < chars.length) {
        result.push(<span key={`text-${pos}`}>{chars.slice(pos).join('')}</span>);
    }

    return result;
};

const SerialTerminal = () => {
    const theme = useTheme();
    const [port, setPort] = useState(null);
    const [portInfo, setPortInfo] = useState(null);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [baudRate, setBaudRate] = useState(115200);
    const [displayFormat, setDisplayFormat] = useState('ascii');
    const [dataBuffer, setDataBuffer] = useState(new Uint8Array());
    const [receivedData, setReceivedData] = useState([]);
    const [sendFormat, setSendFormat] = useState('ascii');
    const [sendData, setSendData] = useState('');
    const [sendHistory, setSendHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [lineEnding, setLineEnding] = useState('none');
    const [autoRepeat, setAutoRepeat] = useState(false);
    const [repeatInterval, setRepeatInterval] = useState(1000);
    const [presets, setPresets] = useState([
        { name: 'Hello', command: 'Hello, World!' },
        { name: 'Query Status', command: '?status' },
    ]);
    const [showPresetDialog, setShowPresetDialog] = useState(false);
    const [newPreset, setNewPreset] = useState({ name: '', command: '' });
    const [highlights, setHighlights] = useState([]);
    const [showHighlightDialog, setShowHighlightDialog] = useState(false);
    const [newHighlight, setNewHighlight] = useState({
        pattern: '',
        type: 'text',
        name: '',
        color: HIGHLIGHT_COLORS[0],
        caseSensitive: true
    });

    const [autoScroll, setAutoScroll] = useState(true);

    const reader = useRef(null);
    const writer = useRef(null);
    const terminalRef = useRef(null);
    const lastDataTime = useRef(Date.now());
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

    const scrollToBottom = () => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (autoScroll) {
            scrollToBottom();
        }
    }, [receivedData, autoScroll]);

    const processIncomingData = (value) => {
        const now = Date.now();
        
        // Debug raw incoming data
        const decoder = new TextDecoder();
        const rawData = decoder.decode(value);
        
        // Combine new data with existing buffer
        const newBuffer = new Uint8Array(dataBuffer.length + value.length);
        newBuffer.set(dataBuffer);
        newBuffer.set(value, dataBuffer.length);
        
        // Convert entire buffer to string
        const fullText = decoder.decode(newBuffer);

        // Process the data immediately if it contains a complete line
        if (fullText.includes('\n') || fullText.includes('\r')) {
            // Split on any type of newline while preserving empty lines
            const lines = fullText.split(/(\r\n|\n\r|\n|\r)/);
            
            // Process all complete lines
            const completeLines = [];
            for (let i = 0; i < lines.length - 1; i += 2) {
                const line = lines[i];
                const lineEnding = i + 1 < lines.length ? lines[i + 1] : '';
                if (line || lineEnding) {
                    completeLines.push(line + lineEnding);
                }
            }
            
            if (completeLines.length > 0) {
                setReceivedData(oldData => [
                    ...oldData,
                    ...completeLines.map(line => ({
                        timestamp: new Date().toLocaleString(),
                        data: new TextEncoder().encode(line),
                        type: 'incoming'
                    }))
                ].slice(-5000));
            }
            
            // Store any remaining incomplete data in the buffer
            const lastLine = lines[lines.length - 1];
            if (lastLine) {
                setDataBuffer(new TextEncoder().encode(lastLine));
            } else {
                setDataBuffer(new Uint8Array());
            }
        } else {
            // No newline found, add to buffer
            setDataBuffer(newBuffer);
        }
        
        // Clear any existing timeout
        if (lineTimeoutRef.current) {
            clearTimeout(lineTimeoutRef.current);
        }
        
        // Set timeout to process buffer if no more data comes
        if (dataBuffer.length > 0) {
            lineTimeoutRef.current = setTimeout(() => {
                setReceivedData(oldData => [
                    ...oldData,
                    {
                        timestamp: new Date().toLocaleString(),
                        data: dataBuffer,
                        type: 'incoming'
                    }
                ].slice(-5000));
                setDataBuffer(new Uint8Array());
            }, LINE_TIMEOUT);
        }
        
        lastDataTime.current = now;
    };

    const renderData = (item) => {
        if (!item || !item.data) return '';
        
        // Ensure we're working with Uint8Array
        const bytes = item.data instanceof Uint8Array ? 
            item.data : 
            new Uint8Array(item.data);
            
        switch (displayFormat) {
            case 'ascii': {
                const decoder = new TextDecoder();
                const text = decoder.decode(bytes);
                return text;
            }
            case 'hex':
                return Array.from(bytes)
                    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
                    .join(' ');
            case 'decimal':
                return Array.from(bytes)
                    .map(b => b.toString(10).padStart(3, '0'))
                    .join(' ');
            case 'binary':
                return Array.from(bytes)
                    .map(b => b.toString(2).padStart(8, '0'))
                    .join(' ');
            default: {
                const decoder = new TextDecoder();
                return decoder.decode(bytes);
            }
        }
    };

    const disconnect = async () => {
        isReadingRef.current = false;
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
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            try {
                if (!reader.current) break;
                
                const { value, done } = await reader.current.read();
                if (done) {
                    reader.current.releaseLock();
                    break;
                }
                
                if (value) {
                    // Decode the new data and add to buffer
                    buffer += decoder.decode(value, { stream: true });
                    
                    // Split on newlines, keeping the last partial line in the buffer
                    const lines = buffer.split(/\r\n|\n|\r/);
                    buffer = lines.pop() || ''; // Keep the last partial line in buffer
                    
                    // Add complete lines to display
                    if (lines.length > 0) {
                        setReceivedData(oldData => [
                            ...oldData,
                            ...lines.map(line => ({
                                timestamp: new Date().toLocaleString(),
                                data: new TextEncoder().encode(line + '\n'),
                                type: 'incoming'
                            }))
                        ].slice(-5000));
                    }
                }
            } catch (error) {
                console.error('Error in read loop:', error);
                break;
            }
        }
        
        // Handle any remaining data in buffer
        if (buffer) {
            setReceivedData(oldData => [
                ...oldData,
                {
                    timestamp: new Date().toLocaleString(),
                    data: new TextEncoder().encode(buffer),
                    type: 'incoming'
                }
            ].slice(-5000));
        }
    };

    const clearData = () => {
        clearTimeout(lineTimeoutRef.current);
        setDataBuffer(new Uint8Array());
        setReceivedData([]);
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
        setSendHistory(prev => {
            const newHistory = [text, ...prev.filter(cmd => cmd !== text)].slice(0, 20);
            return newHistory;
        });
        setHistoryIndex(-1);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendDataToPort();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHistoryIndex(prev => {
                const newIndex = prev < sendHistory.length - 1 ? prev + 1 : prev;
                if (newIndex >= 0 && sendHistory[newIndex]) {
                    setSendData(sendHistory[newIndex]);
                }
                return newIndex;
            });
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHistoryIndex(prev => {
                const newIndex = prev > -1 ? prev - 1 : -1;
                setSendData(newIndex === -1 ? '' : sendHistory[newIndex]);
                return newIndex;
            });
        }
    };

    const startAutoRepeat = () => {
        if (autoRepeatRef.current) {
            clearInterval(autoRepeatRef.current);
        }
        autoRepeatRef.current = setInterval(sendDataToPort, repeatInterval);
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
            
            // Add line ending if needed
            if (lineEnding !== 'none') {
                data = input + LINE_ENDINGS[lineEnding];
            }

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

    const sendDataToPort = async () => {
        if (!writer.current || !sendData.trim()) return;

        try {
            setError('');
            const dataToSend = parseInputData(sendData.trim(), sendFormat);
            await writer.current.write(dataToSend);
            
            // Add to history and display
            if (dataToSend.length > 0) {
                addToHistory(sendData.trim());
                const timestamp = new Date().toLocaleString();
                setReceivedData(prev => [...prev, {
                    timestamp,
                    data: sendFormat === 'ascii' ? sendData + (lineEnding !== 'none' ? ` [${lineEnding}]` : '') : 
                        Array.from(dataToSend).map(b => b.toString(16).padStart(2, '0')).join(' '),
                    type: 'outgoing'
                }]);
            }
        } catch (err) {
            setError(err.message);
            stopAutoRepeat();
            setAutoRepeat(false);
        }
    };

    const handlePresetSave = () => {
        if (newPreset.name && newPreset.command) {
            setPresets(prev => [...prev, newPreset]);
            setNewPreset({ name: '', command: '' });
            setShowPresetDialog(false);
        }
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
                type: 'text',
                name: '',
                color: HIGHLIGHT_COLORS[highlights.length % HIGHLIGHT_COLORS.length],
                caseSensitive: true
            });
            setShowHighlightDialog(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Helper function to format timestamp in local timezone
    const formatLocalTime = (date) => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const startReading = async () => {
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (isReadingRef.current) {
            try {
                const { value, done } = await reader.current.read();
                if (done) break;
                
                if (value) {
                    // Process the data immediately
                    processIncomingData(value);
                }
            } catch (error) {
                if (isReadingRef.current) {
                    console.error('Error reading serial data:', error);
                    setError('Error reading serial data: ' + error.message);
                }
                break;
            }
        }
    };

    const handleSerialData = async (reader) => {
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    reader.releaseLock();
                    break;
                }
                if (value) {
                    processIncomingData(value);
                }
            }
        } catch (error) {
            console.error('Error reading serial data:', error);
            setError('Error reading serial data: ' + error.message);
            setIsConnected(false);
        }
    };

    const connectPort = async () => {
        if (!port) return;
        
        try {
            await port.open({ 
                baudRate,
                bufferSize: 4096,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                flowControl: 'none'
            });

            // Clear any existing reader/writer
            if (reader.current) {
                await reader.current.cancel();
                await reader.current.releaseLock();
            }
            if (writer.current) {
                await writer.current.releaseLock();
            }

            reader.current = port.readable.getReader();
            writer.current = port.writable.getWriter();
            isReadingRef.current = true;
            setIsConnected(true);
            
            // Start reading loop
            readLoop();
        } catch (err) {
            console.error('Error opening port:', err);
            setError('Error opening port: ' + err.message);
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Serial Terminal
            </Typography>
            
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <ToggleButtonGroup
                    value={displayFormat}
                    exclusive
                    onChange={handleFormatChange}
                    aria-label="display format"
                    size="small"
                >
                    <ToggleButton value="ascii" aria-label="ascii">
                        ASCII
                    </ToggleButton>
                    <ToggleButton value="hex" aria-label="hex">
                        HEX
                    </ToggleButton>
                    <ToggleButton value="decimal" aria-label="decimal">
                        DEC
                    </ToggleButton>
                    <ToggleButton value="binary" aria-label="binary">
                        BIN
                    </ToggleButton>
                </ToggleButtonGroup>

                <Tooltip title="Add Highlight Pattern">
                    <Button
                        size="small"
                        startIcon={<MarkerIcon />}
                        onClick={() => setShowHighlightDialog(true)}
                        sx={{ ml: 1 }}
                    >
                        Highlight Pattern
                    </Button>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    startIcon={<DeleteIcon />}
                    onClick={clearData}
                    size="small"
                >
                    Clear
                </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
                {highlights.map((highlight, index) => (
                    <Box key={index} sx={{ display: 'inline-block', mr: 1, mb: 1 }}>
                        <Tooltip title="Click to remove">
                            <Chip
                                label={highlight.pattern}
                                onDelete={() => setHighlights(prev => prev.filter((_, i) => i !== index))}
                                sx={{
                                    backgroundColor: highlight.color,
                                    color: theme.palette.getContrastText(highlight.color)
                                }}
                            />
                        </Tooltip>
                    </Box>
                ))}
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper 
                        ref={terminalRef}
                        variant="outlined" 
                        sx={{ 
                            p: 2, 
                            height: 'calc(100vh - 380px)', 
                            overflowY: 'auto',
                            backgroundColor: 'black',
                            fontFamily: 'monospace',
                            color: 'lightgreen'
                        }}
                    >
                        {receivedData.map((item, index) => (
                            <Box key={index} sx={{ mb: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                <span style={{ color: 'gray', marginRight: '8px' }}>
                                    {item.timestamp ? formatLocalTime(new Date(item.timestamp)) : ''}
                                </span>
                                {' '}
                                <Typography
                                    component="span"
                                    sx={{
                                        color: item.type === 'outgoing' ? 'success.main' : 'info.main'
                                    }}
                                >
                                    {applyHighlights(
                                        item.type === 'incoming' 
                                            ? renderData(item)
                                            : item.data,
                                        displayFormat,
                                        highlights
                                    )}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ 
                        p: 2, 
                        height: 'calc(100vh - 380px)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        overflow: 'auto' // Allow scrolling if content is too tall
                    }}>
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

                        <Button
                            variant="contained"
                            color={isConnected ? "error" : "primary"}
                            onClick={isConnected ? disconnect : connectPort}
                            startIcon={isConnected ? <StopIcon /> : <PlayArrowIcon />}
                            sx={{ mb: 2 }}
                            fullWidth
                            disabled={!port}
                        >
                            {isConnected ? 'Disconnect' : 'Connect'}
                        </Button>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            Settings
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Line Ending</FormLabel>
                                <RadioGroup
                                    value={lineEnding}
                                    onChange={(e) => setLineEnding(e.target.value)}
                                >
                                    <FormControlLabel value="none" control={<Radio />} label="None" />
                                    <FormControlLabel value="cr" control={<Radio />} label="Carriage Return" />
                                    <FormControlLabel value="lf" control={<Radio />} label="New Line" />
                                    <FormControlLabel value="crlf" control={<Radio />} label="NL + CR" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="send-format-label">Send Format</InputLabel>
                                <Select
                                    labelId="send-format-label"
                                    value={sendFormat}
                                    label="Send Format"
                                    onChange={(e) => setSendFormat(e.target.value)}
                                >
                                    <MenuItem value="ascii">ASCII</MenuItem>
                                    <MenuItem value="hex">HEX</MenuItem>
                                    <MenuItem value="decimal">Decimal</MenuItem>
                                    <MenuItem value="binary">Binary</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={autoScroll}
                                        onChange={(e) => setAutoScroll(e.target.checked)}
                                    />
                                }
                                label="Auto-scroll"
                            />
                        </Box>

                        <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push send box to bottom */}

                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={sendData}
                                onChange={(e) => setSendData(e.target.value)}
                                placeholder={`Enter data to send (${sendFormat.toUpperCase()})`}
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={sendDataToPort}
                                disabled={!isConnected}
                                fullWidth
                                startIcon={<SendIcon />}
                            >
                                Send
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={showHighlightDialog}
                onClose={() => setShowHighlightDialog(false)}
            >
                <DialogTitle>Add Highlight Pattern</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Pattern Name"
                        value={newHighlight.name}
                        onChange={(e) => setNewHighlight(prev => ({ ...prev, name: e.target.value }))}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Pattern"
                        value={newHighlight.pattern}
                        onChange={(e) => setNewHighlight(prev => ({ ...prev, pattern: e.target.value }))}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Pattern Type</InputLabel>
                        <Select
                            value={newHighlight.type}
                            onChange={(e) => setNewHighlight(prev => ({ ...prev, type: e.target.value }))}
                            label="Pattern Type"
                        >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="hex">Hex</MenuItem>
                            <MenuItem value="decimal">Decimal</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Color</InputLabel>
                        <Select
                            value={newHighlight.color}
                            onChange={(e) => setNewHighlight(prev => ({ ...prev, color: e.target.value }))}
                            label="Color"
                        >
                            {HIGHLIGHT_COLORS.map((color, index) => (
                                <MenuItem key={index} value={color}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 20, height: 20, backgroundColor: color, borderRadius: 1 }} />
                                        <span>Color {index + 1}</span>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newHighlight.caseSensitive}
                                onChange={(e) => setNewHighlight(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                            />
                        }
                        label="Case Sensitive"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowHighlightDialog(false)}>Cancel</Button>
                    <Button onClick={handleHighlightSave} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            <AboutToolSection
                title="Serial Terminal"
                description="A powerful and feature-rich serial communication tool designed for embedded systems development, hardware debugging, and protocol analysis. This terminal provides comprehensive data formatting options, advanced pattern highlighting, and robust connection management."
                features={[
                  {
                    title: 'Connection Management',
                    items: [
                      'Wide range of baud rates (300 bps to 2 Mbps)',
                      'Automatic COM port detection and connection',
                      'Reliable connection handling with automatic cleanup',
                      'Real-time connection status monitoring'
                    ]
                  },
                  {
                    title: 'Data Visualization',
                    items: [
                      'Multiple data formats (ASCII, Hexadecimal, Decimal, Binary)',
                      'Color-coded incoming/outgoing messages',
                      'Pattern highlighting with customizable colors',
                      'Local timezone timestamps'
                    ]
                  },
                  {
                    title: 'Data Input Options',
                    items: [
                      'Multiple line ending options (CR, LF, CR+LF)',
                      'Command history with up/down navigation',
                      'Preset commands for quick access',
                      'Auto-repeat functionality for testing'
                    ]
                  },
                  {
                    title: 'Advanced Features',
                    items: [
                      'Pattern matching with text/hex/decimal support',
                      'Case-sensitive or case-insensitive highlighting',
                      'Auto-scroll control',
                      'Clear terminal functionality'
                    ]
                  }
                ]}
                useCases={[
                  'Embedded Development: Debug and monitor microcontroller communication',
                  'Hardware Testing: Verify serial device functionality and analyze protocols',
                  'Production Testing: Automate device testing with preset commands and pattern matching',
                  'Protocol Analysis: Monitor and validate serial communication with pattern highlighting'
                ]}
            />
        </Box>
    );
};

export default SerialTerminal;
