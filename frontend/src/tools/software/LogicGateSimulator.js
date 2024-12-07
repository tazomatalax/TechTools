import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AboutToolSection from '../../components/AboutToolSection';

const LogicGateSimulator = () => {
  const [gateType, setGateType] = useState('AND');
  const [input1, setInput1] = useState(false);
  const [input2, setInput2] = useState(false);

  const calculateOutput = () => {
    switch (gateType) {
      case 'AND':
        return input1 && input2;
      case 'OR':
        return input1 || input2;
      case 'XOR':
        return input1 !== input2;
      case 'NAND':
        return !(input1 && input2);
      case 'NOR':
        return !(input1 || input2);
      case 'XNOR':
        return input1 === input2;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Logic Gate Simulator
        </Typography>
        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Gate Type</InputLabel>
                <Select
                  value={gateType}
                  label="Gate Type"
                  onChange={(e) => setGateType(e.target.value)}
                >
                  <MenuItem value="AND">AND</MenuItem>
                  <MenuItem value="OR">OR</MenuItem>
                  <MenuItem value="XOR">XOR</MenuItem>
                  <MenuItem value="NAND">NAND</MenuItem>
                  <MenuItem value="NOR">NOR</MenuItem>
                  <MenuItem value="XNOR">XNOR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={input1}
                      onChange={(e) => setInput1(e.target.checked)}
                    />
                  }
                  label="Input 1"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={input2}
                      onChange={(e) => setInput2(e.target.checked)}
                    />
                  }
                  label="Input 2"
                />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Output: {calculateOutput() ? '1' : '0'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <AboutToolSection
          title="Logic Gate Simulator"
          description="The Logic Gate Simulator is an interactive tool for experimenting with digital logic gates 
            and boolean algebra. It provides a hands-on way to understand the behavior of various logic gates 
            and their combinations, essential for digital circuit design and computer architecture studies."
          features={[
            {
              title: 'Supported Gates',
              items: [
                'AND Gate',
                'OR Gate',
                'XOR Gate',
                'NAND Gate',
                'NOR Gate',
                'XNOR Gate'
              ]
            },
            {
              title: 'Interactive Controls',
              items: [
                'Toggle switches for inputs',
                'Real-time output calculation',
                'Visual state representation'
              ]
            },
            {
              title: 'Educational Features',
              description: 'Truth table visualization and gate behavior explanation'
            }
          ]}
          useCases={[
            'Digital Electronics Education: Learn basic logic gate operations',
            'Circuit Design: Test logic combinations before implementation',
            'Boolean Algebra: Verify logical expressions and truth tables',
            'Computer Architecture: Understand fundamental building blocks of digital systems'
          ]}
        />
      </Box>
    </Container>
  );
};

export default LogicGateSimulator;
