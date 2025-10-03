import React, { useState, useEffect } from "react";
import axios from "axios";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employee, setEmployee] = useState("");
  const [basic, setBasic] = useState("");
  const [bonus, setBonus] = useState("");
  const [deductions, setDeductions] = useState("");
  const [tax, setTax] = useState("");

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    const res = await axios.get("http://localhost:5000/payrolls");
    setPayrolls(res.data);
  };

  const calculateAttendanceImpact = (employeeName, basicSalary) => {
    // Replace with server-side attendance records if needed
    return 0; // simplified for now
  };

  const handleAdd = async () => {
    if (!employee || !basic) return alert("Employee and Basic Salary required");

    const basicSalary = parseFloat(basic || 0);
    const bonusAmt = parseFloat(bonus || 0);
    const deductionAmt = parseFloat(deductions || 0);
    const taxAmt = parseFloat(tax || 0);
    const attendanceImpact = calculateAttendanceImpact(employee, basicSalary);

    const total = basicSalary + bonusAmt + attendanceImpact - deductionAmt - taxAmt;

    const newRecord = { employee, basic: basicSalary, bonus: bonusAmt, attendanceImpact, deductions: deductionAmt, tax: taxAmt, total };

    const res = await axios.post("http://localhost:5000/payrolls", newRecord);
    setPayrolls([...payrolls, res.data]);

    setEmployee(""); setBasic(""); setBonus(""); setDeductions(""); setTax("");
  };

  const generateSlip = (p) => {
    alert(`Salary Slip for ${p.employee}\nBasic: ₹${p.basic}\nBonus: ₹${p.bonus}\nAttendance Adj.: ₹${p.attendanceImpact}\nDeductions: ₹${p.deductions}\nTax: ₹${p.tax}\nNet Salary: ₹${p.total}`);
  };

  const payEmployee = (p) => alert(`Payment of ₹${p.total} processed for ${p.employee}!`);

  const deletePayroll = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payroll record?")) return;
    await axios.delete(`http://localhost:5000/payrolls/${id}`);
    setPayrolls(payrolls.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>Payroll Management</h2>
      <input placeholder="Employee Name" value={employee} onChange={e => setEmployee(e.target.value)} />
      <input placeholder="Basic Salary" value={basic} onChange={e => setBasic(e.target.value)} />
      <input placeholder="Bonus" value={bonus} onChange={e => setBonus(e.target.value)} />
      <input placeholder="Deductions" value={deductions} onChange={e => setDeductions(e.target.value)} />
      <input placeholder="Tax" value={tax} onChange={e => setTax(e.target.value)} />
      <button onClick={handleAdd}>Add Payroll</button>

      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Employee</th><th>Basic</th><th>Bonus</th><th>Attendance Adj.</th><th>Deductions</th><th>Tax</th><th>Net Salary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((p) => (
            <tr key={p._id}>
              <td>{p.employee}</td>
              <td>{p.basic}</td>
              <td>{p.bonus}</td>
              <td>{p.attendanceImpact}</td>
              <td>{p.deductions}</td>
              <td>{p.tax}</td>
              <td>{p.total}</td>
              <td>
                <button onClick={() => generateSlip(p)}>Salary Slip</button>
                <button onClick={() => payEmployee(p)}>Pay</button>
                <button onClick={() => deletePayroll(p._id)} style={{ marginLeft: 5 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;
