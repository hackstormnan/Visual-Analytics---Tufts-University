import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data from './LekagulSensorData.csv';
import mapImage from './Lekagul Roadways labeled v2.jpg';
import mapImage_light from './Lekagul Roadways labeled v22.png';
import sensorCount_all from './sensorCount_all.json';
import sensorCount_1 from './sensorCount_1.json';
import sensorCount_2 from './sensorCount_2.json';
import sensorCount_2p from './sensorCount_2p.json';
import sensorCount_3 from './sensorCount_3.json';
import sensorCount_4 from './sensorCount_4.json';
import sensorCount_5 from './sensorCount_5.json';
import sensorCount_6 from './sensorCount_6.json';
import { rgb } from 'd3-color';


const Bar4 = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [currentMapImage, setCurrentMapImage] = useState(mapImage);
  const toggleMapImage = () => {
    setCurrentMapImage((prevMapImage) => {
      return prevMapImage === mapImage ? mapImage_light : mapImage;
    });
  };
  const handleButtonClick = () => {
    setCurrentMapImage((prevMapImage) => prevMapImage === mapImage ? mapImage_light : mapImage);
  };
  const buttonText = currentMapImage === mapImage ? 'Switch to Light Version' : 'Switch to Dark Version';
  const sensorCountData = [
    { label: 'All', data: sensorCount_all },
    { label: '1', data: sensorCount_1 },
    { label: '2', data: sensorCount_2 },
    { label: '2p', data: sensorCount_2p },
    { label: '3', data: sensorCount_3 },
    { label: '4', data: sensorCount_4 },
    { label: '5', data: sensorCount_5 },
    { label: '6', data: sensorCount_6 }
  ];
  const sizeScale = d3.scaleSqrt().domain([0, 15000]).range([0 * 1.2, 40 * 1.2]);
  const customInterpolateReds = (t) => {
    const lowerLimit = 0.4;
    const upperLimit = 0.8;
    const adjustedT = lowerLimit + (upperLimit - lowerLimit) * t;
    return d3.interpolateReds(adjustedT);
  };
  const colorScale = d3.scaleSequential(customInterpolateReds).domain([0, 15000]);
  const [selectedSensorCounts, setSelectedSensorCounts] = useState(sensorCountData[0].data);
  
  const sensors = [
    { name: 'entrance1', x: 55, y: 207 },
    { name: 'ranger-stop4', x: 58, y: 291 },
    { name: 'camping5', x: 64, y: 369 },
    { name: 'gate2', x: 77, y: 167 },
    { name: 'ranger-stop1', x: 62, y: 75 },
    { name: 'camping2', x: 137, y: 197 },
    { name: 'camping3', x: 140, y: 209 },
    { name: 'camping4', x: 150, y: 272 },
    { name: 'camping0', x: 161, y: 128 },
    { name: 'gate1', x: 179, y: 136 },
    { name: 'gate0', x: 194, y: 103 },
    { name: 'general-gate1', x: 197, y: 79 },
    { name: 'entrance0', x: 191, y: 43 },
    { name: 'general-gate4', x: 212, y: 300 },
    { name: 'general-gate7', x: 200, y: 440 },
    { name: 'ranger-stop2', x: 246, y: 109 },
    { name: 'ranger-stop0', x: 273, y: 52 },
    { name: 'general-gate2', x: 318, y: 101 },
    { name: 'general-gate0', x: 338, y: 31 },
    { name: 'camping1', x: 394, y: 155 },
    { name: 'ranger-stop3', x: 452, y: 140 },
    { name: 'gate3', x: 454, y: 185 },
    { name: 'camping8', x: 558, y: 149 },
    { name: 'general-gate3', x: 567, y: 170 },
    { name: 'entrance2', x: 557, y: 267 },
    { name: 'gate4', x: 500, y: 348 },
    { name: 'ranger-stop5', x: 460, y: 362 },
    { name: 'general-gate5', x: 379, y: 339 },
    { name: 'general-gate6', x: 415, y: 418 },
    { name: 'ranger-stop7', x: 306, y: 461 },
    { name: 'gate7', x: 297, y: 488 },
    { name: 'entrance3', x: 352, y: 509 },
    { name: 'gate6', x: 355, y: 462 },
    { name: 'ranger-stop6', x: 376, y: 448 },
    { name: 'gate5', x: 400, y: 445 },
    { name: 'ranger-base', x: 391, y: 534 },
    { name: 'gate8', x: 422, y: 551 },
    { name: 'entrance4', x: 427, y: 560 },
    { name: 'camping6', x: 457, y: 539 },
    { name: 'camping7', x: 552, y: 442 },
  ];

  const findSensorCount = (sensorName) => {
    const sensorData = selectedSensorCounts.find((sensor) => sensor.sensor === sensorName);
    return sensorData ? sensorData.count : 0;
  };

  const radiusScale = d3.scaleSqrt().domain([0, 15000]).range([0, 20]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll('circle')
      .data(sensors)
      .join('circle')
      .attr('cx', d => d.x * 1.2)
      .attr('cy', d => {
        const offsetY = (currentMapImage === mapImage_light && d.y > 305) ? 20 : 0;
        return (d.y + offsetY) * 1.2;
      })
      .attr('r', d => {
        const sensor = selectedSensorCounts.find(s => s.sensor === d.name);
        return sensor ? sizeScale(sensor.count) : sizeScale(0);
      })
      .attr('fill', d => {
        const sensor = selectedSensorCounts.find(s => s.sensor === d.name);
        const color = sensor ? colorScale(sensor.count) : colorScale(0);
        const rgbaColor = rgb(color);
        rgbaColor.opacity = 0.5;
        return rgbaColor;
      })
      .on("mousemove", (event, d) => {
        d3.select(event.currentTarget).attr("stroke", "white").attr("stroke-width", 1.5);
        const sensor = selectedSensorCounts.find(s => s.sensor === d.name);
        const sensorLabel = sensorCountData.find(item => item.data === selectedSensorCounts).label;
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip.html(`Name: ${d.name}<br/>Label: ${sensorLabel}<br/>Count: ${sensor ? sensor.count : 0}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr("stroke", null).attr("stroke-width", null);
        tooltip.transition().duration(100).style("opacity", 0);
      });
  }, [selectedSensorCounts, sizeScale]);

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedSensorCounts(sensorCountData[selectedIndex].data);
  };

  return (
    <div className="container">
    <button onClick={handleButtonClick} style={{ position: 'absolute', zIndex: 3, left: '340px', marginLeft: "900px", marginTop: "200px"}}>
      {buttonText}
    </button>
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        textAlign: 'center',
        padding: '5px',
        font: '12px sans-serif',
        background: 'white',
        border: '1px solid black',
        borderRadius: '4px',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: 3,
      }}
    />
    <select
      onChange={handleDropdownChange}
      style={{
        position: "absolute",
        zIndex: 3,
        left: "440px",
        marginLeft: "0px", 
        marginTop: "200px", 
      }}
    >
      {sensorCountData.map((item, index) => (
        <option key={index} value={index}>
          {item.label}
        </option>
      ))}
    </select>

    <img
      src={currentMapImage}
      alt="Lekagul Roadways"
      style={{ position: 'absolute', zIndex: 1, width: '732px', height: '732px', marginLeft: "370px", marginTop: "200px"}}
    />
    <svg
      ref={svgRef}
      viewBox="0 0 732 732"
      style={{ position: 'absolute', zIndex: 2, width: '732px', height: '732px', marginLeft: "370px", marginTop: "200px" }}
    />  
  </div>
);
}

export default Bar4;