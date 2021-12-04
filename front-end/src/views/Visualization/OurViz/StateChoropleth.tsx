import React from 'react';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import states from './states-albers-10m';

const StateChoropleth: React.FunctionComponent = () => {
  const d3Chart = useRef(null);

  useEffect(() => {
    const data = new Map();
    const color = d3.scaleQuantize([1, 7], d3.schemeBlues[6]);

    data.set('Texas', 10);

    const svg = d3
      .select(d3Chart.current)
      .attr('viewBox', [0, 0, 975, 610]);

    svg.append('g').attr('transform', 'translate(610,20)');
    //.append(() => legend({ color, title: 'Profs', width: 260 }));

    svg
      .append('g')
      .selectAll('path')
      .data(topojson.feature(states, states.objects.states).features)
      .join('path')
      .attr('fill', (d) => color(data.get(d.properties.name)))
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
