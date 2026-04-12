import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('skillbridge_role');
  const token = localStorage.getItem('skillbridge_token');

  const handleLogout = () => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_role');
    navigate('/');
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#1F3864',
    color: '#ffffff',
  };

  const linkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '14px',
  };

  const btnStyle = {
    marginLeft: '20px',
    padding: '6px 14px',
    backgroundColor: '#E53E3E',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: '18px', fontWeight: 'bold' }}>
        SkillBridge
      </Link>

      <div>
        {/* Not logged in */}
        {!token && (
          <>
            <Link to="/jobs" style={linkStyle}>Browse Jobs</Link>
            <Link to="/student/login" style={linkStyle}>Student Login</Link>
            <Link to="/student/register" style={linkStyle}>Student Register</Link>
            <Link to="/employer/login" style={linkStyle}>Employer Login</Link>
          </>
        )}

        {/* Student links */}
        {token && role === 'student' && (
          <>
            <Link to="/jobs" style={linkStyle}>Browse Jobs</Link>
            <Link to="/student/profile" style={linkStyle}>My Profile</Link>
            <button style={btnStyle} onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* Employer links */}
        {token && role === 'employer' && (
          <>
            <Link to="/employer/dashboard" style={linkStyle}>Post Job</Link>
            <button style={btnStyle} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;