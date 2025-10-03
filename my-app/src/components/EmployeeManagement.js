import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const fileInputRef = useRef(null);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    name: '', email: '', role: '', department: '', manager: '',
    phone: '', address: '', emergency: '', status: 'active',
    document: null, documentName: ''
  };
  const [form, setForm] = useState(initialForm);

  // Fetch employees from server
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get('http://localhost:5000/employees');
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, document: reader.result, documentName: file.name }));
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return alert('Name and Email required');

    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/employees/${editId}`, form);
        setEmployees(employees.map(emp => emp._id === editId ? res.data : emp));
        alert('Employee updated');
      } else {
        const res = await axios.post('http://localhost:5000/employees', form);
        setEmployees([...employees, res.data]);
        alert('Employee added');
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    const emp = employees.find(e => e._id === id);
    if (!emp) return;
    setForm({
      name: emp.name, email: emp.email, role: emp.role, department: emp.department,
      manager: emp.manager, phone: emp.phone, address: emp.address, emergency: emp.emergency,
      status: emp.status, document: emp.document, documentName: emp.documentName
    });
    setEditId(id);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStatus = async (id) => {
    const emp = employees.find(e => e._id === id);
    if (!emp) return;
    const updated = { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' };
    const res = await axios.put(`http://localhost:5000/employees/${id}`, updated);
    setEmployees(employees.map(e => e._id === id ? res.data : e));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await axios.delete(`http://localhost:5000/employees/${id}`);
    setEmployees(employees.filter(e => e._id !== id));
  };

  return (
    <div>
      <h2>Employee Management</h2>
      <div style={{ marginBottom: 20, padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
        <h3>{editId ? 'Edit Employee' : 'Add Employee'}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['name','email','role','department','manager','phone','address','emergency'].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
            />
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Upload document:&nbsp;
            <input ref={fileInputRef} type="file" onChange={handleFileChange} />
          </label>
          {form.documentName && <span style={{ marginLeft: 10 }}>{form.documentName}</span>}
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleSave} style={{ marginRight: 8 }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#007bff', color: '#fff' }}>
          <tr>
            {['Name','Email','Role','Department','Manager','Phone','Address','Emergency','Document','Status','Actions'].map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr><td colSpan="11" style={{ textAlign: 'center', padding: 16 }}>No employees yet</td></tr>
          )}
          {employees.map(emp => (
            <tr key={emp._id} style={{ background: emp.status === 'active' ? '#fff' : '#f8d7da' }}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{emp.department}</td>
              <td>{emp.manager}</td>
              <td>{emp.phone}</td>
              <td>{emp.address}</td>
              <td>{emp.emergency}</td>
              <td>
                {emp.document ? <a href={emp.document} download={emp.documentName}>{emp.documentName}</a> : '—'}
              </td>
              <td>{emp.status}</td>
              <td>
                <button onClick={() => handleEdit(emp._id)} style={{ marginRight: 6 }}>Edit</button>
                <button onClick={() => toggleStatus(emp._id)} style={{ marginRight: 6 }}>
                  {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(emp._id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
