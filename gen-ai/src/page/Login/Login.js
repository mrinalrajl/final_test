import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Username and Password are required.', { position: 'top-center' });
      return;
    }
  
    try {
      const payload = { username, password };
      console.log('Sending payload:', payload); // Debugging log
  
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const userData = await response.json();
  
      if (response.ok) {
        if (userData.token) {
          localStorage.setItem('token', userData.token);
          localStorage.setItem('firstname', userData.firstname);
  
          toast.success(`Welcome ${userData.firstname}!`, { position: 'top-center' });
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          toast.error('Unexpected server response. Please try again.', { position: 'top-center' });
        }
      } else {
        toast.error(userData.message || 'Invalid credentials.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Unable to login. Please try again later.', { position: 'top-center' });
    }
  };
  
  

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    },
    card: {
      background: 'white',
      borderRadius: '10px',
      padding: '40px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    heading: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: '30px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '10px 0',
      fontSize: '16px',
      color: '#333',
      border: 'none',
      borderBottom: '1px solid #ddd',
      outline: 'none',
      background: 'transparent',
      transition: 'border-color 0.2s',
    },
    label: {
      position: 'absolute',
      top: '10px',
      left: '0',
      fontSize: '16px',
      color: '#999',
      pointerEvents: 'none',
      transition: '0.2s ease all',
    },
    button: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    registerLink: {
      display: 'block',
      marginTop: '20px',
      textAlign: 'center',
      color: '#667eea',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back!</h2>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
            <label
              style={{
                ...styles.label,
                top: username ? '-20px' : '10px',
                fontSize: username ? '12px' : '16px',
                color: username ? '#667eea' : '#999',
              }}
            >
              Username
            </label>
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <label
              style={{
                ...styles.label,
                top: password ? '-20px' : '10px',
                fontSize: password ? '12px' : '16px',
                color: password ? '#667eea' : '#999',
              }}
            >
              Password
            </label>
          </div>
          <button type="button" onClick={handleLogin} style={styles.button}>
            Login
          </button>
          <ToastContainer />
        </form>
        <Link to="/register" style={styles.registerLink}>
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
