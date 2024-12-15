import React from 'react';

// Format values with appropriate unit prefixes
const formatResistance = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return `${value}`;
};

const formatCapacitance = (value) => {
  // Convert from Farads to nF for display
  const nanoFarads = value * 1e9;
  
  if (nanoFarads >= 1000) {
    return `${(nanoFarads / 1000).toFixed(1)}µF`;
  }
  return `${nanoFarads.toFixed(1)}nF`;
};

const formatFrequency = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}MHz`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}kHz`;
  }
  return `${value}Hz`;
};

const FirstOrderFilter = ({ pwmFreq, r1, c1 }) => (
  <svg
    width="65.182243mm"
    height="50mm"
    viewBox="0 0 65.182243 47.652656"
    version="1.1"
    style={{ color: 'currentColor' }}
  >
    <g id="layer1" transform="translate(-69.171965,-130.78132)">
      {/* Resistor */}
      <path
        id="path5036"
        d="m 88.513888,138.21769 h 3.704167"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <path
        id="path5038"
        d="m 101.47847,138.21769 h 3.70417"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <rect
        y="136.36562"
        x="92.218056"
        height="3.7041619"
        width="9.2604151"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />

      {/* Connecting Lines */}
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        d="m 77.043321,147.11281 -2e-6,-8.89513 h 11.470568"
      />

      {/* Dynamic Text Labels */}
      <text
        x="96.8"
        y="135"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none',
          textAnchor: 'middle'
        }}
      >
        {formatResistance(r1)}Ω
      </text>

      <text
        x="113"
        y="166"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatCapacitance(c1)}
      </text>

      <text
        x="120"
        y="135"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        Vout
      </text>

      {/* Main Circuit Paths */}
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        d="m 77.043321,169.33781 v 8.69917 h 34.268909 v -15.03052"
      />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        d="m 105.18264,138.21769 h 14.69243"
      />

      {/* Output Point */}
      <circle
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        cx="121.47219"
        cy="138.2177"
        r="1.5971235"
      />

      {/* Connection Point */}
      <circle
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.217151', strokeLinejoin: 'round' }}
        cx="111.31223"
        cy="138.21768"
        r="0.81867296"
      />

      {/* Capacitor */}
      <path
        d="m 111.31223,153.74604 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
      />
      <path
        d="m 111.31223,159.30229 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
      />
      <path
        d="m 115.01639,157.45021 h -7.40833"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
      />
      <path
        d="m 115.01639,159.30229 h -7.40833"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
      />
      <path
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        d="M 111.31223,153.74604 V 138.21769"
      />

      {/* PWM Source */}
      <circle
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        cx="77.04332"
        cy="158.22531"
        r="7.4083333"
      />
      <path
        d="m 77.043321,165.63364 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
      />
      <path
        d="m 77.043321,150.81697 v -3.70416"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
      />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinejoin: 'round' }}
        d="m 71.871331,161.00962 h 1.394673 v -5.56386 h 3.509177 v 5.56386 h 1.799577 v -5.56386 h 3.374209"
      />

      {/* PWM Source Labels */}
      <text
        x="78"
        y="172"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatFrequency(pwmFreq)}
      </text>
    </g>
  </svg>
);

