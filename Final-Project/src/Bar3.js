import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data from './LekagulSensorData.csv';
import dateValues_all from './dateValues_all.json';
import dateValues_1 from './dateValues_1.json';
import dateValues_2 from './dateValues_2.json';
import dateValues_2p from './dateValues_2p.json';
import dateValues_3 from './dateValues_3.json';
import dateValues_4 from './dateValues_4.json';
import dateValues_5 from './dateValues_5.json';
import dateValues_6 from './dateValues_6.json';

const Bar3 = () => {
  const tooltipRef = useRef();
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedDateValues, setSelectedDateValues] = useState(dateValues_all);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const containerRef = useRef();
  const svg = d3.create('svg');
  const svgNode = svg.node();
  const yearRef = useRef();

  const groupedData = d3.group(selectedDateValues, d => {
    const date = new Date(d.date);
    return date.getUTCFullYear();
  });

  const years = Array.from(groupedData.entries()).map(([year, data]) => ({ key: year, values: data })).reverse();

  const scaleFactor = 1.5;
  const cellSize = 15 * scaleFactor;
  const yearHeight = cellSize * 7 + 25 * scaleFactor;
  const width = 960 * scaleFactor;
  const height = years.length * yearHeight + cellSize * 2;

  const formatDay = d => {
  const date = new Date(d.date);
    return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][date.getUTCDay()];
  };
    
  const countDay = dateStr => {
    const date = new Date(dateStr);
    return date.getUTCDay();
  };
  const timeWeek = d3.utcSunday;

  const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(selectedDateValues, d => d.value)]);

  const isHoliday = date => {
    const year = date.getUTCFullYear();
    if (date.getUTCMonth() === 0 && date.getUTCDate() === 1) {
      return "New Year";
    }
    if (year === 2015 && date.getUTCMonth() === 10 && date.getUTCDate() === 26) {
      return "Thanksgiving";
    }
    if (date.getUTCMonth() === 11 && date.getUTCDate() === 25) {
      return "Christmas";
    }
    return null;
  };

  const [highlightHolidays, setHighlightHolidays] = useState(false);
  const toggleHolidayHighlight = () => {
    setHighlightHolidays(prevState => !prevState);
  };

  const handleDateValuesChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);

    switch (selectedValue) {
      case "all":
        setSelectedDateValues(dateValues_all);
        break;
      case "1":
        setSelectedDateValues(dateValues_1);
        break;
      case "2":
        setSelectedDateValues(dateValues_2);
        break;
      case "2p":
        setSelectedDateValues(dateValues_2p);
        break;
      case "3":
        setSelectedDateValues(dateValues_3);
        break;
      case "4":
        setSelectedDateValues(dateValues_4);
        break;
      case "5":
        setSelectedDateValues(dateValues_5);
        break;
      case "6":
        setSelectedDateValues(dateValues_6);
        break;
      default:
        setSelectedDateValues(dateValues_all);
    }
  };
  

  useEffect(() => {
    const svg = d3.create('svg');
    const svgNode = svg.node();

    const groupedData = d3.group(selectedDateValues, d => {
      const date = new Date(d.date);
      return date.getUTCFullYear();
    });
    const years = Array.from(groupedData.entries()).map(([year, data]) => ({ key: year, values: data })).reverse();

    const scaleFactor = 1.5;
    const cellSize = 15 * scaleFactor;
    const yearHeight = cellSize * 7 + 25 * scaleFactor;
    const width = 960 * scaleFactor;
    const height = years.length * yearHeight + cellSize * 2 + 1000;

    
    const formatDay = d => {
      const date = new Date(d.date);
      return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][date.getUTCDay()];
    };
    
    const countDay = dateStr => {
      const date = new Date(dateStr);
      return date.getUTCDay();
    };
    const timeWeek = d3.utcSunday;

    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(selectedDateValues, d => d.value)]);

    svg
      .attr('width', width)
      .attr('height', height);

    const year = svg.selectAll('g')
      .data(years)
      .join('g')
      .attr('transform', (d, i) => `translate(40, ${yearHeight * i + cellSize * 1.5})`);

    yearRef.current = year;

    year.each(function(d, i) {
      const g = d3.select(this);
    
      g.append('text')
        .attr('x', -30)
        .attr('y', -20)
        .attr("text-anchor", "end")
        .attr('font-size', 16)
        .attr('font-weight', 550)
        .attr('transform', 'rotate(270)')
        .text(d => d.key)
    
      g.append('g')
        .attr('text-anchor', 'end')
        .selectAll('text')
        .data(d3.range(7).map(i => new Date(1999, 0, i)))
        .join('text')
        .attr('x', 10)
        .attr('y', d => (countDay(d) + 0.5) * cellSize)
        .attr('dy', '0.31em')
        .text(d => formatDay({ date: d }))
    
      g.append('g')
        .selectAll('rect')
        .data(d => d.values)
        .join('rect')
        .attr("width", cellSize - 1.5)
        .attr("height", cellSize - 1.5)
        .attr("x", d => d3.utcWeek.count(d3.utcYear(new Date(d.date)), new Date(d.date)) * cellSize + 20)
        .attr("y", d => (new Date(d.date)).getUTCDay() * cellSize + 0.5)
        .attr("fill", d => color(d.value))
        .attr("stroke", d => {
          if (!highlightHolidays) return "none";
          const holiday = isHoliday(new Date(d.date));
          return holiday ? "red" : "none";
        })
        .attr("stroke-width", 1.5)
        .on('mouseover', (event, d) => {
          const tooltip = tooltipRef.current;
          tooltip.style.opacity = 1;
          tooltip.innerHTML = `Date: ${d.date}<br>Day: ${formatDay(d)}<br>Count: ${d.value}`;
        })
        .on('mousemove', (event) => {
          const tooltip = tooltipRef.current;
          tooltip.style.left = (event.pageX + 15) + 'px';
          tooltip.style.top = (event.pageY + 15) + 'px';
        })
        .on('mouseout', () => {
          const tooltip = tooltipRef.current;
          tooltip.style.opacity = 0;
        })
        .on('mouseover', (event, d) => {
          const tooltip = tooltipRef.current;
          tooltip.style.opacity = 1;
          const holidayName = isHoliday(new Date(d.date));
          tooltip.innerHTML = `Date: ${d.date}<br>Day: ${formatDay(d)}<br>Count: ${d.value}${holidayName ? `<br>Holiday: ${holidayName}` : ''}`;
        })
    }
    
    );

  const maxValue = d3.max(selectedDateValues, d => d.value);
  const legendWidth = 125;

  const legend = svg
    .append('g')
    .attr('transform', `translate(40, ${years.length * yearHeight + cellSize * 1.5 + 15})`);

  const categoriesCount = 10;

  const categories = [...Array(categoriesCount)].map((_, i) => {
    const upperBound = maxValue / categoriesCount * (i + 1);
    const lowerBound = maxValue / categoriesCount * i;

    return {
      upperBound,
      lowerBound,
      color: d3.interpolateBlues(upperBound / maxValue),
      selected: true,
    };
  });

  function toggle(event, legend) {
    const { lowerBound, upperBound, selected } = legend;
    console.log(lowerBound);
  
    legend.selected = !selected;
 
    const highlightedDates = years.map(y => ({
      key: y.key,
      values: y.values.filter(v => v.value < upperBound)
    }));
 
    year.data(highlightedDates)
      .selectAll('rect')
      .data(d => d.values, d => d.date)
      .transition()
      .duration(500)
      .attr('fill', d => legend.selected ? color(d.value) : '#ddd')
  }
 

  console.log(categories)

  legend
    .selectAll('rect')
    .data(categories)
    .enter()
    .append('rect')
    .attr('fill', d => d.color)
    .attr('x', (d, i) => legendWidth * i) 
    .attr('width', legendWidth)
    .attr('height', 15)
    .on('click', toggle);

  // Add legend labels
  legend
    .selectAll("text")
    .data(categories)
    .join("text")
    .attr("transform", "rotate(90)")
    .attr("y", (d, i) => -legendWidth * i)
    .attr("dy", -60)
    .attr("x", 20)
    .attr("text-anchor", "start")
    .attr("font-size", 11)
    .text(d => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);

  legend
    .append("text")
    .attr("dy", -8)
    .attr("font-size", 12)
    .attr("text-decoration", "underline")
    .text("Click on category to select/deselect days");

  containerRef.current.appendChild(svgNode);
  return () => {
    if (containerRef.current) {
      containerRef.current.removeChild(svgNode);
    }
  };
}, [selectedCategories, highlightHolidays, selectedDateValues]);


return (
  <div>
    <button
      onClick={toggleHolidayHighlight}
      style={{ marginLeft: "200px", marginTop: "200px" }} 
    >
      {highlightHolidays ? "Hide" : "Show"} Holiday Highlights
    </button>
    <select
      value={selectedCategory}
      onChange={(e) => handleDateValuesChange(e)}
      style={{ marginLeft: "200px", marginTop: "200px" }}
    >
      <option value="all">All</option>
      <option value="1">Category 1</option>
      <option value="2">Category 2</option>
      <option value="2p">Category 2P</option>
      <option value="3">Category 3</option>
      <option value="4">Category 4</option>
      <option value="5">Category 5</option>
      <option value="6">Category 6</option>
    </select>
    <div ref={containerRef} style={{ marginLeft: "200px", marginTop: "100px" }}></div>
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        textAlign: "center",
        padding: "5px",
        font: "12px sans-serif",
        background: "white",
        border: "1px solid black",
        borderRadius: "4px",
        pointerEvents: "none",
        opacity: 0,
        zIndex: 3,
      }}
      className="tooltip"
    ></div>
  </div>
);


};

export default Bar3;