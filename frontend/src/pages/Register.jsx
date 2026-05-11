import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { assets } from '../assets/assest.js'
import { UserContext } from '../context/userContext.jsx';

const Auth = () => {
  const {login, register} = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isLogin) {
        await login(email, password, navigate);
      } else {
        await register(name, email, password);
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    }
  };
  

  return (
    <>
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-600">
      
      {/* Left */}
      <div className="flex-1 flex justify-center items-center">
        <img 
          src={assets.logo} 
          alt="Auth" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain"
        />
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 dark:bg-gray-800 dark:text-white">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {isLogin ? "Welcome back!" : "Welcome to our community!"}
        </h1>

        <p className="text-gray-500 mb-6 text-center">
          {isLogin 
            ? "Login to continue chatting." 
            : "Join us and be a part of an amazing journey."
          }
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Username" 
              required
              className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-slate-500"
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input 
            type="email" 
            placeholder="Email" 
            required
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-slate-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="Password" 
            required
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-slate-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button 
            type="submit"
            className="mt-2 bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-600 font-semibold cursor-pointer hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
    </>
  )
}

export default Auth
