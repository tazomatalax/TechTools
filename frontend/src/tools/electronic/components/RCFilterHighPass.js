import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const RCFilterHighPass = ({ resistance, capacitance, resistanceUnit, capacitanceUnit }) => {
    // Format values with units
    const formatResistance = () => {
        const unit = resistanceUnit === 'k' ? 'kΩ' : 'MΩ';
        return `${resistance || '?'}${unit}`;
    };

    const formatCapacitance = () => {
        const unit = capacitanceUnit === 'u' ? 'µF' : 'nF';
        return `${capacitance || '?'}${unit}`;
    };
    return (
        <svg
            width="70mm"
            height="50mm"
            viewBox="0 0 69.613678 45.912734"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <path id="a" d="M353.00061 581.53284H478.82935V620.981849H353.00061z" />
                <path id="b" d="M353.00061 581.53284H478.82935V620.981849H353.00061z" />
                <path id="c" d="M353.00061 581.53284H478.82935V620.981849H353.00061z" />
                <path id="d" d="M353.00061 581.53284H478.82935V620.981849H353.00061z" />
                <clipPath clipPathUnits="userSpaceOnUse" id="e">
                    <path
                        fill="none"
                        stroke='currentColor'
                        strokeWidth={0.718}
                        strokeLinejoin="round"
                        strokeDasharray="none"
                        d="M73.403008 153.6703H78.9065428V158.4103384H73.403008z"
                    />
                </clipPath>
                <clipPath clipPathUnits="userSpaceOnUse" id="f">
                    <path
                        fill="none"
                        stroke='currentColor'
                        strokeWidth={0.718}
                        strokeLinejoin="round"
                        strokeDasharray="none"
                        d="M73.403008 153.6703H78.9065428V158.4103384H73.403008z"
                    />
                </clipPath>
            </defs>
            <g transform="translate(-69.172 -132.483)">
                <g
                    transform="matrix(0 .26458 -.26458 0 332.614 148.19)"
                    fill="none"
                    stroke='currentColor'
                    strokeWidth={3.5}
                    strokeMiterlimit={4}
                    strokeDasharray="none"
                    strokeOpacity={1}
                >
                    <path
                        d="M7 836.417h14M56 836.417h14"
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                    />
                    <path
                        style={{
                            marker: "none"
                        }}
                        color='currentColor'
                        display="inline"
                        overflow="visible"
                        visibility="visible"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        strokeDashoffset={0}
                        d="M21.000002 829.41669H55.999998000000005V843.4166720000001H21.000002z"
                    />
                </g>
                <circle
                    cx={77.04332}
                    cy={158.22531}
                    r={7.4083333}
                    fill="none"
                    fillOpacity={1}
                    fillRule="nonzero"
                    stroke='currentColor'
                    strokeWidth={0.926042}
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    strokeMiterlimit={4}
                    strokeDasharray="none"
                    strokeDashoffset={0}
                    strokeOpacity={1}
                />
                <path
                    d="M77.043 165.634v3.704M77.043 150.817v-3.704"
                    fill="none"
                    fillOpacity={1}
                    fillRule="nonzero"
                    stroke='currentColor'
                    strokeWidth={0.926042}
                    strokeLinecap="round"
                    strokeLinejoin="miter"
                    strokeMiterlimit={4}
                    strokeDasharray="none"
                    strokeDashoffset={0}
                    strokeOpacity={1}
                />
                <path
                    d="M77.044 147.114v-8.9h15.34"
                    fill="none"
                    stroke='currentColor'
                    strokeWidth={0.718}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    strokeDasharray="none"
                />
                <text
                    xmlSpace="preserve"
                    transform="matrix(.26458 0 0 .26458 20.23 1.468)"
                    style={{
                        InkscapeFontSpecification: "'Arial, Normal'",
                        fontVariantLigatures: "normal",
                        fontVariantCaps: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        textAlign: "start",
                        whiteSpace: "pre",
                        shapeInside: "url(#a)"
                    }}
                    fontStyle="normal"
                    fontVariant="normal"
                    fontWeight={400}
                    fontStretch="normal"
                    fontSize="18.6667px"
                    fontFamily="Arial"
                    writingMode="lr-tb"
                    direction="ltr"
                    display="inline"
                    fill='currentColor'
                    stroke="none"
                    strokeWidth={3}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    strokeDasharray="none"
                >
                    <tspan x={353} y={598.34732}>
                        {formatResistance()}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    transform="matrix(.26458 0 0 .26458 5.617 -22.234)"
                    style={{
                        InkscapeFontSpecification: "'Arial, Normal'",
                        fontVariantLigatures: "normal",
                        fontVariantCaps: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        textAlign: "start",
                        whiteSpace: "pre",
                        shapeInside: "url(#b)"
                    }}
                    fontStyle="normal"
                    fontVariant="normal"
                    fontWeight={400}
                    fontStretch="normal"
                    fontSize="18.6667px"
                    fontFamily="Arial"
                    writingMode="lr-tb"
                    direction="ltr"
                    display="inline"
                    fill='currentColor'
                    stroke="none"
                    strokeWidth={3}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    strokeDasharray="none"
                >
                    <tspan x={353} y={598.34732}>
                        {formatCapacitance()}
                    </tspan>
                </text>
                <path
                    d="M77.043 169.338v8.699h34.27v-15.03M101.112 138.218h18.763"
                    fill="none"
                    stroke='currentColor'
                    strokeWidth={0.718}
                    strokeLinejoin="round"
                    strokeDasharray="none"
                />
                <circle
                    cx={121.47219}
                    cy={138.2177}
                    r={1.5971235}
                    fill="none"
                    stroke='currentColor'
                    strokeWidth={0.793999}
                    strokeLinejoin="round"
                />
                <circle
                    cx={111.31223}
                    cy={138.21768}
                    r={0.81867296}
                    fill='currentColor'
                    stroke='currentColor'
                    strokeWidth={0.217151}
                    strokeLinejoin="round"
                />
                <g
                    fill="none"
                    stroke='currentColor'
                    strokeWidth={3.5}
                    strokeLinejoin="miter"
                    strokeMiterlimit={4}
                    strokeDasharray="none"
                    strokeOpacity={1}
                >
                    <path
                        d="M322 899.417v14M322 920.417v14"
                        strokeLinecap="round"
                        transform="matrix(0 .26458 -.26458 0 339.083 53.022)"
                    />
                    <path
                        d="M336 913.417h-28M336 920.417h-28"
                        strokeLinecap="square"
                        transform="matrix(0 .26458 -.26458 0 339.083 53.022)"
                    />
                </g>
                <path
                    d="M111.312 150.915v-12.697"
                    fill='currentColor'
                    stroke='currentColor'
                    strokeWidth={0.717981}
                    strokeLinejoin="round"
                />
                <text
                    xmlSpace="preserve"
                    transform="matrix(.26458 0 0 .26458 -7.986 1.604)"
                    style={{
                        InkscapeFontSpecification: "'Arial, Normal'",
                        fontVariantLigatures: "normal",
                        fontVariantCaps: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        textAlign: "start",
                        whiteSpace: "pre",
                        shapeInside: "url(#c)"
                    }}
                    fontStyle="normal"
                    fontVariant="normal"
                    fontWeight={400}
                    fontStretch="normal"
                    fontSize="18.6667px"
                    fontFamily="Arial"
                    writingMode="lr-tb"
                    direction="ltr"
                    display="inline"
                    fill='currentColor'
                    stroke="none"
                    strokeWidth={3}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    strokeDasharray="none"
                >
                    <tspan x={353} y={598.34732}>
                        {"Signal"}
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    transform="matrix(.26458 0 0 .26458 30.598 -18.244)"
                    style={{
                        InkscapeFontSpecification: "'Arial, Normal'",
                        fontVariantLigatures: "normal",
                        fontVariantCaps: "normal",
                        fontVariantNumeric: "normal",
                        fontVariantEastAsian: "normal",
                        textAlign: "start",
                        whiteSpace: "pre",
                        shapeInside: "url(#d)"
                    }}
                    fontStyle="normal"
                    fontVariant="normal"
                    fontWeight={400}
                    fontStretch="normal"
                    fontSize="18.6667px"
                    fontFamily="Arial"
                    writingMode="lr-tb"
                    direction="ltr"
                    display="inline"
                    fill='currentColor'
                    stroke="none"
                    strokeWidth={3}
                    strokeLinecap="butt"
                    strokeLinejoin="round"
                    strokeDasharray="none"
                >
                    <tspan x={353} y={598.34732}>
                        {"Output"}
                    </tspan>
                </text>
                <g
                    transform="matrix(.65528 0 0 .9184 26.883 13.448)"
                    fill="none"
                    stroke='currentColor'
                    strokeWidth={0.718}
                    strokeLinejoin="round"
                    strokeDasharray="none"
                >
                    <ellipse
                        cx={76.313835}
                        cy={158.71255}
                        rx={1.781491}
                        ry={3.8333869}
                        clipPath="url(#e)"
                        transform="translate(-1.541 -.74)"
                    />
                    <ellipse
                        cx={76.313835}
                        cy={158.71255}
                        rx={1.781491}
                        ry={3.8333869}
                        clipPath="url(#f)"
                        transform="rotate(180 77.318 158.01)"
                    />
                </g>
            </g>
        </svg>
    )
}

RCFilterHighPass.propTypes = {
    resistance: PropTypes.string,
    capacitance: PropTypes.string,
    resistanceUnit: PropTypes.string,
    capacitanceUnit: PropTypes.string,
  };
  
  export default RCFilterHighPass;