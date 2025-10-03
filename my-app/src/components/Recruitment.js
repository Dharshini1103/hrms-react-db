import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';  // 👈 only define once

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [jobForm, setJobForm] = useState({ title: '', department: '', description: '' });
  const [candidateForm, setCandidateForm] = useState({ name: '', email: '', position: '', status: 'Applied', interviewDate: '', notes: '' });

  // Fetch data when component mounts
  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  // ✅ Use BASE_URL here
  const fetchJobs = async () => {
    const res = await axios.get(`${BASE_URL}/jobs`);
    setJobs(res.data);
  };

  const fetchCandidates = async () => {
    const res = await axios.get(`${BASE_URL}/candidates`);
    setCandidates(res.data);
  };

  const handleAddJob = async () => {
    if (!jobForm.title || !jobForm.department) return alert('Job title & department required');
    const res = await axios.post(`${BASE_URL}/jobs`, jobForm);
    setJobs([...jobs, res.data]);
    setJobForm({ title: '', department: '', description: '' });
  };

  const handleAddCandidate = async () => {
    if (!candidateForm.name || !candidateForm.email || !candidateForm.position) return alert('Candidate name, email & position required');
    const res = await axios.post(`${BASE_URL}/candidates`, candidateForm);
    setCandidates([...candidates, res.data]);
    setCandidateForm({ name: '', email: '', position: '', status: 'Applied', interviewDate: '', notes: '' });
  };

  const updateStatus = async (id, newStatus) => {
    await axios.put(`${BASE_URL}/candidates/${id}`, { status: newStatus });
    fetchCandidates();
  };

  const scheduleInterview = async (id, date, notes) => {
    await axios.put(`${BASE_URL}/candidates/${id}`, { interviewDate: date, notes });
    fetchCandidates();
  };

  return (
    <div>
      <h2>Recruitment</h2>

      {/* Job Posting */}
      <div style={{ marginBottom: 20, border: '1px solid #ddd', padding: 10 }}>
        <h3>Post Job Opening</h3>
        <input placeholder="Job Title" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} />
        <input placeholder="Department" value={jobForm.department} onChange={e => setJobForm({ ...jobForm, department: e.target.value })} />
        <input placeholder="Description" value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} />
        <button onClick={handleAddJob}>Add Job</button>

        <ul>
          {jobs.map(job => (
            <li key={job._id}>
              <strong>{job.title}</strong> - {job.department} ({job.description})
            </li>
          ))}
        </ul>
      </div>

      {/* Candidate Applications */}
      <div style={{ marginBottom: 20, border: '1px solid #ddd', padding: 10 }}>
        <h3>Add Candidate</h3>
        <input placeholder="Name" value={candidateForm.name} onChange={e => setCandidateForm({ ...candidateForm, name: e.target.value })} />
        <input placeholder="Email" value={candidateForm.email} onChange={e => setCandidateForm({ ...candidateForm, email: e.target.value })} />
        <select value={candidateForm.position} onChange={e => setCandidateForm({ ...candidateForm, position: e.target.value })}>
          <option value="">Select Job</option>
          {jobs.map(job => (
            <option key={job._id} value={job.title}>{job.title} ({job.department})</option>
          ))}
        </select>
        <button onClick={handleAddCandidate}>Add Candidate</button>
      </div>

      {/* Candidate Table */}
      <h3>Candidate Applications</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#007bff', color: '#fff' }}>
          <tr>
            <th>Name</th><th>Email</th><th>Position</th><th>Status</th><th>Interview</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No candidates yet</td></tr>}
          {candidates.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.position}</td>
              <td>{c.status}</td>
              <td>{c.interviewDate ? `${c.interviewDate} (${c.notes})` : 'Not scheduled'}</td>
              <td>
                <button onClick={() => updateStatus(c._id, 'Shortlisted')}>Shortlist</button>
                <button onClick={() => updateStatus(c._id, 'Hired')}>Hire</button>
                <button onClick={() => updateStatus(c._id, 'Rejected')}>Reject</button>
                <br />
                <input type="date" onChange={(e) => scheduleInterview(c._id, e.target.value, c.notes || '')} />
                <input placeholder="Notes" value={c.notes || ''} onChange={(e) => scheduleInterview(c._id, c.interviewDate || '', e.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recruitment;