const SecondOrderFilter = ({ pwmFreq, r1, r2, c1, c2 }) => (
  <svg
    width="94.289215mm"
    height="50mm"
    viewBox="0 0 94.289215 47.65266"
    version="1.1"
    style={{ color: 'currentColor' }}
  >
    <g
      id="layer1"
      transform="translate(-69.171965,-130.78132)">
      <path
        id="path5036"
        d="m 88.513888,138.21769 h 3.704167"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <path
        id="path5038"
        d="m 101.47847,138.21769 h 3.70417"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <rect
        y="136.36562"
        x="92.218056"
        height="3.7041619"
        width="9.2604151"
        id="rect5044"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.79375', strokeLinecap: 'butt', strokeLinejoin: 'round', strokeDasharray: 'none' }}
        d="m 77.043321,147.11281 -2e-6,-8.89513 h 11.470568"
        id="path2" />
      <text
        x="78"
        y="175"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatFrequency(pwmFreq)}
      </text>
      <text
        x="96.8"
        y="135"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none',
          textAnchor: 'middle'
        }}
      >
        {formatResistance(r1)}Ω
      </text>
      <text
        x="113"
        y="166"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatCapacitance(c1)}
      </text>
      <text
        x="126.2"
        y="135"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none',
          textAnchor: 'middle'
        }}
      >
        {formatResistance(r2)}Ω
      </text>
      <text
        x="143"
        y="166"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatCapacitance(c2)}
      </text>
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 77.043321,169.33781 v 8.69917 h 34.268909 v -15.03052"
        id="path5" />
      <circle
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.217151', strokeLinejoin: 'round' }}
        cx="111.31223"
        cy="138.21768"
        r="0.81867296" />
      <path
        id="path2791"
        d="m 111.31223,153.74604 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2793"
        d="m 111.31223,159.30229 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2795"
        d="m 115.01639,157.45021 h -7.40833"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2797"
        d="m 115.01639,159.30229 h -7.40833"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="M 111.31223,153.74604 V 138.21769"
        id="path10" />
      <path
        id="path5036-5"
        d="m 117.62086,138.21769 h 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path5038-1"
        d="m 130.58545,138.21769 h 3.70416"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <rect
        y="136.36562"
        x="121.32503"
        height="3.7041619"
        width="9.2604151"
        id="rect5044-7"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <circle
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.217151', strokeLinejoin: 'round' }}
        cx="140.4192"
        cy="138.21768"
        r="0.81867296" />
      <path
        id="path2791-5"
        d="m 140.41919,153.74604 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2793-2"
        d="m 140.41919,159.30229 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2795-7"
        d="m 144.12336,157.45021 h -7.40834"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2797-6"
        d="m 144.12336,159.30229 h -7.40834"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="M 140.4192,153.74605 V 138.2177"
        id="path10-1" />
      <circle
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '4', strokeDasharray: 'none' }}
        id="circle1800"
        cx="77.04332"
        cy="158.22531"
        r="7.4083333" />
      <path
        id="path1820"
        d="m 77.043321,165.63364 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path1822"
        d="m 77.043321,150.81697 v -3.70416"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }}
        d="M 80.996782,148.50187 H 78.218657"
        id="path1836" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }}
        d="m 79.607719,149.89093 v -2.77812"
        id="path1838" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }}
        d="M 80.87252,167.66939 H 78.094395"
        id="path1852" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 71.871331,161.00962 h 1.394673 v -5.56386 h 3.509177 v 5.56386 h 1.799577 v -5.56386 h 3.374209"
        id="path4" />
      <text
        transform="matrix(0.26458333,0,0,0.26458333,60.211996,-18.4935)"
        style={{
          fontFamily: 'Arial',
          fontSize: '18.6667px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        <tspan
          x="353"
          y="598.34732">Vout</tspan>
      </text>
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 134.28961,138.21769 h 14.69243"
        id="path6" />
      <circle
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        cx="150.57916"
        cy="138.2177"
        r="1.5971235" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 105.18264,138.21769 h 12.43822"
        id="path7" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 140.41919,163.00646 v 15.03052 h -29.10696"
        id="path12" />
    </g>
  </svg>
);

const BufferedFilter = ({ pwmFreq, r1, r2, c1, c2 }) => (
  <svg
    width="137.6577mm"
    height="50mm"
    viewBox="0 0 137.6577 48.182914"
    version="1.1"
    style={{ color: 'currentColor' }}
  >
    <defs
      id="defs1">
      <rect
        x="353.00061"
        y="581.53284"
        width="125.82874"
        height="39.449009"
        id="rect6-1" />
      <rect
        x="353.00061"
        y="581.53284"
        width="125.82874"
        height="39.449009"
        id="rect6-1-8" />
      <rect
        x="353.00061"
        y="581.53284"
        width="125.82874"
        height="39.449009"
        id="rect6-6-4" />
      <rect
        x="353.00061"
        y="581.53284"
        width="125.82874"
        height="39.449009"
        id="rect6-1-3" />
      <rect
        x="353.00061"
        y="581.53284"
        width="125.82874"
        height="39.449009"
        id="rect6-1-8-2" />
      <rect
        x="353.00061"
        y="581.53284"
        width="125.82874"
        height="39.449009"
        id="rect6-61" />
    </defs>
    <g
      id="layer1"
      transform="translate(-69.171965,-130.78132)">
      <path
        id="path5036"
        d="m 88.513888,138.21769 h 3.704167"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <path
        id="path5038"
        d="m 101.47847,138.21769 h 3.70417"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <rect
        y="136.36562"
        x="92.218056"
        height="3.7041619"
        width="9.2604151"
        id="rect5044"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.79375', strokeLinecap: 'butt', strokeLinejoin: 'round', strokeDasharray: 'none' }}
        d="m 77.043321,147.11281 -2e-6,-8.89513 h 11.470568"
        id="path2" />
      <text
        x="78"
        y="175"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatFrequency(pwmFreq)}
      </text>
      <text
        x="96.8"
        y="135"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none',
          textAnchor: 'middle'
        }}
      >
        {formatResistance(r1)}Ω
      </text>
      <text
        x="113"
        y="166"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatCapacitance(c1)}
      </text>
      <text
        x="126.2"
        y="135"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none',
          textAnchor: 'middle'
        }}
      >
        {formatResistance(r2)}Ω
      </text>
      <text
        x="143"
        y="166"
        style={{
          fontFamily: 'Arial',
          fontSize: '5px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        {formatCapacitance(c2)}
      </text>
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 77.043321,169.33781 v 8.69917 h 34.268909 v -15.03052"
        id="path5" />
      <circle
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.217151', strokeLinejoin: 'round' }}
        cx="111.31223"
        cy="138.21768"
        r="0.81867296" />
      <path
        id="path2791"
        d="m 111.31223,153.74604 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2793"
        d="m 111.31223,159.30229 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2795"
        d="m 115.01639,157.45021 h -7.40833"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2797"
        d="m 115.01639,159.30229 h -7.40833"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="M 111.31223,153.74604 V 138.21769"
        id="path10" />
      <path
        id="path5036-5"
        d="m 117.62086,138.21769 h 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path5038-1"
        d="m 130.58545,138.21769 h 3.70416"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <rect
        y="136.36562"
        x="121.32503"
        height="3.7041619"
        width="9.2604151"
        id="rect5044-7"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 0.926042,
          strokeLinecap: "square",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none"
        }}
      />
      <circle
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.217151', strokeLinejoin: 'round' }}
        cx="140.4192"
        cy="138.21768"
        r="0.81867296" />
      <path
        id="path2791-5"
        d="m 140.41919,153.74604 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2793-2"
        d="m 140.41919,159.30229 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2795-7"
        d="m 144.12336,157.45021 h -7.40834"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path2797-6"
        d="m 144.12336,159.30229 h -7.40834"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="M 140.4192,153.74605 V 138.2177"
        id="path10-1" />
      <circle
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '4', strokeDasharray: 'none' }}
        id="circle1800"
        cx="77.04332"
        cy="158.22531"
        r="7.4083333" />
      <path
        id="path1820"
        d="m 77.043321,165.63364 v 3.70417"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path1822"
        d="m 77.043321,150.81697 v -3.70416"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <g
        id="g4"
        transform="translate(2.5643982,-5.0932299)">
        <path
          id="path1836"
          d="M 78.432384,153.5951 H 75.654259"
          style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }} />
        <path
          id="path1838"
          d="m 77.043321,154.98416 v -2.77812"
          style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }} />
      </g>
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }}
        d="M 80.87252,167.66939 H 78.094395"
        id="path1852" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 71.871331,161.00962 h 1.394673 v -5.56386 h 3.509177 v 5.56386 h 1.799577 v -5.56386 h 3.374209"
        id="path4" />
      <text
        transform="matrix(0.26458333,0,0,0.26458333,103.58048,-14.789334)"
        id="text6-4"
        style={{
          fontFamily: 'Arial',
          fontSize: '18.6667px',
          fill: 'currentColor',
          stroke: 'none'
        }}
      >
        <tspan
          x="353"
          y="598.34732"
          id="tspan6">Vout</tspan>
      </text>
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 177.6581,141.92185 h 14.69243"
        id="path6" />
      <circle
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        id="path8"
        cx="193.94765"
        cy="141.92186"
        r="1.5971235" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 105.18264,138.21769 h 12.43822"
        id="path7" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 140.41919,163.00646 v 15.03052 h -29.10696"
        id="path12" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }}
        d="m 165.15653,138.21769 h -2.77812"
        id="path2757" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }}
        d="m 163.76747,139.60675 v -2.77813"
        id="path2759" />
      <path
        id="path2771"
        d="m 165.15653,145.62602 h -2.77812"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.529167px', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: '1' }} />
      <path
        id="path5820"
        d="m 159.13726,138.21769 h 1.85209"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path5822"
        d="m 159.13726,145.62602 h 1.85209"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path5824"
        d="m 160.98935,134.51352 v 14.81667 l 14.81666,-7.40834 z"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        id="path5826"
        d="m 175.80601,141.92185 h 1.85209"
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.926042', strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: '4', strokeDasharray: 'none' }} />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 134.28961,138.21769 h 24.84765"
        id="path13" />
      <path
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '0.793999', strokeLinejoin: 'round' }}
        d="m 159.13726,145.62602 h -5.47172 v 7.93293 h 28.75835 v -11.6371"
        id="path14" />
      <circle
        style={{ fill: 'currentColor', stroke: 'currentColor', strokeWidth: '0.217151', strokeLinejoin: 'round' }}
        cx="111.24356"
        cy="178.03699"
        r="0.81867296" />
    </g>
  </svg>
);

const PwmDacSchematic = ({ filterType, pwmFreq, r1, r2, c1, c2 }) => {
  const getFilter = () => {
    switch (filterType) {
      case 'first':
        return <FirstOrderFilter pwmFreq={pwmFreq} r1={r1} c1={c1} />;
      case 'second':
        return <SecondOrderFilter pwmFreq={pwmFreq} r1={r1} r2={r2} c1={c1} c2={c2} />;
      case 'buffered':
        return <BufferedFilter pwmFreq={pwmFreq} r1={r1} r2={r2} c1={c1} c2={c2} />;
      default:
        return <FirstOrderFilter pwmFreq={pwmFreq} r1={r1} c1={c1} />;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {getFilter()}
    </div>
  );
};

export default PwmDacSchematic;
