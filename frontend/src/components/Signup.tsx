import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaBriefcase, FaSchool, FaLock } from 'react-icons/fa';
// Photo by <a href="https://unsplash.com/@zoltantasi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Zoltan Tasi</a> on <a href="https://unsplash.com/photos/red-light-ball-illustration-6vEqcR8Icbs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  

const SignUp = () => {
  const [dob, setDob] = useState('');

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(./images/lab_bg.jpg)' }}>
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Join the Adventure!</h2>
        <p className="text-center text-gray-600 mb-6">Create your account and start exploring!</p>
        <form>
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 font-bold mb-2">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="text-gray-400 ml-3" />
              <input
                type="text"
                id="fullname"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaEnvelope className="text-gray-400 ml-3" />
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-700 font-bold mb-2">
              Date of Birth
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 ml-3" />
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="occupation" className="block text-gray-700 font-bold mb-2">
              Occupation
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaBriefcase className="text-gray-400 ml-3" />
              <select
                id="occupation"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
              >
                <option value="">Select your occupation</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="college" className="block text-gray-700 font-bold mb-2">
              College Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaSchool className="text-gray-400 ml-3" />
              <input
                type="text"
                id="college"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your college name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="purpose" className="block text-gray-700 font-bold mb-2">
              Purpose to Use Lab
            </label>
            <textarea
              id="purpose"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Explain your purpose to use the lab"
              rows={3}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Log in here!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
