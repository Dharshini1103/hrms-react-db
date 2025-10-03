import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [employee, setEmployee] = useState("");
  const [date, setDate] = useState("");
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");

  const [shiftForm, setShiftForm] = useState({ employee: "", shift: "", start: "", end: "" });
  const [leaveForm, setLeaveForm] = useState({ employee: "", from: "", to: "", reason: "", status: "Pending", attendance: "N/A" });

  // Fetch data from server
  useEffect(() => {
    fetchAttendance();
    fetchShifts();
    fetchLeaves();
  }, []);

  const fetchAttendance = async () => {
    const res = await axios.get("http://localhost:5000/attendance");
    setAttendance(res.data);
  };

  const fetchShifts = async () => {
    const res = await axios.get("http://localhost:5000/shifts");
    setShifts(res.data);
  };

  const fetchLeaves = async () => {
    const res = await axios.get("http://localhost:5000/leaves");
    setLeaves(res.data);
  };

  // Handlers
  const handleAddAttendance = async () => {
    if (!employee || !date) return alert("Employee & Date required");
    const res = await axios.post("http://localhost:5000/attendance", { employee, date, clockIn, clockOut });
    setAttendance([...attendance, res.data]);
    setEmployee(""); setDate(""); setClockIn(""); setClockOut("");
  };

  const handleAddShift = async () => {
    if (!shiftForm.employee || !shiftForm.shift) return alert("Employee & Shift required");
    const res = await axios.post("http://localhost:5000/shifts", shiftForm);
    setShifts([...shifts, res.data]);
    setShiftForm({ employee: "", shift: "", start: "", end: "" });
  };

  const handleAddLeave = async () => {
    if (!leaveForm.employee || !leaveForm.from || !leaveForm.to) return alert("Employee, From & To required");
    const res = await axios.post("http://localhost:5000/leaves", leaveForm);
    setLeaves([...leaves, res.data]);
    setLeaveForm({ employee: "", from: "", to: "", reason: "", status: "Pending", attendance: "N/A" });
  };

  const handleLeaveStatus = async (id, newStatus) => {
    const attendanceStatus = window.prompt("Mark employee as Present or Absent?", "Present") || "N/A";
    const res = await axios.put(`http://localhost:5000/leaves/${id}`, { status: newStatus, attendance: attendanceStatus });
    setLeaves(leaves.map(l => l._id === id ? res.data : l));
  };

  return (
    <div>
      <h2>Attendance & Leave Management (Server-Based)</h2>

      {/* Attendance Form */}
      <div style={{ marginBottom: 20, border: "1px solid #ddd", padding: 10 }}>
        <h3>Track Clock-in/Clock-out</h3>
        <input placeholder="Employee Name" value={employee} onChange={(e) => setEmployee(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
        <input type="time" value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
        <button onClick={handleAddAttendance}>Add Attendance</button>

        <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
          <thead>
            <tr><th>Employee</th><th>Date</th><th>Clock In</th><th>Clock Out</th></tr>
          </thead>
          <tbody>
            {attendance.map((rec) => (
              <tr key={rec._id}>
                <td>{rec.employee}</td><td>{rec.date}</td><td>{rec.clockIn}</td><td>{rec.clockOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shift Management */}
      <div style={{ marginBottom: 20, border: "1px solid #ddd", padding: 10 }}>
        <h3>Work Shifts & Schedules</h3>
        <input placeholder="Employee Name" value={shiftForm.employee} onChange={(e) => setShiftForm({ ...shiftForm, employee: e.target.value })} />
        <input placeholder="Shift Name (Morning/Evening)" value={shiftForm.shift} onChange={(e) => setShiftForm({ ...shiftForm, shift: e.target.value })} />
        <input type="time" value={shiftForm.start} onChange={(e) => setShiftForm({ ...shiftForm, start: e.target.value })} />
        <input type="time" value={shiftForm.end} onChange={(e) => setShiftForm({ ...shiftForm, end: e.target.value })} />
        <button onClick={handleAddShift}>Add Shift</button>

        <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
          <thead><tr><th>Employee</th><th>Shift</th><th>Start</th><th>End</th></tr></thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s._id}><td>{s.employee}</td><td>{s.shift}</td><td>{s.start}</td><td>{s.end}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Management */}
      <div style={{ marginBottom: 20, border: "1px solid #ddd", padding: 10 }}>
        <h3>Leave Requests</h3>
        <input placeholder="Employee Name" value={leaveForm.employee} onChange={(e) => setLeaveForm({ ...leaveForm, employee: e.target.value })} />
        <input type="date" value={leaveForm.from} onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })} />
        <input type="date" value={leaveForm.to} onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })} />
        <input placeholder="Reason" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
        <button onClick={handleAddLeave}>Apply Leave</button>

        <table border="1" cellPadding="5" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Employee</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Attendance</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id}>
                <td>{l.employee}</td><td>{l.from}</td><td>{l.to}</td><td>{l.reason}</td>
                <td>{l.status}</td><td>{l.attendance}</td>
                <td>
                  <button onClick={() => handleLeaveStatus(l._id, "Approved")}>Approve</button>
                  <button onClick={() => handleLeaveStatus(l._id, "Rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
