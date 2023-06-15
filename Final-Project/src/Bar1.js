import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data from './LekagulSensorData.csv';

const Bar1 = () => {
  const chartRef = useRef(null);
  const [carCounts, setCarCounts] = useState([]);
  const [yearSelectedOption, setyearSelectedOption] = useState("all");
  const [carSelectedOption, setcarSelectedOption] = useState("all");

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var carType = ["all", "1", "2", "2P", "3", "4", "5", "6"];

  useEffect(() => {
    d3.csv(data).then(data => {
      const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  

      if (yearSelectedOption == "all" && carSelectedOption != "all") {
        data.forEach(function(d) {
          if (d['car-type'] == carSelectedOption) {
            // Get the month of the data point
            const month = new Date(d.Timestamp).getMonth();
            counts[month]++;
          }
        });
      } else if (yearSelectedOption != "all" && carSelectedOption == "all") {
        data.forEach(function(d) {
          if (d['Timestamp'].includes(yearSelectedOption)) {
            // Get the month of the data point
            const month = new Date(d.Timestamp).getMonth();
            counts[month]++;
          }
        });
      } else if (yearSelectedOption == "all" && carSelectedOption == "all") {
        data.forEach(function(d) {
            // Get the month of the data point
            const month = new Date(d.Timestamp).getMonth();
            counts[month]++;
        });
      } else {
        data.forEach(function(d) {
          if (d['car-type'] == carSelectedOption && d['Timestamp'].includes(yearSelectedOption)) {
            // Get the month of the data point
            const month = new Date(d.Timestamp).getMonth();
            counts[month]++;
          }
        });
      }

  
      setCarCounts(counts);
    });
  }, [yearSelectedOption, carSelectedOption]);

  useEffect(() => {
    drawChart();
  }, [carCounts, yearSelectedOption, carSelectedOption]);


  useEffect(() => {
    // add the options to the X-axis dropdown
    const years = [];
    years.push("all");

    for (let i = 2010; i <= 2020; i++) {
      years.push(i.toString());
    }
  
    d3.select("#yearDropdown")
      .selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);
  
    d3.select("#yearDropdown").on("change", handleYearChange); // modify this line
  }, []);

  useEffect(() => {
    d3.select("#carDropdown")
      .selectAll("option")
      .data(carType)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);
  
    d3.select("#carDropdown").on("change", handleCarChange); // modify this line
  }, []);

  const handleYearChange = (event) => {
    setyearSelectedOption(event.target.value);
  };

  const handleCarChange = (event) => {
    setcarSelectedOption(event.target.value);
  };

  const drawChart = () => {
    const margin = { top: 70, right: 400, bottom: 70, left: 60 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Remove the current SVG element
    d3.select(chartRef.current)
      .select("svg")
      .remove();
    
    const svg_bar1 = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left + 400}, ${margin.top})`);
    
    // Create the x and y scales
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(months);
    
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(carCounts)]);
  
    
    svg_bar1.append("g")
      .attr("class", "x axis")
      .style("font-size", "15px")
      .style("font-family", "'Times New Roman', Times, serif")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    
    svg_bar1.append("g")
      .attr("class", "y axis")
      .style("font-size", "15px")
      .style("font-family", "'Times New Roman', Times, serif")
      .call(d3.axisLeft(y));


    // Add original sequential color map
    var colorScale = d3.scaleSequential()
      .domain([d3.min(carCounts), d3.max(carCounts)])
      .interpolator(d3.interpolateReds);

    // Append bars to the bar chart with the appropriately scaled height
    svg_bar1.selectAll(".bar")
        .data(carCounts)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return x(months[i]); })
        .attr("width", x.bandwidth())
        .attr("y", d => y(d))
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("height", d => height - y(d))
        .style("fill", function(d) { return colorScale(d); });

    // Add y-value for each bar, above the bar. Make sure y-value corresponds to radio button
    svg_bar1.selectAll("bar-title")
      .data(carCounts)
      .enter()
      .append("text")
      .classed('bar-title', true)
      .attr('text-anchor', 'middle')
      .attr("x", function(d, i) { return x(months[i]) + 330 * (1 / months.length); })
      .attr("y", d => y(d)-5)
      .style("font-size", "15px")
      .style("font-family", "'Times New Roman', Times, serif")
      .text(d => Math.round(d * 100) / 100); // Rounds value to 2 decimal places

    
    // add x-axis label
    svg_bar1.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 10)
        .style("font-size", "20px")
        .style("font-family", "'Times New Roman', Times, serif")
        .style("font-weight", "bold")
        .text("Months");
    
    // add y-axis label
    svg_bar1.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -height/2)
        .attr("y", margin.left - 120)
        .attr("transform", "rotate(-90)")
        .style("font-size", "20px")
        .style("font-family", "'Times New Roman', Times, serif")
        .style("font-weight", "bold")
        .text("Number of Vehicles (Type: " + carSelectedOption + ")");
    
    svg_bar1.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "'Times New Roman', Times, serif")
        .style("font-weight", "bold")
        .style("text-decoration", "underline")
        .text(yearSelectedOption + ": Number of Vehicles in Different Months");
  }
  return (
    <div style={{ position: "relative"}}>
      <div style={{ position: "absolute", top: "100px", left: "435px", textAlign: "center", fontFamily: "Times New Roman", fontWeight: "bold", fontSize: "18px"}}>
        <span style={{ marginRight: "140px"}}>Year</span>
        <span> Car-Type</span>
      </div>
      <select
        id="yearDropdown"
        style={{width: '200px', height: '30px', position: "relative", top: "130px", left: "350px", fontFamily: "'Times New Roman', Times, serif" }}
      ></select>
      <select
        id="carDropdown"
        style={{width: '200px', height: '30px', position: "relative", top: "130px", left: "350px", fontFamily: "'Times New Roman', Times, serif" }}
      ></select>
      <div ref={chartRef} style={{ position: "absolute", top: "200px", right: "450px" }}></div>
    </div>
  );
}

export default Bar1;