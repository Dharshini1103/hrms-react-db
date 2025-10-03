import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SelfService = () => {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [requests, setRequests] = useState([]);

  const [employeeName, setEmployeeName] = useState('');
  const [updateField, setUpdateField] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [newRequest, setNewRequest] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, payrollRes, attendanceRes, reqRes] = await Promise.all([
        axios.get('http://localhost:5000/employees'),
        axios.get('http://localhost:5000/payrolls'),
        axios.get('http://localhost:5000/attendance'),
        axios.get('http://localhost:5000/requests')
      ]);
      setEmployees(empRes.data);
      setPayrolls(payrollRes.data);
      setAttendanceRecords(attendanceRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleUpdate = async () => {
    const emp = employees.find(e => e.name === employeeName);
    if (!emp) return alert('Employee not found');

    try {
      await axios.patch(`http://localhost:5000/employees/${emp._id}`, {
        [updateField]: updateValue
      });
      fetchData();
      setEmployeeName(''); setUpdateField(''); setUpdateValue('');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleRequest = async () => {
    if (!employeeName || !newRequest) return alert('Enter employee name and request');
    const emp = employees.find(e => e.name === employeeName);
    if (!emp) return alert('Employee not found');

    try {
      await axios.post('http://localhost:5000/requests', {
        employee: employeeName,
        request: newRequest,
        status: 'Pending'
      });
      fetchData();
      setNewRequest('');
    } catch (err) {
      console.error('Request submission failed:', err);
    }
  };

  const generateSlip = (name) => {
    const record = payrolls.find(p => p.employee === name);
    if (!record) return alert('No payroll record found');
    alert(`Salary Slip for ${record.employee}\nBasic: ₹${record.basic}\nBonus: ₹${record.bonus}\nAttendance Adj.: ₹${record.attendanceImpact}\nDeductions: ₹${record.deductions}\nTax: ₹${record.tax}\nNet Salary: ₹${record.total}`);
  };

  const viewAttendance = (name) => {
    const records = attendanceRecords.filter(r => r.employee === name);
    if (!records.length) return alert(`No attendance records found for ${name}.`);

    let msg = `Attendance for ${name}:\n`;
    records.forEach(r => {
      const status = r.clockIn && r.clockOut ? 'Present' : 'Absent';
      msg += `Date: ${r.date}, Status: ${status}\n`;
    });
    alert(msg);
  };

  return (
    <div>
      <h2>Employee Self-Service</h2>

      <h3>Update Personal Details</h3>
      <input placeholder="Employee Name" value={employeeName} onChange={e => setEmployeeName(e.target.value)} />
      <input placeholder="Field to Update (email/role/department)" value={updateField} onChange={e => setUpdateField(e.target.value)} />
      <input placeholder="New Value" value={updateValue} onChange={e => setUpdateValue(e.target.value)} />
      <button onClick={handleUpdate}>Update</button>

      <h3>Raise Request / Leave Request</h3>
      <input placeholder="Request Details" value={newRequest} onChange={e => setNewRequest(e.target.value)} />
      <button onClick={handleRequest}>Submit Request</button>

      <h3>Employee Records</h3>
      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Department</th>
            <th>Salary Slip</th><th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e._id}>
              <td>{e.name}</td><td>{e.email}</td><td>{e.role}</td><td>{e.department}</td>
              <td><button onClick={() => generateSlip(e.name)}>View</button></td>
              <td><button onClick={() => viewAttendance(e.name)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Requests / Leave Applications</h3>
      <table border="1" cellPadding="5">
        <thead><tr><th>Employee</th><th>Request</th><th>Status</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td>{r.employee}</td><td>{r.request}</td><td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelfService;
