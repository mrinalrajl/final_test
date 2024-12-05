import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SlideNotify from './SlideNotify/SlideNotify';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [notification, setNotification] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, firstName, lastName }),
      });

      if (response.ok) {
        setNotification('You have Successfully Signed UP! Please login.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 5000);
      } else {
        const errorResponse = await response.json();
        console.error('Sign Up failed:     ', errorResponse.error);
        alert('Sign Up failed. Please try again.     ');
        setNotification('Sign Up failed. Please try again.      ');
      }
    } catch (error) {
      console.error('Error during registration:  ', error);
      alert('Sign Up failed. Please try again.   ');
    }
  }; 
  

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
            <label style={styles.label}>Username</label>
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <label style={styles.label}>Password</label>
          </div>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={styles.input}
              required
            />
            <label style={styles.label}>First Name</label>
          </div>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.input}
              required
            />
            <label style={styles.label}>Last Name</label>
          </div>
          <button type="button" onClick={handleRegister} style={styles.button}>
            Sign Up
          </button>
        </form>
        <Link to="/login" style={styles.loginLink}>
          Already have an account? Log In
        </Link>
      </div>
      <SlideNotify message={notification} onClose={() => setNotification('')} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
  },
  card: {
    background: 'white',
    borderRadius: '3.7rem',
    padding: '35px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
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
    gap: '25px',
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
    fontSize: '18px',
    color: '#999',
    pointerEvents: 'none',
    transition: '0.2s ease all',
  },
  button: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loginLink: {
    display: 'block',
    marginTop: '22px',
    textAlign: 'center',
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'color 1.2s',
  },
};

export default RegisterPage;