import { useState } from 'react';
import API from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '', fullname: '', country: '' });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', formData) ;
      if (res.status === 201) {
        alert('Signup successful! Please login.');
      } else {
        alert('Signup failed. Please try again.');
      }
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='signup-container'>
      <form className='reg-form' onSubmit={handleSubmit}>
        <h1 >Signup</h1>
          
        <div className='form-group'>
          <input className="input" name='fullname' placeholder="Full Name" onChange={handleChange} required />
          <input className="input" name='email' placeholder="Email" type="email" onChange={handleChange} required />
          <input className="input" name='password' placeholder="Password" type="password" onChange={handleChange} required />
          <input className="input" name='country' placeholder="Country" onChange={handleChange} required />
          <div>
           <button className='submit-button' type="submit">Signup</button>
          </div>
        </div>
        
        
      </form>
    </div>
  );
}
