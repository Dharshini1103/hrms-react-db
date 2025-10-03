import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeManagement from './components/EmployeeManagement';
import Recruitment from './components/Recruitment';
import Attendance from './components/Attendance';
import Payroll from './components/Payroll';
import Performance from './components/Performance';
import Training from './components/Training';
import SelfService from './components/SelfService';
import Reports from './components/Reports';
import './App.css';

// Logo URL you gave
const logoUrl = "https://media.licdn.com/dms/image/v2/D560BAQGgM_pxrbC8Ww/company-logo_200_200/company-logo_200_200/0/1720637148913?e=2147483647&v=beta&t=pQsCkJV4tC_FatZeFZ5Tk2BSrBsdH0tsWsF2UrtS6fs";

const Home = () => (
  <div className="home">
    <img 
      src={logoUrl} 
      alt="Company Logo" 
      style={{ width: "120px", marginBottom: "20px" }} 
    />
    <h1>Welcome to HRMS Dashboard</h1>
    <p>Select a module from the navigation bar above.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/training" element={<Training />} />
          <Route path="/selfservice" element={<SelfService />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
