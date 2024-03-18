import * as d3 from "d3";

const VerticalViolinShape = ({
  data,
  yScale,
  width,
  binNumber,
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);

  const binBuilder = d3
    .bin()
    .domain([min, max])
    .thresholds(yScale.ticks(binNumber/2))
    .value((d) => d);
  const bins = binBuilder(data);

  const biggestBin = Math.max(...bins.map((b) => b.length));

  const wScale = d3
    .scaleLinear()
    .domain([-biggestBin, biggestBin])
    .range([0, width]);

  const areaBuilder = d3
    .area()
    .x0((d) => wScale(-d.length))
    .x1((d) => wScale(d.length))
    .y((d) => yScale(d.x0 || 0))
    .curve(d3.curveBumpY);

  const areaPath = areaBuilder(bins);

  return (
    <path
      d={areaPath || undefined}
      opacity={1}
      stroke="black"
      fill="#f03b20"
      fillOpacity={0.6}
      strokeWidth={1}
    />
  );
};

export default VerticalViolinShape;
