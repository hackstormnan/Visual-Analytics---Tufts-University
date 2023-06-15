import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './Home';
import About from './Playground';
import Analysis from './Analysis';
import Bar1 from './Bar1';
import Bar2 from './Bar2';
import Bar3 from './Bar3';
import Bar4 from './Bar4';
import Bar5 from './Bar5';
import './App.css';




function App() {
  return (
    
    <div id="container">
      
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Playground">Playground</Link>
            </li>
            <li>
              <Link to="/Analysis">Analysis</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Playground" element={<About />} />
          <Route path="/Analysis" element={<Analysis />} />
          <Route path="/Bar1" element={<Bar1 />} />
          <Route path="/Bar2" element={<Bar2 />} />
          <Route path="/Bar3" element={<Bar3 />} />
          <Route path="/Bar4" element={<Bar4 />} />
          <Route path="/Bar5" element={<Bar5 />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;