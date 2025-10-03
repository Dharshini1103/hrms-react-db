import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Performance = () => {
  const [performances, setPerformances] = useState([]);
  const [employee, setEmployee] = useState('');
  const [goals, setGoals] = useState('');
  const [rating, setRating] = useState('');
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    const res = await axios.get('http://localhost:5000/performances');
    setPerformances(res.data);
  };

  const handleAdd = async () => {
    if (!employee || !goals) return alert('Employee and Goals required');

    const newRecord = {
      employee,
      goals,
      rating: rating || 'Not Rated',
      recommendation: recommendation || 'No Recommendation'
    };

    const res = await axios.post('http://localhost:5000/performances', newRecord);
    setPerformances([...performances, res.data]);

    // Reset form
    setEmployee('');
    setGoals('');
    setRating('');
    setRecommendation('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    await axios.delete(`http://localhost:5000/performances/${id}`);
    setPerformances(performances.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>Performance Management</h2>
      <input placeholder="Employee Name" value={employee} onChange={e => setEmployee(e.target.value)} />
      <input placeholder="Goals / OKRs" value={goals} onChange={e => setGoals(e.target.value)} />
      <input placeholder="Performance Rating" value={rating} onChange={e => setRating(e.target.value)} />
      <input placeholder="Recommendation (Promotion/Training)" value={recommendation} onChange={e => setRecommendation(e.target.value)} />
      <button onClick={handleAdd}>Add Performance</button>

      <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Goals / OKRs</th>
            <th>Rating</th>
            <th>Recommendation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {performances.map(p => (
            <tr key={p._id}>
              <td>{p.employee}</td>
              <td>{p.goals}</td>
              <td>{p.rating}</td>
              <td>{p.recommendation}</td>
              <td>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Performance;
