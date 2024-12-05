import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.accessToken) {
          handleToken(userData.accessToken);

          const decodedToken = decodeToken(userData.accessToken);

          if (decodedToken && decodedToken.userId) {
            const userId = decodedToken.userId;
            const firstname = userData.firstname;

            localStorage.setItem('userId', userId);
            localStorage.setItem('firstname', firstname);

            // Use navigate instead of the alert to redirect to the homepage
            navigate('/dashboard');
          } else {
            console.error('User ID not found in decoded token:', decodedToken);
            toast.error('Invalid login credentials', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        } else {
          console.error('Access token not found in server response:', userData);
        }
      } else {
        // Use toast instead of alert for a better user experience
        toast.error('Invalid login credentials', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleToken = (token) => {
    // Set the token in local storage
    localStorage.setItem("token", token);
  
    // Set the expiration time (e.g., 1 minute from now)
    const expirationTime = new Date().getTime() + 60 * 1000; // 1 minute
    localStorage.setItem("tokenExpiration", expirationTime);
  };
  
  const decodeToken = (token) => {
    try {
      const decodedString = atob(token.split('.')[1]);
      const decodedObject = JSON.parse(decodedString);
      return decodedObject;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
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
        <h2 style={styles.heading}>Welcome Back!!</h2>
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
            <label style={{
              ...styles.label,
              top: username ? '-20px' : '10px',
              fontSize: username ? '12px' : '16px',
              color: username ? '#667eea' : '#999',
            }}>
              Username
            </label>
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoComplete="current-password"
              required
            />
            <label style={{
              ...styles.label,
              top: password ? '-20px' : '10px',
              fontSize: password ? '12px' : '16px',
              color: password ? '#667eea' : '#999',
            }}>
              Password
            </label>
          </div>
          <button type="button" onClick={handleLogin} style={styles.button}>
            Login
          </button>
          <ToastContainer />
        </form>
        <Link to="/Register" style={styles.registerLink}>
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;