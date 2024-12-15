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
import Icon from '@mdi/react';
import {
  mdiOmega,
  mdiLedOn,
  mdiMathNormBox,
  mdiDivision,
  mdiBatteryUnknown,
} from '@mdi/js';
import {
  Memory as PcbIcon,
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
    title: "Ohm's Law Calculator",
    description: "Calculate voltage, current, and resistance using Ohm's Law",
    icon: mdiOmega,
    path: '/electronic-tools/ohms-law',
    tags: ['voltage', 'current', 'resistance', 'power']
  },
  {
    title: "LED Series Resistor Calculator",
    description: "Calculate the required series resistor for LED circuits",
    icon: mdiLedOn,
    path: '/electronic-tools/led-resistor',
    tags: ['led', 'current limiting', 'resistor']
  },
  {
    title: "Resistor Value Decoder",
    description: "Decode resistor color codes and calculate resistance values",
    icon: mdiMathNormBox,
    path: '/electronic-tools/resistor-calculator',
    tags: ['resistor', 'color code', 'resistance']
  },
  {
    title: "Voltage Divider Calculator",
    description: "Calculate output voltage and resistor values for voltage dividers",
    icon: mdiDivision,
    path: '/electronic-tools/voltage-divider',
    tags: ['voltage', 'divider', 'resistor network']
  },
  {
    title: "Battery Life Calculator",
    description: "Estimate battery life based on load current and battery capacity",
    icon: mdiBatteryUnknown,
    path: '/electronic-tools/battery-life',
    tags: ['battery', 'power', 'capacity']
  },
  {
    title: "PCB Trace Calculator",
    description: "Calculate minimum trace width for PCB design",
    iconComponent: PcbIcon,
    path: '/electronic-tools/pcb-trace',
    tags: ['pcb', 'trace', 'width', 'current']
  }
];

function ElectronicDesignTools() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Electronic Design Tools
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Essential tools for electronic component calculations and circuit design
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.title}>
            <ToolCard component={RouterLink} to={tool.path} sx={{ textDecoration: 'none' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <IconWrapper>
                  {tool.iconComponent ? (
                    <tool.iconComponent sx={{ fontSize: 'inherit' }} />
                  ) : (
                    <Icon path={tool.icon} size={2} />
                  )}
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

export default ElectronicDesignTools;
