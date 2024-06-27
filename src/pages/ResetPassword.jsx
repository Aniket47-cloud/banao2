import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); // Assuming you have a route that provides the token

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
        password});
      
      setMessage(response.data.message || 'Password reset successful.');

      // Clear form fields after successful reset
      setPassword('');
      setConfirmPassword('');
      
      // Navigate to the login page after a short delay to show success message
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
    navigate('/login');
  };

  return (
    <div className="w-100 h-100  d-flex flex-column mt-5 align-items-center justify-content-center">
      <h2>Reset Password</h2>
      <div className="d-flex border rounded-lg mt-5 shadow-lg w-75  justify-content-between gap-32" style={{height:"400px"}} >
      <form className="mt-5" onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          
        </div>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <img  style={{width:"400px"}} src="/images/form.svg"/>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
