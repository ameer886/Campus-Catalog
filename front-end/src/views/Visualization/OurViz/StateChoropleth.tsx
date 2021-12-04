import React from 'react';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { legendColor } from 'd3-svg-legend';

import states from './states-albers-10m';

const StateChoropleth: React.FunctionComponent = () => {
  const d3Chart = useRef(null);

  useEffect(() => {
    const numCells = 8;
    const data = new Map();
    const color = d3.scaleQuantize(
      [1, numCells + 1],
      d3.schemeBlues[numCells],
    );

    data.set('Texas', 10);

    const linear = d3
      .scaleLinear()
      .domain([0, 10])
      .range([color(0), color(numCells)]);
    //.range(['rgb(46, 73, 123)', 'rgb(71, 187, 94)']);
    //.tickFormat(d3.format('d'));

    const svg = d3
      .select(d3Chart.current)
      .attr('viewBox', [0, 0, 975, 610]);

    svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(610,20)');

    const linearLegend = legendColor()
      .shapeWidth(30)
      .labelFormat(d3.format('d'))
      //.cells([1, 2, 3, 6, 8])
      .cells(numCells)
      .orient('horizontal')
      .scale(linear);

    svg.select('.legend').call(linearLegend);

    svg
      .append('g')
      .selectAll('path')
      .data(topojson.feature(states, states.objects.states).features)
      .join('path')
      .attr('fill', (d) => linear(data.get(d.properties.name)))
      .attr('d', d3.geoPath())
      .append('title');
    //      .text(
    //        (d) => `${d.properties.name}
    //    ${format(data.get(d.properties.name))}`,
    //      );

    svg
      .append('path')
      .datum(
        topojson.mesh(
          states,
          states.objects.states,
          (a, b) => a !== b,
        ),
      )
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', d3.geoPath());
  }, []);

  return (
    <div>
      <p>Hello</p>
      <svg ref={d3Chart}></svg>
    </div>
  );
};

export default StateChoropleth;
