import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [employee, setEmployee] = useState('');
  const [trainingName, setTrainingName] = useState('');
  const [status, setStatus] = useState('Assigned');
  const [mandatory, setMandatory] = useState(false);
  const [score, setScore] = useState('');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/trainings');
      setTrainings(res.data);
    } catch (err) {
      console.error('Error fetching trainings:', err);
    }
  };

  const handleAdd = async () => {
    if (!employee || !trainingName) return alert('Employee and Training required');

    const newTraining = {
      employee,
      trainingName,
      status,
      mandatory: mandatory ? 'Yes' : 'No',
      score: score || 'Not Evaluated'
    };

    try {
      const res = await axios.post('http://localhost:5000/trainings', newTraining);
      setTrainings([...trainings, res.data]);

      // Reset form
      setEmployee('');
      setTrainingName('');
      setStatus('Assigned');
      setMandatory(false);
      setScore('');
    } catch (err) {
      console.error('Error adding training:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`http://localhost:5000/trainings/${id}`);
      setTrainings(trainings.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting training:', err);
    }
  };

  return (
    <div>
      <h2>Training & Development Management</h2>

      <input
        placeholder="Employee Name"
        value={employee}
        onChange={e => setEmployee(e.target.value)}
      />
      <input
        placeholder="Training Name"
        value={trainingName}
        onChange={e => setTrainingName(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option>Assigned</option>
        <option>Completed</option>
      </select>
      <label style={{ marginLeft: 10 }}>
        <input
          type="checkbox"
          checked={mandatory}
          onChange={e => setMandatory(e.target.checked)}
        /> Mandatory
      </label>
      <input
        placeholder="Effectiveness Score"
        value={score}
        onChange={e => setScore(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <button onClick={handleAdd} style={{ marginLeft: 10 }}>Add Training</button>

      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Training</th>
            <th>Status</th>
            <th>Mandatory</th>
            <th>Effectiveness</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map(t => (
            <tr key={t._id}>
              <td>{t.employee}</td>
              <td>{t.trainingName}</td>
              <td>{t.status}</td>
              <td>{t.mandatory}</td>
              <td>{t.score}</td>
              <td>
                <button onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Training;
