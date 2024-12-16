import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Home from './pages/Home';
import ElectronicDesignTools from './pages/ElectronicDesignTools';
import SignalPowerTools from './pages/SignalPowerTools';
import CommunicationTools from './pages/CommunicationTools';
import DeveloperTools from './pages/DeveloperTools';
import About from './pages/legal/About';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Contact from './pages/legal/Contact';

// Import all tool components
import OhmsLawCalculator from './tools/electronic/OhmsLawCalculator';
import LedResistorCalculator from './tools/electronic/LedResistorCalculator';
import ResistorColorCalculator from './tools/electronic/ResistorColorCalculator';
import CapacitorCalculator from './tools/electronic/CapacitorCalculator';
import VoltageDividerCalculator from './tools/electronic/VoltageDividerCalculator';
import RcFilterCalculator from './tools/electronic/RcFilterCalculator';
import ReactanceCalculator from './tools/electronic/ReactanceCalculator';
import PcbTraceCalculator from './tools/electronic/PcbTraceCalculator';
import BatteryLifeCalculator from './tools/electronic/BatteryLifeCalculator';
import VoltageRegulatorCalculator from './tools/electronic/VoltageRegulatorCalculator';
import AdcCalculator from './tools/electronic/AdcCalculator';
import PwmDacCalculator from './tools/electronic/PwmDacCalculator';
import BaseConverter from './tools/software/BaseConverter';
import CrcCalculator from './tools/software/CrcCalculator';
import SerialTerminal from './tools/software/SerialTerminal';
import ModbusTerminal from './tools/software/ModbusTerminal';
import ByteConverter from './tools/software/ByteConverter';
import RegexTester from './tools/software/RegexTester';
import JsonFormatter from './tools/software/JsonFormatter';
import BinaryViewer from './tools/software/BinaryViewer';
import ColorPicker from './tools/software/ColorPicker';
import ImageConverter from './tools/software/ImageConverter';
import AsciiTable from './tools/software/AsciiTable';
import TerminalControls from './tools/software/TerminalControls';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#1a1a1a',
      paper: '#242424',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      letterSpacing: '-0.01562em',
      marginBottom: '0.5em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      letterSpacing: '-0.00833em',
      marginBottom: '0.5em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      letterSpacing: '0em',
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.00735em',
      marginBottom: '0.5em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `linear-gradient(to bottom, rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.85)), url(${process.env.PUBLIC_URL}/hexBg.svg)`,
          backgroundSize: '230px 200px',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '6px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box>
          <Layout>
            <Container maxWidth="xl">
              <Routes>
                {/* Main category pages */}
                <Route path="/" element={<Home />} />
                <Route path="/electronic-tools" element={<ElectronicDesignTools />} />
                <Route path="/signal-power-tools" element={<SignalPowerTools />} />
                <Route path="/communication-tools" element={<CommunicationTools />} />
                <Route path="/developer-tools" element={<DeveloperTools />} />

                {/* Electronic Tools */}
                <Route path="/electronic-tools/ohms-law" element={<OhmsLawCalculator />} />
                <Route path="/electronic-tools/led-resistor" element={<LedResistorCalculator />} />
                <Route path="/electronic-tools/resistor-calculator" element={<ResistorColorCalculator />} />
                <Route path="/electronic-tools/capacitor-calculator" element={<CapacitorCalculator />} />
                <Route path="/electronic-tools/voltage-divider" element={<VoltageDividerCalculator />} />
                <Route path="/electronic-tools/rc-filter" element={<RcFilterCalculator />} />
                <Route path="/electronic-tools/reactance" element={<ReactanceCalculator />} />
                <Route path="/electronic-tools/pcb-trace" element={<PcbTraceCalculator />} />
                <Route path="/electronic-tools/battery-life" element={<BatteryLifeCalculator />} />
                <Route path="/electronic-tools/voltage-regulator" element={<VoltageRegulatorCalculator />} />

                {/* Software/Developer Tools */}
                <Route path="/developer-tools/base-converter" element={<BaseConverter />} />
                <Route path="/developer-tools/crc-calculator" element={<CrcCalculator />} />
                <Route path="/developer-tools/byte-converter" element={<ByteConverter />} />
                <Route path="/developer-tools/regex-tester" element={<RegexTester />} />
                <Route path="/developer-tools/json-formatter" element={<JsonFormatter />} />
                <Route path="/developer-tools/binary-viewer" element={<BinaryViewer />} />
                <Route path="/developer-tools/color-picker" element={<ColorPicker />} />
                <Route path="/developer-tools/image-converter" element={<ImageConverter />} />
                <Route path="/developer-tools/ascii-table" element={<AsciiTable />} />
                <Route path="/developer-tools/terminal-controls" element={<TerminalControls />} />

                {/* Communication Tools */}
                <Route path="/communication-tools/serial-terminal" element={<SerialTerminal />} />
                <Route path="/communication-tools/modbus-terminal" element={<ModbusTerminal />} />
                <Route path="/communication-tools/binary-viewer" element={<BinaryViewer />} />
                <Route path="/communication-tools/ascii-table" element={<AsciiTable />} />
                <Route path="/communication-tools/crc-calculator" element={<CrcCalculator />} />
                <Route path="/communication-tools/terminal-controls" element={<TerminalControls />} />

                {/* Signal & Power Tools */}
                <Route path="/signal-power-tools/rc-filter" element={<RcFilterCalculator />} />
                <Route path="/signal-power-tools/pwm-dac" element={<PwmDacCalculator />} />
                <Route path="/signal-power-tools/adc-calculator" element={<AdcCalculator />} />

                {/* Legal Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Container>
          </Layout>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
