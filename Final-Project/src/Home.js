import React from 'react';
import './Home.css';
import UniverseImage from './Universe.jpg';

function Home() {
  return (
    <div className="container clearfix">
      <h1>Visual Analytic</h1>


      <img className="main-image" src={UniverseImage} alt="Universe" />

      <div className="free-quote clearfix">
        <h3>Welcome to our web application for visual analysis! Our system is divided into three main parts. The link to them can be found at the top-right corner of the page.</h3>
        <h3>Home: The Home page serves as an introduction to new users on how to use our application. It provides a brief description of the system.</h3>
        <h3>Analysis: The Analysis page is where users can explore different hypotheses, view links to relevant visualizing graphs, and see instructions for default values. This page also includes conclusions and findings from our research.</h3>
        <h3>Playground: The Playground page offers interactive ways to explore the data, which are more powerful than merely investigating the results. This page provides five different visual analysis diagrams and a brief description of each one.</h3>
        <p5>Designed by Fanta<br/><br/> </p5>
      </div>
    </div>
  );
}

export default Home;