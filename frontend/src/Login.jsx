import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      toast.success("Login successful!");
      setTimeout(() => { navigate('/'); }, 1000);
    } catch (error) {
      localStorage.removeItem('token');
      toast.error("Invalid credentials");
    }
  };

  return (
    // Deep dark blue-gray background
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Form card uses a slightly lighter deep-blue tone */}
      <form onSubmit={handleSubmit} className="bg-[#1e293b] p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-700">
        <h2 className="text-2xl font-bold mb-8 text-white text-center tracking-tight">Welcome Back</h2>
        
        <input 
          type="email" placeholder="Email Address" 
          className="w-full p-4 mb-4 bg-[#334155] border border-slate-600 text-white rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-slate-400" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} required 
        />
        
        <input 
          type="password" placeholder="Password" 
          className="w-full p-4 mb-8 bg-[#334155] border border-slate-600 text-white rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-slate-400" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} required 
        />
        
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all shadow-md active:scale-95">
          Login
        </button>
        
        <p className="text-sm text-slate-400 text-center mt-6">
          Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;