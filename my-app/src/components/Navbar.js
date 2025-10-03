import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/employees">Employees</Link>
    <Link to="/recruitment">Recruitment</Link>
    <Link to="/attendance">Attendance</Link>
    <Link to="/payroll">Payroll</Link>
    <Link to="/performance">Performance</Link>
    <Link to="/training">Training</Link>
    <Link to="/selfservice">Self-Service</Link>
    <Link to="/reports">Reports</Link>
  </nav>
);

export default Navbar;
