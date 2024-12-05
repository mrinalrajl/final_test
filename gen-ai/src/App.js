import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate , useLocation } from 'react-router-dom';
import './App.css';

import Login from './page/Login/Login'
import Home from './page/Home/Home'
import Summary from './page/Summary/Summary'
import Register from './page/Register/Register'
import Reports from './page/Reports/Reports'
import Dashboard from './page/Dashboard/Dashboard'

import Menu from './components/Menu/Menu';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showMenuAndFooter = !['/login', '/register'].includes(location.pathname.toLowerCase());

  return (
    <>
      {showMenuAndFooter && <Menu />}
      <div className="mainContainer">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/login" element={<Login />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            exact path="/"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </div>
      {showMenuAndFooter && <Footer />}
    </>
  );
}

export default App;