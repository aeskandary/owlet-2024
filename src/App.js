import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import SurveyPage from './SurveyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/survey" element={<SurveyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;