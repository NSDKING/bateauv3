// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import './App.css';
import CarburantsPage from './levelCarburant';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carburants" element={<CarburantsPage />} />
           
        </Routes>
      </Router>
    </div>
  );
}

export default App;
