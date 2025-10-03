import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [
        employeesRes,
        candidatesRes,
        attendanceRes,
        payrollsRes,
        performancesRes,
        trainingsRes
      ] = await Promise.all([
        axios.get('http://localhost:5000/employees'),
        axios.get('http://localhost:5000/candidates'),
        axios.get('http://localhost:5000/attendance'),
        axios.get('http://localhost:5000/payrolls'),
        axios.get('http://localhost:5000/performances'),
        axios.get('http://localhost:5000/trainings')
      ]);

      setEmployees(employeesRes.data);
      setCandidates(candidatesRes.data);
      setAttendanceRecords(attendanceRes.data);
      setPayrolls(payrollsRes.data);
      setPerformances(performancesRes.data);
      setTrainings(trainingsRes.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const exportWord = () => {
    const header = `<h1>HRMS Compliance & Reports</h1>`;
    const section = (title, data) => `
      <h2>${title}</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    const htmlContent = `
      ${header}
      ${section('Employees', employees)}
      ${section('Candidates', candidates)}
      ${section('Attendance', attendanceRecords)}
      ${section('Payroll', payrolls)}
      ${section('Performance', performances)}
      ${section('Training', trainings)}
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'HRMS_Reports.doc';
    link.click();
  };

  return (
    <div>
      <h2>Compliance & Reports (Live Data)</h2>

      <h3>Employees</h3>
      <pre>{JSON.stringify(employees, null, 2)}</pre>

      <h3>Candidates</h3>
      <pre>{JSON.stringify(candidates, null, 2)}</pre>

      <h3>Attendance</h3>
      <pre>{JSON.stringify(attendanceRecords, null, 2)}</pre>

      <h3>Payroll</h3>
      <pre>{JSON.stringify(payrolls, null, 2)}</pre>

      <h3>Performance</h3>
      <pre>{JSON.stringify(performances, null, 2)}</pre>

      <h3>Training</h3>
      <pre>{JSON.stringify(trainings, null, 2)}</pre>

      <button onClick={exportWord} style={{ marginTop: 20 }}>
        Export All Reports (Word)
      </button>
    </div>
  );
};

export default Reports;
