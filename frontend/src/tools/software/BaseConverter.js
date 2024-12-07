import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    IconButton,
    TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AboutToolSection from '../../components/AboutToolSection';

const DisplayBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    fontFamily: 'monospace',
    fontSize: '1.5rem',
    textAlign: 'right',
    backgroundColor: theme.palette.background.default,
}));

const CalcButton = styled(Button)(({ theme }) => ({
    width: '100%',
    height: '60px',
    margin: '2px',
    fontSize: '1.2rem',
}));

const NumberButton = styled(CalcButton)(({ theme }) => ({
    height: '75px', // 48px * 1.4
}));

export default function MultiBaseCalculator() {
    const [displayHex, setDisplayHex] = useState('0');
    const [displayDec, setDisplayDec] = useState('0');
    const [displayBin, setDisplayBin] = useState('0');
    const [currentBase, setCurrentBase] = useState('dec'); // 'hex', 'dec', 'bin'
    const [operation, setOperation] = useState(null);
    const [storedValue, setStoredValue] = useState(null);
    const [newNumber, setNewNumber] = useState(true);
    const [equation, setEquation] = useState('');
    const [currentInput, setCurrentInput] = useState('');
    const [bracketCount, setBracketCount] = useState(0);
    const [lastKey, setLastKey] = useState('');

    const getCurrentDisplay = () => {
        switch (currentBase) {
            case 'hex': return displayHex;
            case 'bin': return displayBin;
            default: return displayDec;
        }
    };

    const formatBinary = (num) => {
        // Convert to binary string, handle negative numbers
        let bin = Math.abs(num).toString(2);
        // Pad with zeros to make length multiple of 4
        const padding = 4 - (bin.length % 4);
        if (padding < 4) bin = '0'.repeat(padding) + bin;
        // Add spaces every 4 bits from right
        return bin.match(/.{1,4}/g).join(' ');
    };

    const updateDisplays = (value) => {
        // Parse the input value, handling both prefixed and non-prefixed numbers
        let num;
        if (typeof value === 'string') {
            if (value.startsWith('0x')) {
                num = parseInt(value, 16);
            } else if (value.startsWith('0b')) {
                num = parseInt(value.slice(2), 2);
            } else {
                num = parseInt(value);
            }
        } else {
            num = value;
        }

        // Format the displays without adding prefixes (they'll be added by handleNumber)
        const absHex = Math.abs(num).toString(16).toUpperCase();
        const binStr = formatBinary(Math.abs(num));
        
        setDisplayHex(num < 0 ? '-' + absHex : absHex);
        setDisplayDec(num.toString());
        setDisplayBin(num < 0 ? '-' + binStr : binStr);
        setCurrentInput(num.toString());
    };

    const handleOperation = (op) => {
        if (equation === '') return;

        // Convert symbols for display
        let displayOp;
        switch(op) {
            case '*': displayOp = '×'; break;
            case '/': displayOp = '÷'; break;
            case '&': displayOp = 'AND'; break;
            case '|': displayOp = 'OR'; break;
            case '^': displayOp = 'XOR'; break;
            case 'LSHIFT': displayOp = 'LSHIFT'; break;
            case 'RSHIFT': displayOp = 'RSHIFT'; break;
            default: displayOp = op;
        }
        
        // Add spaces around the operator for readability
        setEquation(equation + ' ' + displayOp + ' ');
        setNewNumber(true);
    };

    const handleNumber = (num) => {
        let newEquation;
        
        // Check if we're in the middle of entering a prefixed number
        const parts = equation.split(/[\s+\-*\/&|^()<<>>]+/);
        const lastNumber = parts[parts.length - 1] || '';
        const hasPrefix = lastNumber.startsWith('0x') || lastNumber.startsWith('0b');
        
        if (newNumber && !equation.endsWith(' ')) {
            // Starting a new number (not after an operator)
            newEquation = /[A-F]/.test(num) ? '0x' + num : num;
        } else if (newNumber) {
            // Starting a new number after an operator
            if (equation.endsWith('0x') || equation.endsWith('0b')) {
                // If we just added a prefix, just append the number
                newEquation = equation + num;
            } else {
                newEquation = equation + (/[A-F]/.test(num) ? '0x' + num : num);
            }
        } else {
            if (/[A-F]/.test(num)) {
                // If entering a hex letter
                if (!lastNumber) {
                    // Start a new hex number
                    newEquation = equation + '0x' + num;
                } else if (!hasPrefix) {
                    // Convert current number to hex
                    const prefix = equation.slice(0, -lastNumber.length);
                    newEquation = prefix + '0x' + lastNumber + num;
                } else {
                    // Continue existing hex number
                    newEquation = equation + num;
                }
            } else {
                // Just append the number
                newEquation = equation + num;
            }
        }
        
        setEquation(newEquation);
        setNewNumber(false);
        
        try {
            // Parse and evaluate the equation
            const evalStr = newEquation
                .split(' ')
                .map(part => {
                    if (part.startsWith('0x')) {
                        return parseInt(part, 16).toString();
                    } else if (part.startsWith('0b')) {
                        return parseInt(part.slice(2), 2).toString();
                    } else switch(part) {
                        case '×': return '*';
                        case '÷': return '/';
                        case 'AND': return '&';
                        case 'OR': return '|';
                        case 'XOR': return '^';
                        case 'LSHIFT': return '<<';
                        case 'RSHIFT': return '>>';
                        default: return part;
                    }
                })
                .join(' ');
            
            const result = eval(evalStr);
            updateDisplays(result);
        } catch (e) {
            // If evaluation fails, just show the current number
            try {
                const parts = newEquation.split(/[\s+\-*\/&|^()]+/);
                const lastNum = parts[parts.length - 1];
                updateDisplays(lastNum);
            } catch (err) {
                console.log('Parse error:', err);
            }
        }
    };

    const handleBracket = (type) => {
        if (type === '(' && (newNumber || equation === '')) {
            setBracketCount(bracketCount + 1);
            setEquation(equation + '(');
        } else if (type === ')' && bracketCount > 0 && !newNumber) {
            setBracketCount(bracketCount - 1);
            setEquation(equation + ')');
        }
    };

    const evaluateExpression = (expr) => {
        // Replace operators with JavaScript operators
        expr = expr.replace(/&/g, '&')
                 .replace(/\|/g, '|')
                 .replace(/\^/g, '^')
                 .replace(/>>/g, '>>')
                 .replace(/<</g, '<<')
                 .replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/√/g, 'Math.sqrt')
                 .replace(/\^/g, '**');
        
        try {
            // Use Function instead of eval for better security
            const result = Function('"use strict";return (' + expr + ')')();
            return result;
        } catch (error) {
            console.error('Error evaluating expression:', error);
            return 'Error';
        }
    };

    const formatEquationDisplay = (eq) => {
        // Convert programming operators to readable format
        return eq.replace(/&/g, ' AND ')
                 .replace(/\|/g, ' OR ')
                 .replace(/\^/g, ' XOR ')
                 .replace(/>>/g, ' RSHIFT ')
                 .replace(/<</g, ' LSHIFT ')
                 .replace(/\*/g, ' × ')
                 .replace(/\//g, ' ÷ ')
                 .replace(/Math\.sqrt/g, '√')
                 .replace(/\*\*/g, '^');
    };

    const formatEquationForEvaluation = (eq) => {
        // Convert readable format back to programming operators
        return eq.replace(/AND/g, '&')
                 .replace(/OR/g, '|')
                 .replace(/XOR/g, '^')
                 .replace(/RSHIFT/g, '>>')
                 .replace(/LSHIFT/g, '<<')
                 .replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/√/g, 'Math.sqrt')
                 .replace(/\^/g, '**');
    };

    const handleEquationChange = (event) => {
        const value = event.target.value;
        // Allow programming operators and readable format operators
        if (/^[0-9A-Fa-f\s\+\-\*\/\&\|\^\(\)\<\>\=\x]*(0x)?[0-9A-Fa-f\s\+\-\*\/\&\|\^\(\)\<\>\=]*$/.test(value) ||
            /^[0-9A-Fa-f\s\+\-\*\/\(\)\=ANDORXSHIFTandorxshift\x]*(0x)?[0-9A-Fa-f\s\+\-\*\/\(\)\=ANDORXSHIFTandorxshift]*$/.test(value)) {
            setEquation(value.toUpperCase());
        }
    };

    const handleEquals = () => {
        if (equation === '') return;
        
        try {
            // Replace display operators with JavaScript operators
            const evalStr = equation
                .split(' ')
                .map(part => {
                    if (part.startsWith('0x')) {
                        return parseInt(part, 16).toString();
                    } else if (part.startsWith('0b')) {
                        return parseInt(part.slice(2), 2).toString();
                    } else switch(part) {
                        case '×': return '*';
                        case '÷': return '/';
                        case 'AND': return '&';
                        case 'OR': return '|';
                        case 'XOR': return '^';
                        case 'LSHIFT': return '<<';
                        case 'RSHIFT': return '>>';
                        default: return part;
                    }
                })
                .join(' ');
            
            const result = eval(evalStr);
            updateDisplays(result);
            setEquation(result.toString());
            setNewNumber(true);
        } catch (e) {
            console.log('Evaluation error:', e);
        }
    };

    const handleClear = () => {
        setEquation('');
        setCurrentInput('');
        updateDisplays(0);
        setNewNumber(true);
        setBracketCount(0);
    };

    const handlePrefix = (prefix) => {
        if (newNumber) {
            // If starting a new number, either start with prefix or append to equation
            const newEq = equation.endsWith(' ') ? equation + prefix : prefix;
            setEquation(newEq);
        } else {
            // If continuing a number, only add prefix if we're not already in a prefixed number
            const parts = equation.split(/[\s+\-*\/&|^()]+/);
            const lastNumber = parts[parts.length - 1] || '';
            if (!lastNumber.startsWith('0x') && !lastNumber.startsWith('0b')) {
                const prefix = equation.slice(0, -lastNumber.length);
                setEquation(prefix + '0x' + lastNumber);
            }
        }
        setNewNumber(false);
    };

    const handleBackspace = () => {
        if (equation === '') return;

        // Remove the last character, handling operators with spaces
        let newEquation = equation;
        if (equation.endsWith(' ')) {
            // If ending with space, remove the operator and spaces
            newEquation = equation.slice(0, -3);
        } else {
            // Just remove last character
            newEquation = equation.slice(0, -1);
        }

        setEquation(newEquation);
        
        // Try to evaluate the new equation
        try {
            if (newEquation === '') {
                updateDisplays('0');
            } else {
                const parts = newEquation.split(/[\s+\-*\/&|^()]+/);
                const lastNum = parts[parts.length - 1];
                updateDisplays(lastNum);
            }
        } catch (e) {
            console.log('Parse error:', e);
        }
    };

    const handleKeyDown = (event) => {
        event.preventDefault();
        const key = event.key.toUpperCase();

        // Handle numbers and hex letters
        if (/^[0-9A-F]$/.test(key)) {
            handleNumber(key);
            return;
        }

        // Handle operators
        switch (key) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '(':
            case ')':
            case '&':
            case '|':
            case '^':
                handleOperation(key);
                break;
            case '<':
                // Check if it's a double < for left shift
                if (event.shiftKey || lastKey === '<') {
                    handleOperation('LSHIFT');
                }
                setLastKey('<');
                break;
            case '>':
                // Check if it's a double > for right shift
                if (event.shiftKey || lastKey === '>') {
                    handleOperation('RSHIFT');
                }
                setLastKey('>');
                break;
            case 'X':
                if (event.shiftKey) {
                    handleOperation('^'); // XOR
                } else {
                    handleOperation('×'); // Multiplication
                }
                break;
            case 'ENTER':
            case '=':
                handleEquals();
                break;
            case 'BACKSPACE':
                handleBackspace();
                break;
            case 'ESCAPE':
                handleClear();
                break;
            default:
                // Reset lastKey for other keys
                setLastKey('');
                break;
        }

        // Reset lastKey after a short delay
        setTimeout(() => {
            if (lastKey === key) {
                setLastKey('');
            }
        }, 300);
    };

    const handleBaseChange = (base) => {
        setCurrentBase(base);
        setNewNumber(true);
    };

    const handleToggleSign = () => {
        const currentValue = parseInt(displayDec);
        updateDisplays(-currentValue);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Multi-Base Calculator</Typography>
                
                {/* Equation Display */}
                <Box mb={2}>
                    <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Equation:</span>
                        <span style={{ fontSize: '0.8em', color: 'text.secondary' }}>
                            Keyboard operators: + - * / &amp; | ^ &lt;&lt; &gt;&gt; ( )
                        </span>
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={formatEquationDisplay(equation)}
                        onChange={handleEquationChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter expression (e.g., 0xFF AND 0b1010)"
                        sx={{
                            fontFamily: 'monospace',
                            '& .MuiInputBase-input': {
                                fontSize: '1.2rem',
                                fontFamily: 'monospace',
                            }
                        }}
                        inputProps={{
                            style: { textTransform: 'uppercase' }
                        }}
                    />
                </Box>

                {/* Result Displays */}
                <Box mb={2}>
                    <Typography variant="caption">HEX:</Typography>
                    <DisplayBox sx={{ backgroundColor: 'action.hover' }}>
                        {displayHex.startsWith('-') ? '-0x' + displayHex.substring(1) : '0x' + displayHex}
                    </DisplayBox>
                    
                    <Typography variant="caption">DEC:</Typography>
                    <DisplayBox sx={{ backgroundColor: 'action.hover' }}>{displayDec}</DisplayBox>
                    
                    <Typography variant="caption">BIN:</Typography>
                    <DisplayBox sx={{ backgroundColor: 'action.hover' }}>
                        {displayBin.startsWith('-') ? '-0b' + displayBin.substring(1) : '0b' + displayBin}
                    </DisplayBox>
                </Box>

                <Grid container spacing={2}>
                    {/* Left side - Numbers and basic input */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={1}>
                            {/* Prefix buttons */}
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <CalcButton variant="outlined" onClick={() => handlePrefix('0x')}>0x</CalcButton>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <CalcButton variant="outlined" onClick={() => handlePrefix('0b')}>0b</CalcButton>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Number pad and hex letters */}
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                            {/* Row 1: D E F */}
                                            {['D', 'E', 'F'].map((hex) => (
                                                <Grid item xs={4} key={hex}>
                                                    <NumberButton variant="contained" onClick={() => handleNumber(hex)}>
                                                        {hex}
                                                    </NumberButton>
                                                </Grid>
                                            ))}
                                            {/* Row 2: A B C */}
                                            {['A', 'B', 'C'].map((hex) => (
                                                <Grid item xs={4} key={hex}>
                                                    <NumberButton variant="contained" onClick={() => handleNumber(hex)}>
                                                        {hex}
                                                    </NumberButton>
                                                </Grid>
                                            ))}
                                            {/* Row 3: 7 8 9 */}
                                            {['7', '8', '9'].map((num) => (
                                                <Grid item xs={4} key={num}>
                                                    <NumberButton variant="contained" onClick={() => handleNumber(num)}>
                                                        {num}
                                                    </NumberButton>
                                                </Grid>
                                            ))}
                                            {/* Row 4: 4 5 6 */}
                                            {['4', '5', '6'].map((num) => (
                                                <Grid item xs={4} key={num}>
                                                    <NumberButton variant="contained" onClick={() => handleNumber(num)}>
                                                        {num}
                                                    </NumberButton>
                                                </Grid>
                                            ))}
                                            {/* Row 5: 1 2 3 */}
                                            {['1', '2', '3'].map((num) => (
                                                <Grid item xs={4} key={num}>
                                                    <NumberButton variant="contained" onClick={() => handleNumber(num)}>
                                                        {num}
                                                    </NumberButton>
                                                </Grid>
                                            ))}
                                            {/* Row 6: 0 = */}
                                            <Grid item xs={4}>
                                                <NumberButton variant="contained" onClick={() => handleNumber('0')}>
                                                    0
                                                </NumberButton>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <NumberButton variant="contained" onClick={handleEquals} fullWidth>
                                                    =
                                                </NumberButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right side - Operations */}
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={1}>
                            {/* Clear button */}
                            <Grid item xs={12}>
                                <CalcButton variant="contained" color="error" onClick={handleClear} fullWidth>
                                    AC
                                </CalcButton>
                            </Grid>

                            {/* Basic operations */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Basic Operations</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" onClick={() => handleOperation('(')}>
                                    (
                                </CalcButton>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" onClick={() => handleOperation(')')}>
                                    )
                                </CalcButton>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" onClick={() => handleOperation('×')}>
                                    ×
                                </CalcButton>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" onClick={() => handleOperation('÷')}>
                                    ÷
                                </CalcButton>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" onClick={() => handleOperation('+')}>
                                    +
                                </CalcButton>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" onClick={() => handleOperation('-')}>
                                    -
                                </CalcButton>
                            </Grid>

                            {/* Bit Operations */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Bit Operations</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" color="secondary" onClick={() => handleOperation('LSHIFT')}>
                                    LSHIFT
                                </CalcButton>
                            </Grid>
                            <Grid item xs={6}>
                                <CalcButton variant="outlined" color="secondary" onClick={() => handleOperation('RSHIFT')}>
                                    RSHIFT
                                </CalcButton>
                            </Grid>

                            {/* Logical operators */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Logical Operators</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <CalcButton variant="outlined" color="secondary" onClick={() => handleOperation('AND')}>
                                    AND
                                </CalcButton>
                            </Grid>
                            <Grid item xs={4}>
                                <CalcButton variant="outlined" color="secondary" onClick={() => handleOperation('OR')}>
                                    OR
                                </CalcButton>
                            </Grid>
                            <Grid item xs={4}>
                                <CalcButton variant="outlined" color="secondary" onClick={() => handleOperation('XOR')}>
                                    XOR
                                </CalcButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Paper>

            <AboutToolSection
              title="Multi-Base Calculator"
              description="The Multi-Base Calculator is a versatile tool designed for developers and engineers who work with 
                different number systems. It allows real-time conversion and arithmetic operations between decimal, 
                hexadecimal, and binary number systems."
              features={[
                {
                  title: 'Real-time Conversion',
                  description: 'Instantly view numbers in decimal, hexadecimal, and binary formats'
                },
                {
                  title: 'Arithmetic Operations',
                  items: [
                    'Addition, subtraction, multiplication, and division',
                    'Bitwise operations (AND, OR, XOR, NOT)',
                    'Shift operations (left and right shift)',
                    'Support for parentheses and complex expressions'
                  ]
                },
                {
                  title: 'Interactive Input',
                  description: 'Switch between number bases while maintaining the current value'
                },
                {
                  title: 'Error Prevention',
                  description: 'Input validation to prevent invalid operations and maintain data integrity'
                }
              ]}
              useCases={[
                'Embedded Systems: Convert between number bases for register values and memory addresses',
                'Digital Design: Calculate bitwise operations for hardware design',
                'Software Development: Debug binary data and perform hex calculations',
                'Protocol Analysis: Convert between different data representations'
              ]}
            />
        </Container>
    );
}
