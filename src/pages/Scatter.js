import React, { useState } from 'react';
import { animated } from 'react-spring';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { extent } from 'd3-array';
import AxisLeft from './AxisLeft';
import AxisBottom from './AxisBottom';
import getData from '../loaders/jsonLoader';
import { debounce } from 'lodash';
import { interpolateReds } from 'd3';
import { scaleQuantize } from 'd3-scale';
import * as d3 from 'd3';

const StyledTooltip = React.memo(({ x, y, dataPoint, svgWidth, svgHeight }) => {
  // Calculate the tooltip position and dimensions
  const tooltipWidth = 150; // Adjust as needed
  const tooltipHeight = 80; // Adjust based on the amount of text
  let tooltipX = x - tooltipWidth / 2;
  let tooltipY = y - tooltipHeight - 10; // Offset above the cursor/data point
  if (tooltipX < 0) tooltipX = 10; // 10px padding from left edge
  if (tooltipX + tooltipWidth > svgWidth) tooltipX = svgWidth - tooltipWidth - 10; // Adjust from right edge
  if (tooltipY < 0) tooltipY = y + 20;

  return (
    <g  id="violin-tooltip">
      <rect
        x={tooltipX}
        y={tooltipY}
        rx={4}
        ry={4}
        width={tooltipWidth}
        height={tooltipHeight}
        fill="rgba(97, 97, 97, 0.9)"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth={1}
      />
      <text
        x={tooltipX + tooltipWidth / 2}
        y={tooltipY + 20}
        textAnchor="middle"
        fill="#fff"
        fontSize="0.875rem"
        fontFamily="Roboto, Helvetica, Arial, sans-serif"
      >
        {dataPoint.name}
        <tspan x={tooltipX + tooltipWidth / 2} dy="1.2em">
          Void Fraction: {dataPoint.void_fraction}
        </tspan>
        <tspan x={tooltipX + tooltipWidth / 2} dy="1.2em">
          Surface Area: {dataPoint.surface_area_m2cm3}
        </tspan>
        <tspan x={tooltipX + tooltipWidth / 2} dy="1.2em">
          PLD: {dataPoint.pld}
        </tspan>
      </text>
    </g>
  );
});

function Scatter({ w, h }) {
  const [data, setData] = useState(getData());
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const colors = [
    '#f7fcb9',
    '#d9f0a3',
    '#addd8e',
    '#78c679',
    '#41ab5d',
    '#238443',
    '#006837',
    '#004529', // Corresponds to 1
  ];
  const margin = {
    top: 10,
    bottom: 20,
    left: 40,
    right: 40,
  };

  const width = w - margin.right - margin.left;
  const height = h - margin.top - margin.bottom;
  const pldExtent = extent(data, (d) => d.pld);
  const xScale = scaleLinear()
    .domain(extent(data, (d) => d.void_fraction))
    .range([0, width]);

  const yScale = scaleLinear()
    .domain(extent(data, (d) => d.surface_area_m2cm3))
    .range([height, 0]);

  const rScale = scaleLinear()
    .domain(extent(data, (d) => d.pld))
    .range([5, 10]);
  const legendColorScale = scaleSequential(interpolateReds).domain(pldExtent);
  const colorScale = scaleSequential(interpolateReds).domain(pldExtent);

  const ColorLegend = () => {
    const legendWidth = 8;
    const legendHeight = h;

    return (
      <g transform={`translate(${width + margin.left + 12},${margin.top})`}>
        <defs>
          <linearGradient id="legendGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            {legendColorScale.ticks(5).map((tick, i) => (
              <stop key={i} offset={`${(i / 9) * 100}%`} stopColor={colorScale(tick)} />
            ))}
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={legendWidth} height={legendHeight - 50} fill="url(#legendGradient)" />
        <text x={legendWidth} y={legendHeight - 30} textAnchor="middle">
          PLD
        </text>
      </g>
    );
  };
  const handleMouseOut = () => {
    d3.select('#violin-tooltip').style('visibility', 'hidden');
  };
  const circles = data.map((d, i) => (
    <animated.circle
      key={i}
      r={rScale(d.pld)}
      cx={xScale(d.void_fraction)}
      cy={yScale(d.surface_area_m2cm3)}
      style={{ fill: colorScale(d.pld) }}
      onMouseEnter={() => {
        setHovered(d);
        setTooltipPos({
          x: xScale(d.void_fraction),
          y: yScale(d.surface_area_m2cm3),
        });
        //const debouncedSetHovered = debounce(setHovered, 100);
        //debouncedSetHovered(d);
      }}
      onMouseLeave={() => {
        setHovered(null);
      }}
    />
  ));

  return (
    <div className="textAlign">
      <svg width={w} height={h}>
        <g
          transform={`translate(${margin.left + 10},${margin.top - 30})translate(0, ${margin.bottom + 10})translate(${
            margin.right - 50
          }, 0)`}
        >
          <AxisLeft yScale={yScale} width={width} />
          <AxisBottom xScale={xScale} height={height} />
          {circles}
        </g>

        <text
          x={-margin.left + 50}
          y={height - 150}
          transform={`rotate(-90, ${margin.left}, ${height / 2})`}
          textAnchor="middle"
        >
          Surface Area
        </text>

        {ColorLegend()}

        {hovered && <StyledTooltip onMouseOut={handleMouseOut} x={tooltipPos.x} y={tooltipPos.y} dataPoint={hovered} svgWidth={w} svgHeight={h} />}
      </svg>

      <div style={{ textAlign: 'center' }}>
        <text x={w / 2 - margin.right} y={h + margin.top + 50} textAnchor="middle">
          Void Fraction
        </text>
      </div>
    </div>
  );
}

export default Scatter;
