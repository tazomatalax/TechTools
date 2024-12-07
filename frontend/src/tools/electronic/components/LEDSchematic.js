import React from 'react';

const LEDSchematic = ({ sourceVoltage, ledVoltage, current, resistorValue, ledColor }) => {
  return (
    <svg
      width="75.652931mm"
      height="50.0023mm"
      viewBox="0 0 75.652931 50.0023"
      version="1.1"
    >
      <g
        id="layer1"
        transform="translate(-69.171965,-128.03468)"
        style={{ stroke: '#ffffff' }}
      >
        <g
          id="g1975"
          transform="matrix(0.26458333,0,0,0.26458333,-230.34845,48.417148)"
        >
          <g
            style={{ fill: 'none' }}
            id="g1845"
            transform="translate(504,77)"
          >
            <path
              style={{ display: 'inline', fill: 'none', stroke: '#ffffff', strokeWidth: '3.5', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none', strokeOpacity: '1' }}
              d="m 805,262.41665 h 21"
            />
            <path
              style={{ display: 'inline', fill: 'none', stroke: '#ffffff', strokeWidth: '3.5', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none', strokeOpacity: '1' }}
              d="M 854.00002,262.41665 H 868"
            />
            <path
              style={{ display: 'inline', fill: ledColor, stroke: '#ffffff', strokeWidth: '3.5', strokeLinecap: 'square', strokeMiterlimit: '4', strokeDasharray: 'none', strokeDashoffset: '0', strokeOpacity: '1' }}
              d="m 854,262.41665 -28,14 v -28 z"
            />
            <path
              style={{ display: 'inline', fill: 'none', stroke: '#ffffff', strokeWidth: '3.5', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none', strokeOpacity: '1' }}
              d="m 854,248.41665 v 28"
            />
          </g>
        </g>
        <g
          id="g1087"
          transform="matrix(0.26458333,0,0,0.26458333,86.661805,-83.084217)"
          style={{ stroke: '#ffffff' }}
        >
          <path d="M 7,836.41665 H 21" style={{ fill: 'none', strokeWidth: '3.5', strokeLinecap: 'round' }} />
          <path d="m 55.999996,836.41665 h 14" style={{ fill: 'none', strokeWidth: '3.5', strokeLinecap: 'round' }} />
          <rect
            y="829.41669"
            x="21.000002"
            height="13.999982"
            width="34.999996"
            style={{ fill: 'none', strokeWidth: '3.5', strokeLinecap: 'square', strokeLinejoin: 'round' }}
          />
        </g>
        <circle
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'round' }}
          cx="77.04332"
          cy="158.22531"
          r="7.4083333"
        />
        <path
          d="m 77.043321,165.63364 v 3.70417"
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.926042', strokeLinecap: 'round' }}
        />
        <path
          d="m 77.043321,150.81697 v -3.70416"
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.926042', strokeLinecap: 'round' }}
        />
        <path
          d="M 78.432384,153.5951 H 75.654259"
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.529167', strokeLinecap: 'butt' }}
        />
        <path
          d="m 77.043321,154.98416 v -2.77812"
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.529167', strokeLinecap: 'butt' }}
        />
        <path
          d="M 78.432384,162.85552 H 75.654259"
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.529167', strokeLinecap: 'butt' }}
        />
        <path
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.79375', strokeLinecap: 'butt', strokeLinejoin: 'round' }}
          d="m 77.043321,147.11281 -2e-6,-8.89513 h 11.470568"
        />
        <path
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.79375', strokeLinecap: 'butt', strokeLinejoin: 'round' }}
          d="m 105.18264,138.21768 10.80849,0.003"
        />
        <path
          style={{ fill: 'none', stroke: '#ffffff', strokeWidth: '0.772618', strokeLinecap: 'butt', strokeLinejoin: 'round' }}
          d="m 77.032755,168.32325 v 9.32742 h 67.405835 v -39.44011 h -12.95434"
        />
        
        {/* Dynamic text elements */}
        <text 
          x="86" 
          y="160" 
          style={{ 
            fill: '#ffffff', 
            fontFamily: 'Arial', 
            fontSize: '5px',
            stroke: 'none'
          }}
        >
          {sourceVoltage}{!isNaN(sourceVoltage) && 'V'}
        </text>
        <text 
          x="98" 
          y="134" 
          style={{ 
            fill: '#ffffff', 
            fontFamily: 'Arial', 
            fontSize: '5px',
            stroke: 'none',
            textAnchor: 'middle'
          }}
        >
          {resistorValue}{!isNaN(resistorValue) && 'Ω'}
        </text>
        <text 
          x="120" 
          y="148" 
          style={{ 
            fill: '#ffffff', 
            fontFamily: 'Arial', 
            fontSize: '5px',
            stroke: 'none'
          }}
        >
          {ledVoltage}{!isNaN(ledVoltage) && 'V'}
        </text>
        <text 
          x="120" 
          y="153" 
          style={{ 
            fill: '#ffffff', 
            fontFamily: 'Arial', 
            fontSize: '5px',
            stroke: 'none'
          }}
        >
          {current}{!isNaN(current) && 'mA'}
        </text>
      </g>
    </svg>
  );
};

export default LEDSchematic;
