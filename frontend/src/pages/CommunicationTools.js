import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Terminal as TerminalIcon,
  Router as ModbusIcon,
  Memory as BinaryIcon,
  Code as AsciiIcon,
  Calculate as CrcIcon,
} from '@mui/icons-material';

const ToolCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
}));

const tools = [
  {
    title: "Serial Terminal",
    description: "Monitor and analyze serial communication",
    iconComponent: TerminalIcon,
    path: '/communication-tools/serial-terminal',
    tags: ['serial', 'uart', 'communication', 'debug']
  },
  {
    title: "Modbus Terminal",
    description: "Communicate with Modbus RTU devices",
    iconComponent: ModbusIcon,
    path: '/communication-tools/modbus-terminal',
    tags: ['modbus', 'rtu', 'communication', 'industrial']
  },
  {
    title: "Binary Viewer",
    description: "View and analyze binary data in multiple formats",
    iconComponent: BinaryIcon,
    path: '/communication-tools/binary-viewer',
    tags: ['binary', 'hex', 'data', 'analysis']
  },
  {
    title: "ASCII Table",
    description: "Reference for ASCII characters and their values",
    iconComponent: AsciiIcon,
    path: '/communication-tools/ascii-table',
    tags: ['ascii', 'characters', 'encoding']
  },
  {
    title: "CRC Calculator",
    description: "Calculate CRC checksums for data validation",
    iconComponent: CrcIcon,
    path: '/communication-tools/crc-calculator',
    tags: ['crc', 'checksum', 'validation']
  },
  {
    title: "Terminal Controls",
    description: "Reference for terminal control sequences and escape codes",
    iconComponent: TerminalIcon,
    path: '/communication-tools/terminal-controls',
    tags: ['terminal', 'ansi', 'escape codes']
  }
];

function CommunicationTools() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Data & Communication Tools
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Tools for data communication, protocol analysis, and debugging
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.title}>
            <ToolCard component={RouterLink} to={tool.path} sx={{ textDecoration: 'none' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <IconWrapper>
                  <tool.iconComponent sx={{ fontSize: 'inherit' }} />
                </IconWrapper>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {tool.description}
                </Typography>
              </CardContent>
            </ToolCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CommunicationTools;
