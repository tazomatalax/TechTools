import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const RCCircuitSchematic = ({ voltage, resistance, capacitance, outputVoltage, resistanceUnit, capacitanceUnit }) => {
  // Format values with units
  const formatResistance = () => {
    const unit = resistanceUnit === 'k' ? 'kΩ' : 'MΩ';
    return `${resistance || '?'}${unit}`;
  };

  const formatCapacitance = () => {
    const unit = capacitanceUnit === 'u' ? 'µF' : 'nF';
    return `${capacitance || '?'}${unit}`;
  };

  const formatVoltage = (v) => `${v || '?'}V`;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <svg
        width="300"
        height="180"
        viewBox="0 0 79.375 47.652656"
        version="1.1"
      >
        <g transform="translate(-69.171965,-130.78132)">
          <g transform="matrix(0.26458333,0,0,0.26458333,86.661805,-83.084217)">
            <path
              d="M 7,836.41665 H 21"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
            <path
              d="m 55.999996,836.41665 h 14"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
            <rect
              y="829.41669"
              x="21.000002"
              height="13.999982"
              width="34.999996"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
          </g>
          <circle
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.926042, strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            cx="77.04332"
            cy="158.22531"
            r="7.4083333"
          />
          <path
            d="m 77.043321,165.63364 v 3.70417"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.926042, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
          />
          <path
            d="m 77.043321,150.81697 v -3.70416"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.926042, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
          />
          <path
            d="M 78.432384,153.5951 H 75.654259"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.529167}}
          />
          <path
            d="m 77.043321,154.98416 v -2.77812"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.529167}}
          />
          <path
            d="M 78.432384,162.85552 H 75.654259"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.529167}}
          />
          <path
            d="m 77.043321,147.11281 -2e-6,-8.89513 h 11.470568"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.79375, strokeLinejoin: 'round'}}
          />
          {/* Supply Voltage Label */}
          <text
            x="86.521521"
            y="153.34732"
            style={{fontFamily: 'Arial', fontSize: '4.93889px', fill: 'currentColor'}}
          >
            {formatVoltage(voltage)}
          </text>
          {/* Resistance Label */}
          <text
            x="93.53606"
            y="134.36577"
            style={{fontFamily: 'Arial', fontSize: '4.93889px', fill: 'currentColor'}}
          >
            {formatResistance()}
          </text>
          {/* Capacitance Label */}
          <text
            x="116.36796"
            y="160.21326"
            style={{fontFamily: 'Arial', fontSize: '4.93889px', fill: 'currentColor'}}
          >
            {formatCapacitance()}
          </text>
          {/* Output Voltage Label */}
          <text
            x="125"
            y="139.85384"
            style={{
              fontFamily: 'Arial',
              fontSize: '4.93889px',
              fill: 'currentColor',
              dominantBaseline: 'middle'
            }}
          >
            {formatVoltage(outputVoltage)}
          </text>
          <path
            d="m 77.043321,169.33781 v 8.69917 h 34.268909 v -15.03052"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.793999, strokeLinejoin: 'round'}}
          />
          <path
            d="m 105.18264,138.21769 h 14.69243"
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.793999, strokeLinejoin: 'round'}}
          />
          <circle
            style={{fill: 'none', stroke: 'currentColor', strokeWidth: 0.793999, strokeLinejoin: 'round'}}
            cx="121.47219"
            cy="138.2177"
            r="1.5971235"
          />
          <circle
            style={{fill: 'currentColor', stroke: 'currentColor', strokeWidth: 0.217151, strokeLinejoin: 'round'}}
            cx="111.31223"
            cy="138.21768"
            r="0.81867296"
          />
          <g transform="matrix(0.26458333,0,0,0.26458333,26.116398,-84.224609)">
            <path
              d="m 322,899.41665 v 14"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
            <path
              d="m 322,920.41665 v 14"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
            <path
              d="m 335.99999,913.41665 h -28"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
            <path
              d="m 335.99999,920.41665 h -28"
              style={{fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none'}}
            />
          </g>
          <path
            d="M 111.31223,153.74604 V 138.21769"
            style={{fill: 'currentColor', stroke: 'currentColor', strokeWidth: 0.793999, strokeLinejoin: 'round'}}
          />
        </g>
      </svg>
    </Box>
  );
};

RCCircuitSchematic.propTypes = {
  voltage: PropTypes.string,
  resistance: PropTypes.string,
  capacitance: PropTypes.string,
  outputVoltage: PropTypes.string,
  resistanceUnit: PropTypes.string,
  capacitanceUnit: PropTypes.string,
};

export default RCCircuitSchematic;
