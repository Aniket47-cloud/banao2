import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './ForgotPassword.css'
import { useNavigate } from "react-router";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const  navigate  = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', email); // Debug log
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      
      console.log('Response:', response.data); // Debug log
      setMessage(response.data.Status || 'Check your email for reset instructions.');
      navigate('/reset-password');
    } catch (error) {
      console.error('Error:', error); // Debug log
      setMessage('An error occurred. Please try again.');
    }
   
  };

  return (
    <div className="w-100 h-100  d-flex flex-column mt-5 align-items-center justify-content-center">
    
      <h2 className="text-2xl text-center font-bold mb-6">Forgot Password</h2>
     <div className="d-flex border rounded-lg mt-5 shadow-lg w-75 h-100 justify-content-between gap-32">
     <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">Email:</span>
          
        </label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full mt-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Submit
        </button>
      </form>
      <img src="/images/form.svg" style={{width:"400px"}}/>
     </div>
      {message && (
        <p className="text-sm text-gray-600 mt-4">{message}</p>
      )}
    </div>
  
  );
};

export default ForgotPassword;
