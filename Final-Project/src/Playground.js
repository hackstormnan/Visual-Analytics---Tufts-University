import React from 'react';
import { Link } from 'react-router-dom';
import './Playground.css'; // Import CSS file
import image1 from'./plot1.png';
import image2 from'./plot2.png';
import image3 from'./plot3.png';
import image4 from'./plot4.png';
import image5 from'./plot5.png';

function Playground() {
  return (
    <div>
      <header>
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" />
      </header>

      <h2>Playground</h2>
      
      <p>Pick the Graph</p>

      <div className="frame">
        <div className="plot-container">
          <img className="plot-image" src={image1} alt="Plot 1" />
          <img className="plot-image" src={image2} alt="Plot 2" />
          <img className="plot-image" src={image3} alt="Plot 3" />
          <img className="plot-image" src={image4} alt="Plot 4" />
          <img className="plot-image" src={image5} alt="Plot 5" />
        </div>

        <button className="custom-btn btn-5">
          <Link to="/Bar1">Bar chart 1<br/><br/>Number of Vehicles in Different Months, with drop down to select year and car-type</Link>
        </button>
        <button className="custom-btn btn-6">
          <Link to="/Bar2">Bar chart 2<br/><br/>Number of Vehicles in Different Sensors, with drop down to select year, car-type and sensor</Link>
        </button>
        <button className="custom-btn btn-7">
          <Link to="/Bar3">Heat Map 1<br/><br/>Calendar Heat Map showing number of vehicles on different days, with drop down to select car-type and highlight holidays</Link>
        </button>
        <button className="custom-btn btn-3">
          <Link to="/Bar4">Heat Map 2<br/><br/>Heat Map showing number of vehicles at different sensors, with drop down to select car-type</Link>
        </button>
        <button className="custom-btn btn-4">
          <Link to="/Bar5">Bar chart 3<br/><br/>Number of vehicles remain staying in the park for different times, with drop down to select year and car-type</Link>
        </button>
        
      </div>
    </div>

  );
}

export default Playground;