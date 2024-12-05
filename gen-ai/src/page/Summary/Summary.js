// Summary.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Summary.css';

function Summary() {
  const chartRef = useRef();

  useEffect(() => {
    const fetchAndRenderChart = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/summary');
        const data = response.data;
        renderChart(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAndRenderChart();
  }, []);

  const renderChart = (data) => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.month))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d.value)]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    // Add line
    const line = d3.line()
      .x(d => x(d.month) + x.bandwidth()/2)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    // Add points
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.month) + x.bandwidth()/2)
      .attr('cy', d => y(d.value))
      .attr('r', 5);
  };

  return (
    <div className="summary-container">
      <h2>AI Performance Growth</h2>
      <div ref={chartRef} className="chart-container"></div>
    </div>
  );
}

export default Summary;
