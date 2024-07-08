import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
// Photo by <a href="https://unsplash.com/@zoltantasi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Zoltan Tasi</a> on <a href="https://unsplash.com/photos/red-light-ball-illustration-6vEqcR8Icbs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

const Login = () => {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(./images/lab_bg.jpg)' }}>
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Ready to dive into the fun?</p>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Username or Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="text-gray-400 ml-3" />
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your username or email"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaLock className="text-gray-400 ml-3" />
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Sign up now!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
