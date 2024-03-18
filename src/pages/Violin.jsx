import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import VerticalViolinShape from './VerticalViolinShape';
import getDataViolin from '../loaders/jsonLoader2';
import { Hidden } from '@mui/material';
const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
function summarizeDistribution(values) {
  const sorted = values.sort((a, b) => a - b);

  const dist = {
    min: sorted[0],
    lowerQuartile: d3.quantile(sorted, 0.25),
    median: d3.quantile(sorted, 0.5),
    upperQuartile: d3.quantile(sorted, 0.75),
    max: sorted[sorted.length - 1],
    mean: d3.mean(sorted),
  };

  return dist;
}
const Violin = ({ width, height }) => {
  const data = getDataViolin();
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const { min, max, groups } = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.values));
    const groups = data.map((d) => d.name).filter((x, i, a) => a.indexOf(x) == i);
    return { min, max, groups };
  }, [data]);

  const yScale = d3.scaleLinear().domain([min, max]).range([boundsHeight, 0]).nice();

  const xScale = d3.scaleBand().range([0, boundsWidth]).domain(groups).padding(0.25);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const handleMouseOver = (event, data, group) => {
    const distribution = summarizeDistribution(data);
    const tooltipDiv = d3.select('#violin-tooltip');
    tooltipDiv.transition().duration(200).style('visibility', 'visible');
    tooltipDiv
      .html(
        `
    <text x="${event.pageX}" y="${event.pageY} fill="white">
      <tspan>Upper Quartile: ${distribution.upperQuartile}</tspan>
      <br></br>
      <tspan x="${event.pageX}" dy="1.2em">
        Lower Quartile: ${distribution.lowerQuartile}  
      </tspan>
      <br></br>
      <tspan x="${event.pageX}" dy="1.2em">
        Median: ${distribution.median}
      </tspan>
    </text>
  `,
      ) // Replace with the content you want to show
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 28 + 'px');
  };

  const handleMouseOut = () => {
    d3.select('#violin-tooltip').style('visibility', 'hidden');
  };

  const allShapes = groups.map((group, i) => {
    const groupData = data.filter((d) => d.name === group).map((d) => d.values);
    return (
      <g
        key={i}
        transform={`translate(${xScale(group)},0)`}
        onMouseEnter={(event) => handleMouseOver(event, groupData, group)}
        onMouseOut={handleMouseOut}
      >
        <VerticalViolinShape data={groupData} yScale={yScale} width={xScale.bandwidth()} binNumber={20} />
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height} style={{ display: 'inline-block' }}>
        <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
          {allShapes}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
        <text
          x={-MARGIN.left + 80}
          y={height - 160}
          transform={`rotate(-90, ${MARGIN.left}, ${height / 2})`}
          textAnchor="middle"
        >
          Angstroms (Å)
        </text>
      </svg>
      <div
        id="violin-tooltip"
        style={{
          position: 'absolute',
          visibility: Hidden,
          backgroundColor: 'rgba(97, 97, 97, 0.9)',
          color: 'white',
          padding: '2px',
          borderRadius: '4px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          zIndex: 100,
          fontSize: '0.875rem',
          lineHeight: '1em',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          maxWidth: 'auto',
          textAlign: 'left',
        }}
      ></div>
    </div>
  );
};

export default Violin;
