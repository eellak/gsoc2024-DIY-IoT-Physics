import React, { useState } from "react";
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaBriefcase,
  FaSchool,
  FaLock,
} from "react-icons/fa";

const SignUp = () => {
  const [studentType, setStudentType] = useState("collegeStudent");
  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    email: "",
    college: "",
    purpose: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateField = (field: string, value: string) => {
    if (value.trim() === "") {
      alert(`Please fill out the ${field} field.`);
      return false;
    }
    return true;
  };

  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fieldsToValidate = [
      { field: "username", value: formData.username },
      { field: "dob", value: formData.dob },
      { field: "email", value: formData.email },
      { field: "college", value: formData.college },
      { field: "purpose", value: formData.purpose },
      { field: "password", value: formData.password },
      { field: "confirmPassword", value: formData.confirmPassword },
    ];

    const allFieldsValid = fieldsToValidate.every(({ field, value }) =>
      validateField(field, value)
    );
    const passwordsMatch = validatePasswordMatch();

    if (allFieldsValid && passwordsMatch) {
      alert("Form submitted successfully! Wait for admin approval.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url(./images/lab_bg.jpg)" }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full m-6">
        <div className="text-center mt-4 ring-2 bg-yellow-100 ring-red-400">
          <p className="text-gray-600 m-3">
            If you are a school student, use your class code to  <Link to="/signin" className="text-blue-600 hover:underline">
            login.
            </Link>
          </p>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-center">
          Join the Adventure!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create your account and start exploring!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">I am a</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="collegeStudent"
                  checked={studentType === "collegeStudent"}
                  onChange={() => setStudentType("collegeStudent")}
                  className="mr-2"
                />
                College Student
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="teacher"
                  checked={studentType === "teacher"}
                  onChange={() => setStudentType("teacher")}
                  className="mr-2"
                />
                Teacher
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={(e) => validateField("full name", e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-700 font-bold mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 ml-3 mr-2" />
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                onBlur={(e) => validateField("date of birth", e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaEnvelope className="text-gray-400 ml-3 mr-2" />
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={(e) => validateField("email", e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="college"
              className="block text-gray-700 font-bold mb-2"
            >
              {studentType === "collegeStudent"
                ? "College Name"
                : "College or University"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaSchool className="text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                id="college"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder={`Enter your ${
                  studentType === "collegeStudent"
                    ? "college"
                    : "college or university"
                } name`}
                value={formData.college}
                onChange={handleInputChange}
                onBlur={(e) => validateField("college", e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaLock className="text-gray-400 ml-3 mr-2" />
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={(e) => validateField("password", e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-bold mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaLock className="text-gray-400 ml-3 mr-2" />
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={(e) =>
                  validateField("confirm password", e.target.value)
                }
              />
            </div>
            <div className="mb-4 mt-4">
            <label
              htmlFor="purpose"
              className="block text-gray-700 font-bold mb-2"
            >
              Purpose to Use Lab <span className="text-red-500">*</span>
            </label>
            <textarea
              id="purpose"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Explain your purpose to use the lab"
              value={formData.purpose}
              onChange={handleInputChange}
              onBlur={(e) =>
                validateField("purpose to use lab", e.target.value)
              }
              rows={3}
            ></textarea>
          </div>
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
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Log in here!
            </Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
