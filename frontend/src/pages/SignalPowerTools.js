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
  mdiChartSankey,
  mdiChartBellCurve,
  mdiChartBellCurveCumulative,
} from '@mdi/js';
import {
  PowerInput as RegulatorIcon,
  DataObject as AdcIcon,
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
    title: "RC Filter Calculator",
    description: "Design and analyze RC low-pass and high-pass filters",
    icon: mdiChartSankey,
    path: '/electronic-tools/rc-filter',
    tags: ['filter', 'capacitor', 'resistor', 'frequency']
  },
  {
    title: "Reactance Calculator",
    description: "Calculate reactance for inductors and capacitors",
    icon: mdiChartBellCurve,
    path: '/electronic-tools/reactance',
    tags: ['inductor', 'capacitor', 'impedance', 'frequency']
  },
  {
    title: "Capacitor Calculator",
    description: "Analyze capacitor charging and discharging behavior",
    icon: mdiChartBellCurveCumulative,
    path: '/electronic-tools/capacitor-calculator',
    tags: ['capacitor', 'time constant', 'charging']
  },
  {
    title: "Voltage Regulator Calculator",
    description: "Calculate power dissipation and efficiency for linear regulators",
    iconComponent: RegulatorIcon,
    path: '/electronic-tools/voltage-regulator',
    tags: ['regulator', 'power', 'efficiency', 'heat']
  },
  {
    title: "ADC Calculator",
    description: "Design voltage dividers for ADC inputs and analyze measurement ranges",
    iconComponent: AdcIcon,
    path: '/signal-power-tools/adc-calculator',
    tags: ['adc', 'conversion', 'resolution', 'voltage']
  },
  {
    title: "PWM/DAC Calculator",
    description: "Calculate PWM parameters and analyze DAC configurations",
    iconComponent: AdcIcon,
    path: '/signal-power-tools/pwm-dac',
    tags: ['pwm', 'dac', 'conversion', 'resolution']
  }
];

function SignalPowerTools() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Signal & Power Tools
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Tools for signal processing, power management, and data conversion
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

export default SignalPowerTools;
