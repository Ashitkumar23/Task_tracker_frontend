import { useState } from 'react';
import API from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token); // Store token in local storage
        navigate('/dashboard'); // Redirect to dashboard on successful login
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className='input-group'>
          <input className="input" name='email' placeholder="Email" type="email" onChange={handleChange} required />
          <input className="input" name='password' placeholder="Password" type="password" onChange={handleChange} required />
          <button className='login-button' type="submit">Login</button>
        </div>
      </form>
    </div>
    
  );
}
