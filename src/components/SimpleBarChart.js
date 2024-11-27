/*
    SimpleBarChart: takes an array of objects (val, count), width and height as props and renders a simple svg bar chart with those values

    props:
    width, height, data

    Packages Used:
    styled-components, react, d3
*/

import React, {useEffect,useRef } from 'react';
import * as d3 from 'd3';
import Styled from 'styled-components';
  
const SimpleBarChartContainer = Styled.div`
    display:inline-block;
`;

function SimpleBarChart({ width, height, data}) {
    const margin = {top: 20, right: 20, bottom: 50, left: 30};
    const ref = useRef(null);
    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();
        svg.attr('width', width)
        .attr('height', height);

        const selection = svg.selectAll('rect').data(data);
        
        // Adding X scale and axis
        const x = d3.scaleBand()
        .range([ 0, width-margin.left-margin.right])
        .domain(data.map(function(d) { return d.val; }))
        .padding(0.2);
        svg.append('g')
        .attr('transform', `translate(${margin.left},${height-margin.top})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(10,0)')
        .style('text-anchor', 'end');

        // Adding Y scale and axis
        const y = d3.scaleLinear()
        .domain([0, d3.max(data, d=> d.count)])
        .range([ height-margin.top-margin.bottom, 0]);
        svg.append('g')
        .call(d3.axisLeft(y)).attr('transform', `translate(${margin.left},${margin.bottom})`);

        // Adding bars to chart
        selection.enter()
        .append('rect')
        .attr('x', (d) =>x(d.val))
        .attr('y', (d)=> y(d.count))
        .attr('width', x.bandwidth())
        .attr('transform', `translate(${margin.left},${margin.bottom})`)
        .attr('height', (d)=>height-margin.top-margin.bottom - y(d.count))
        .attr('style',' fill:rgb(32, 168, 241);');
    },[data]);

    return (
        <SimpleBarChartContainer width={width}  >
            <svg  ref={ref}  />
        </SimpleBarChartContainer>
    );
}
export default SimpleBarChart;