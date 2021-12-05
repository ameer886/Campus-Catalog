import React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Form from 'react-bootstrap/Form';

// Provides topology processing for map and borders
import * as topojson from 'topojson-client';

// Provides legend (@d3/color-legend doesn't work on react)
import { legendColor } from 'd3-svg-legend';

// Provides actual SVG description for US states
// Taken from https://github.com/topojson/us-atlas
import states from './states-albers-10m';

import { getAPI } from '../../../APIClient';
import { IntentionallyAny, stateAbbToLong } from '../../../utilities';

// Override for all d3 schemes because gitLab can't import them
// this is why we can't have nice things
const schemeBlues = [
  '#eff3ff',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#084594',
];
const schemeReds = [
  '#fee5d9',
  '#fcbba1',
  '#fc9272',
  '#fb6a4a',
  '#ef3b2c',
  '#cb181d',
  '#99000d',
];
const schemeGreens = [
  '#edf8e9',
  '#c7e9c0',
  '#a1d99b',
  '#74c476',
  '#41ab5d',
  '#238b45',
  '#005a32',
];

/*
 * On the change that you find yourself using this component
 * as a reference, then you should make sure you understand
 * the basics of what an SVG is and how they work first.
 *
 * A good understanding of React hooks (particularly the
 * useRef hook) will be very helpful as well.
 *
 * The whole component is, of course, ripped nearly directly
 * from https://observablehq.com/@d3/state-choropleth
 * except that I had to fix all the bugs that don't work because
 * we're not in Observable
 */

const StateChoropleth: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Map<
    IntentionallyAny,
    IntentionallyAny
  > | null>(null);
  const [model, setModel] = useState('universities');

  // To use d3, we need to get an SVG and insert it directly
  // into the DOM. React really doesn't like you doing that
  // normally, so you need a ref. The ref must be null initially
  // to satisfy type constraints, but will be set to the SVG for
  // this component on mount.
  const d3Chart = useRef(null);

  // This should run automatically after mount, but only once
  // i.e. we should never need to fetch this data twice because
  // it doesn't matter when we change which model to show
  useEffect(() => {
    const fetchDataAsync = async () => {
      const response = await getAPI({ model: 'summary' });
      const mapCount = new Map();

      response.forEach((state) => {
        mapCount.set(stateAbbToLong(state.state), state);
      });

      setData(mapCount);
    };
    fetchDataAsync();
  }, []);

  // After mount, this should automatically run.
  // It will run the query, process the data, then use d3
  // to edit the SVG directly.
  // This should also run every time data is updated i.e.
  // only once after the query finishes. This means we query once
  // and render many times. Unlike the query, the SVG must be
  // built many times so we do need this.
  // Using two useEffects is very risky businesses, so if you must
  // change this, then please be aware of what you're doing.
  useEffect(() => {
    if (data == null) return;

    // Property we're reading in this chart
    const valProp =
      model === 'housing'
        ? 'num_prop'
        : model === 'universities'
        ? 'num_univ'
        : 'num_amen';

    // Number of cells in the label
    const numCells = 7;

    // Function built from d3 to get a suitable color scheme
    // Apparently, the d3.schemeBlues/Reds/Greens functions
    // *can't* be imported by gitLab. Super cool.
    // So I've hard-coded the 7-elt array versions of these
    // for usage. If you really need to change the numCells,
    // PLEASE change this too.
    const scheme =
      model === 'housing'
        ? schemeReds // d3.schemeReds[7]
        : model === 'universities'
        ? schemeGreens // d3.schemeGreens[7]
        : schemeBlues; // d3.schemeBlues[7]
    const color = d3.scaleQuantize([1, numCells + 1], scheme);

    let maxCount = 0;
    data.forEach((val) => {
      maxCount = Math.max(maxCount, val[valProp]);
    });

    // Build a function that does a linear interpolation of
    // the data to get values and colors of states/cells
    const linear = d3
      .scaleLinear()
      .domain([0, maxCount])
      // Start range at 2 because 0 and 1 look like white
      // makes boundaries impossible to see
      .range([color(2), color(numCells)]);
    //.range(['rgb(46, 73, 123)', 'rgb(71, 187, 94)']);
    //.tickFormat(d3.format('d'));

    // Retrieve our chart via the ref
    const svg = d3.select(d3Chart.current);

    // We change our chart every time the model changes
    // This line deletes everything in the SVG; without it,
    // we actually wind up stacking a bunch of SVGs on top of
    // one another, which is really slow
    svg.selectAll('*').remove();

    // Set our size (must be done after clear)
    svg.attr('viewBox', [0, 0, 975, 610]);

    // Append a group in the top right for the label
    // Theoretically should not be a hard-coded position,
    // but I'm stupid and don't want to mess with dynamic
    // width/height params
    svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(580,20)');

    // Use alternative legend-building lib to create legend
    // function (as opposed to import {legend} from '@d3/color-legend)
    const linearLegend = legendColor()
      .title(
        'Number of ' + model.charAt(0).toUpperCase() + model.slice(1),
      ) // Legend title
      .shapeWidth(40) // Width of each cell
      .labelFormat(d3.format('d')) // Format of each cell text
      //.cells([1, 2, 3, 6, 8])     // explicit cell names
      .cells(numCells) // Number of cells to LIRP over
      .orient('horizontal') // Make the legend sideways
      .scale(linear); // And lirp

    // Retrieve that group we made earlier by class name and
    // run the function we just built, which appends a legend
    svg.select('.legend').call(linearLegend);

    // This chain is absurd but basically colors in the states
    // themselves based on whatever value they have in the map
    // It also adds in a tooltip via the title attribute
    // The tooltip shows the name of the state and its value
    svg
      .append('g')
      .selectAll('path')
      .data(topojson.feature(states, states.objects.states).features)
      .join('path')
      .attr('fill', (d) =>
        linear(data.get(d.properties.name)[valProp]),
      )
      .attr('d', d3.geoPath())
      .append('title')
      .text(
        (d) =>
          `${d.properties.name}\n${
            data.get(d.properties.name)[valProp]
          } ${model}`,
      );

    // This function draws the bundaries between the states
    // You can read more
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

    // At this point, we've retrieved our data and drawn
    // our SVG. We have no need for a loading string any more.
    setLoading(false);
  }, [data, model]);

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label htmlFor="modelSelect">
            Select your model:
          </Form.Label>
          <br />
          <select onChange={(e) => setModel(e.target.value)}>
            <option value="universities">Universities</option>
            <option value="housing">Housing</option>
            <option value="amenities">Amenities</option>
          </select>
        </Form.Group>
      </Form>
      {loading && <div>Loading, please be patient.</div>}
      <svg ref={d3Chart}></svg>
    </div>
  );
};

export default StateChoropleth;
