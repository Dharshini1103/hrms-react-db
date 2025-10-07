// ================== Import Dependencies ==================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ================== App Setup ==================
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow large JSON payloads

// ================== MongoDB Connection ==================
mongoose
  .connect("mongodb://127.0.0.1:27017/hrms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(" MongoDB connection error:", err));

// ================== Schemas ==================

// Employee
const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  department: String,
  manager: String,
  phone: String,
  address: String,
  emergency: String,
  status: { type: String, default: "active" },
  document: String,
  documentName: String,
});
const Employee = mongoose.model("Employee", EmployeeSchema);

// Candidate
const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  position: String,
  status: { type: String, default: "Applied" },
  interviewDate: String,
  notes: String,
});
const Candidate = mongoose.model("Candidate", CandidateSchema);

// Attendance
const AttendanceSchema = new mongoose.Schema({
  employee: String,
  date: String,
  clockIn: String,
  clockOut: String,
});
const Attendance = mongoose.model("Attendance", AttendanceSchema);

// Shift
const ShiftSchema = new mongoose.Schema({
  employee: String,
  shift: String,
  start: String,
  end: String,
});
const Shift = mongoose.model("Shift", ShiftSchema);

// Leave
const LeaveSchema = new mongoose.Schema({
  employee: String,
  from: String,
  to: String,
  reason: String,
  status: { type: String, default: "Pending" },
  attendance: { type: String, default: "N/A" },
});
const Leave = mongoose.model("Leave", LeaveSchema);

// Payroll
const PayrollSchema = new mongoose.Schema({
  employee: String,
  basic: Number,
  bonus: Number,
  attendanceImpact: Number,
  deductions: Number,
  tax: Number,
  total: Number,
});
const Payroll = mongoose.model("Payroll", PayrollSchema);

// Performance
const PerformanceSchema = new mongoose.Schema({
  employee: String,
  goals: String,
  rating: { type: String, default: "Not Rated" },
  recommendation: { type: String, default: "No Recommendation" },
});
const Performance = mongoose.model("Performance", PerformanceSchema);

// Training
const TrainingSchema = new mongoose.Schema({
  employee: String,
  trainingName: String,
  status: { type: String, default: "Assigned" },
  mandatory: { type: String, default: "No" },
  score: { type: String, default: "Not Evaluated" },
});
const Training = mongoose.model("Training", TrainingSchema);

// Job
const JobSchema = new mongoose.Schema({
  title: String,
  department: String,
  description: String,
});
const Job = mongoose.model("Job", JobSchema);

// Request
const RequestSchema = new mongoose.Schema({
  employee: String,
  request: String,
  status: { type: String, default: "Pending" },
  attendance: { type: String, default: "N/A" },
});
const Request = mongoose.model("Request", RequestSchema);

// ================== Routes ==================

// Employees
app.get("/employees", async (req, res) => res.json(await Employee.find()));
app.post("/employees", async (req, res) => res.json(await Employee.create(req.body)));
app.put("/employees/:id", async (req, res) =>
  res.json(await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Candidates
app.get("/candidates", async (req, res) => res.json(await Candidate.find()));
app.post("/candidates", async (req, res) => res.json(await Candidate.create(req.body)));
app.put("/candidates/:id", async (req, res) =>
  res.json(await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/candidates/:id", async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Attendance
app.get("/attendance", async (req, res) => res.json(await Attendance.find()));
app.post("/attendance", async (req, res) => res.json(await Attendance.create(req.body)));
app.put("/attendance/:id", async (req, res) =>
  res.json(await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/attendance/:id", async (req, res) => {
  await Attendance.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Shifts
app.get("/shifts", async (req, res) => res.json(await Shift.find()));
app.post("/shifts", async (req, res) => res.json(await Shift.create(req.body)));
app.put("/shifts/:id", async (req, res) =>
  res.json(await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/shifts/:id", async (req, res) => {
  await Shift.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Leaves
app.get("/leaves", async (req, res) => res.json(await Leave.find()));
app.post("/leaves", async (req, res) => res.json(await Leave.create(req.body)));
app.put("/leaves/:id", async (req, res) =>
  res.json(await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/leaves/:id", async (req, res) => {
  await Leave.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Payroll
app.get("/payrolls", async (req, res) => res.json(await Payroll.find()));
app.post("/payrolls", async (req, res) => res.json(await Payroll.create(req.body)));
app.put("/payrolls/:id", async (req, res) =>
  res.json(await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/payrolls/:id", async (req, res) => {
  await Payroll.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Performance
app.get("/performances", async (req, res) => res.json(await Performance.find()));
app.post("/performances", async (req, res) => res.json(await Performance.create(req.body)));
app.put("/performances/:id", async (req, res) =>
  res.json(await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/performances/:id", async (req, res) => {
  await Performance.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Training
app.get("/trainings", async (req, res) => res.json(await Training.find()));
app.post("/trainings", async (req, res) => res.json(await Training.create(req.body)));
app.put("/trainings/:id", async (req, res) =>
  res.json(await Training.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/trainings/:id", async (req, res) => {
  await Training.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Jobs
app.get("/jobs", async (req, res) => res.json(await Job.find()));
app.post("/jobs", async (req, res) => res.json(await Job.create(req.body)));
app.put("/jobs/:id", async (req, res) =>
  res.json(await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/jobs/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Requests
app.get("/requests", async (req, res) => res.json(await Request.find()));
app.post("/requests", async (req, res) => res.json(await Request.create(req.body)));
app.put("/requests/:id", async (req, res) =>
  res.json(await Request.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
app.delete("/requests/:id", async (req, res) => {
  await Request.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ================== Start Server ==================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
