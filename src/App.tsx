import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import FixturesPage from './pages/FixturesPage';

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar />
            <Routes>
                <Route path="/" element={<div />} />
                <Route path="/fixtures" element={<FixturesPage></FixturesPage>} />
                {/* <Route path="/teams" element={<TeamsPage />} />
                <Route path="/about" element={<AboutPage />} /> */}
                {/* Add more routes here */}
            </Routes>
        </Router>
    </div>

  );
}

export default App;
