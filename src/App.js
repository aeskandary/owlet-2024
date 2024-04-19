import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SurveyPage from "./pages/SurveyPage";
import CodePage from "./pages/CodePage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/code" element={<CodePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
