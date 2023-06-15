import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data from './LekagulSensorData.csv';

const Bar2 = () => {
  var totalGateNames = [["entrance0", "entrance1", "entrance2", "entrance3", "entrance4"], 
  ["general-gate0", "general-gate1", "general-gate2", "general-gate3", "general-gate4", "general-gate5", "general-gate6", "general-gate7"], 
  ["gate0", "gate1", "gate2", "gate3", "gate4", "gate5", "gate6", "gate7", "gate8"], 
  ["ranger-stop0", "ranger-stop1", "ranger-stop2", "ranger-stop3", "ranger-stop4", "ranger-stop5", "ranger-stop6", "ranger-stop7"], 
  ["camping0", "camping1", "camping2", "camping3", "camping4", "camping5", "camping6", "camping7", "camping8"]];

  const chartRef = useRef(null);
  const [carCounts, setcarCounts] = useState([]);
  const [yearSelectedOption, setyearSelectedOption] = useState("all");
  const [carSelectedOption, setcarSelectedOption] = useState("all");
  const [gateSelectedOption, setgateSelectedOption] = useState("Entrances");

  var years = ["all"];
  for (let i = 2010; i <= 2020; i++) {
    years.push(i.toString());
  }
  var carType = ["all", "1", "2", "2P", "3", "4", "5", "6"];
  var gateType = ["Entrances", "General-gates", "Gates", "Ranger-stops", "Camping"];
  

  var gateNames = totalGateNames[0];
  
  useEffect(() => {
    d3.csv(data).then(data => {
      for (var i = 0; i < totalGateNames.length; i++) {
        if (gateSelectedOption === gateType[i]) {
          gateNames = totalGateNames[i];
        }
      }

      const counts = Array.from({ length: gateNames.length }).fill(0);
      if (yearSelectedOption == "all" && carSelectedOption != "all") {
        for (var i = 0; i < gateNames.length; i++) {
          // Loop through each data entry
          data.forEach(function(entry) {
              if (entry['car-type'] === carSelectedOption && entry['gate-name'] === gateNames[i]) {
                  // Increment the count at the corresponding index in the carCounts array
                  counts[i]++;
              }
          });
        }
      } else if (yearSelectedOption != "all" && carSelectedOption == "all") {
        for (var i = 0; i < gateNames.length; i++) {
          // Loop through each data entry
          data.forEach(function(entry) {
              if (entry["Timestamp"].includes(yearSelectedOption) && entry['gate-name'] === gateNames[i]) {
                  // Increment the count at the corresponding index in the carCounts array
                  counts[i]++;
              }
          });
        }
      } else if (yearSelectedOption == "all" && carSelectedOption == "all") {
        for (var i = 0; i < gateNames.length; i++) {
          // Loop through each data entry
          data.forEach(function(entry) {
              if (entry['gate-name'] === gateNames[i]) {
                  // Increment the count at the corresponding index in the carCounts array
                  counts[i]++;
              }
          });
        }
      } else {
        for (var i = 0; i < gateNames.length; i++) {
          // Loop through each data entry
          data.forEach(function(entry) {
              if (entry["Timestamp"].includes(yearSelectedOption) && entry['car-type'] === carSelectedOption && entry['gate-name'] === gateNames[i]) {
                  // Increment the count at the corresponding index in the carCounts array
                  counts[i]++;
              }
          });
        }
      }
      setcarCounts(counts);
    });
  }, [yearSelectedOption, carSelectedOption, gateSelectedOption]);

  useEffect(() => {
    drawChart();
  }, [carCounts, yearSelectedOption, carSelectedOption, gateSelectedOption]);


  useEffect(() => {
    d3.select("#yearDropdown")
      .selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .style("font-family", "'Times New Roman', Times, serif")
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
      .style("font-family", "'Times New Roman', Times, serif")
      .text((d) => d);
  
    d3.select("#carDropdown").on("change", handleCarChange); // modify this line
  }, []);

  useEffect(() => {  
    d3.select("#gateDropdown")
      .selectAll("option")
      .data(gateType)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .style("font-family", "'Times New Roman', Times, serif")
      .text((d) => d);

    d3.select("#gateDropdown").on("change", handleGateChange); // modify this line
  }, []);

  const handleYearChange = (event) => {
    setyearSelectedOption(event.target.value);
  };

  const handleCarChange = (event) => {
    setcarSelectedOption(event.target.value);
  };

  const handleGateChange = (event) => {
    setgateSelectedOption(event.target.value);
  };

  const drawChart = () => {
    const margin = { top: 70, right: 400, bottom: 70, left: 60 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    for (var i = 0; i < totalGateNames.length; i++) {
      if (gateSelectedOption === gateType[i]) {
        gateNames = totalGateNames[i];
      }
    }

    // Remove the current SVG element
    d3.select(chartRef.current)
      .select("svg")
      .remove();
    
    const svg_bar2 = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left + 400}, ${margin.top})`);

    
    // Create the x and y scales
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(gateNames);
    
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(carCounts)]);
  
    
    svg_bar2.append("g")
      .attr("class", "x axis")
      .style("font-size", "15px")
      .style("font-family", "'Times New Roman', Times, serif")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    
    svg_bar2.append("g")
      .attr("class", "y axis")
      .style("font-size", "15px")
      .style("font-family", "'Times New Roman', Times, serif")
      .call(d3.axisLeft(y));
    
    
    // Add original sequential color map
    var colorScale = d3.scaleSequential()
      .domain([d3.min(carCounts), d3.max(carCounts)])
      .interpolator(d3.interpolateYlGnBu);

    // Append bars to the bar chart with the appropriately scaled height
    svg_bar2.selectAll(".bar")
        .data(carCounts)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return x(gateNames[i]); })
        .attr("width", x.bandwidth())
        .attr("y", d => y(d))
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("height", d => height - y(d))
        .style("fill", function(d) { return colorScale(d); });


    // Add y-value for each bar, above the bar. Make sure y-value corresponds to radio button
    svg_bar2.selectAll("bar-title")
      .data(carCounts)
      .enter()
      .append("text")
      .classed('bar-title', true)
      .attr('text-anchor', 'middle')
      .attr("x", function(d, i) { return x(gateNames[i]) + 330 * (1 / gateNames.length); })
      .attr("y", d => y(d)-10)
      .style("font-size", "15px")
      .style("font-family", "'Times New Roman', Times, serif")
      .text(d => Math.round(d * 100) / 100); // Rounds value to 2 decimal places


    // add x-axis label
    svg_bar2.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 10)
        .style("font-size", "20px")
        .style("font-family", "'Times New Roman', Times, serif")
        .style("font-weight", "bold")
        .text("Gate: " + gateSelectedOption);
    
    // add y-axis label
    svg_bar2.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -height/2)
        .attr("y", margin.left - 140)
        .attr("transform", "rotate(-90)")
        .style("font-size", "20px")
        .style("font-family", "'Times New Roman', Times, serif")
        .style("font-weight", "bold")
        .text("Number of Vehicles (Type: " + carSelectedOption + ")");
    
    svg_bar2.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .style("font-family", "'Times New Roman', Times, serif")
        .style("font-weight", "bold")
        .text("Number of Vehicles in Year: " + yearSelectedOption);
  }

  return (
    <div style={{ position: "relative"}}>
      <div style={{ position: "absolute", top: "145px", left: "280px", textAlign: "center", fontFamily: "Times New Roman", fontWeight: "bold", fontSize: "18px"}}>
        <span style={{ marginRight: "150px"}}>Year</span>
        <span style={{ marginRight: "140px"}}>Car-Type</span>
        <span> Gate</span>
      </div>
      <select 
        id="yearDropdown" 
        style={{ width: '200px', height: '30px', position: "relative", top: "180px", left: "200px", fontFamily: "'Times New Roman', Times, serif"}}>
      </select>
      <select
        id="carDropdown"
        style={{width: '200px', height: '30px', position: "relative", top: "180px", left: "200px", fontFamily: "'Times New Roman', Times, serif" }}>
      </select>
      <select
        id="gateDropdown"
        style={{width: '200px', height: '30px', position: "relative", top: "180px", left: "200px", fontFamily: "'Times New Roman', Times, serif" }}>
      </select>
      <div ref={chartRef} style={{ position: "absolute", top: "250px", right: "400px" }}></div>
    </div>
  );
}

export default Bar2;