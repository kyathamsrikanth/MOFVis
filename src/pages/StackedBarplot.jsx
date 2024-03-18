import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { extent } from 'd3-array';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
function createData(name, carbon, hydrogen, oxygen, nitrogen, isothermsData) {
  return {
    lcd: isothermsData[name].lcd,
    name,
    carbon,
    hydrogen,
    oxygen,
    nitrogen,
  };
}
const StackedBarplot = ({ width, height, structuresData, isothermsData }) => {
  const axesRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: {} });

  const data = Object.keys(structuresData)
    .map((key) => {
      const { C, H, O, N } = structuresData[key];

      // Perform null checks for C, H, and O
      const carbonCount = C ? C.count : 0;
      const hydrogenCount = H ? H.count : 0;
      const oxygenCount = O ? O.count : 0;
      const nitrogenCount = N ? N.count : 0;

      if (!(carbonCount == 0 && hydrogenCount == 0 && oxygenCount == 0 && nitrogenCount == 0)) {
        return createData(key, carbonCount, hydrogenCount, oxygenCount, nitrogenCount, isothermsData);
      } else {
        return null;
      }
    })
    .filter((entry) => entry !== null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allGroups = Array.from(new Set(data.map((d) => d.lcd))).sort(d3.ascending);
  const allSubgroups = ['carbon', 'hydrogen', 'oxygen', 'nitrogen'];

  const stackSeries = d3.stack().keys(allSubgroups).order(d3.stackOrderNone);
  const series = stackSeries(data);

  const max = 1200;
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

  const xScale1 = useMemo(() => {
    return d3.scaleBand().domain(allGroups).range([0, boundsWidth]).padding(0.2);
  }, [boundsWidth, allGroups]);

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.lcd))
      .range([0, boundsWidth]);
  }, [data, boundsWidth]);

  const yAxisLabel = 'Number of Structures';

  const handleMouseOver = (event, d) => {
    const content = Object.entries(d.data)
      .filter(([key, value]) => value > 0 && key !== 'name')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { name: d.data.name });

    setTooltip({ visible: true, content, x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    setTooltip((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
  };

  const handleMouseOut = () => {
    setTooltip({ visible: false, content: {} });
  };

  const colorScale = d3
    .scaleOrdinal()
    .domain(['carbon', 'hydrogen', 'oxygen', 'nitrogen'])
    .range(['#4b4c4d', '#cbcfca', '#f70505', '#0558e8']);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator)
      .selectAll('text')
      .attr('transform', 'rotate(-45)') // Rotate the x-axis labels
      .style('text-anchor', 'end');

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const rectangles = series.map((subgroup, i) => {
    return (
      <g key={i}>
        {subgroup.map((group, j) => {
          const barHeight = yScale(group[0]) - yScale(group[1]);
          return (
            <rect
              key={j}
              x={xScale(group.data.lcd)}
              y={yScale(group[1])}
              onMouseOver={(event) => handleMouseOver(event, group)}
              onMouseMove={handleMouseMove}
              onMouseOut={handleMouseOut}
              height={yScale(group[0]) - yScale(group[1])}
              width={25}
              fill={colorScale(subgroup.key)}
              opacity={0.9}
            ></rect>
          );
        })}
      </g>
    );
  });

  const Legend = () => {
    const legendPosY = height - MARGIN.bottom - 235; // Adjust this if necessary
    const legendSpacing = 100; // Adjust the spacing between legend items as needed

    return (
      <g transform={`translate(${MARGIN.left}, ${legendPosY})`}>
        {allSubgroups.map((subgroup, i) => (
          <g key={subgroup} transform={`translate(${i * legendSpacing}, 0)`}>
            <rect y={10} width={10} height={10} fill={colorScale(subgroup)} />
            <text x={15} y={10} alignmentBaseline="hanging" textAnchor="start">
              {subgroup}
            </text>
          </g>
        ))}
      </g>
    );
  };

  return (
    <div>
      <svg width={width} height={height}>
        <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
          {rectangles}
          <text
            transform={`translate(${-MARGIN.left + 20}, ${boundsHeight / 2}) rotate(-90)`} // Rotate and position along y-axis
            textAnchor="middle"
            alignmentBaseline="baseline" // Adjust the alignment if necessary
          >
            {yAxisLabel}
          </text>
          <text
            transform={`translate(${MARGIN.left + 200}, ${MARGIN.top + 200})`} // Rotate and position along y-axis
            textAnchor="middle"
            alignmentBaseline="baseline" // Adjust the alignment if necessary
          >
            LCD
          </text>
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
        {Legend()}
      </svg>
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
            backgroundColor: 'rgba(97, 97, 97, 0.9)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            zIndex: 100,
            fontSize: '0.875rem',
            lineHeight: '1.4em',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            maxWidth: '220px',
            wordWrap: 'break-word',
            textAlign: 'left',
          }}
        >
          <div>
            <strong>{tooltip.content.name}</strong>
            {Object.entries(tooltip.content)
              .filter(([key]) => key !== 'name')
              .map(([key, value]) => (
                <div key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StackedBarplot;
