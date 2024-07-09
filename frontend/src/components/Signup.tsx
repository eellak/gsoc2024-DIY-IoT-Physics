import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaSchool,
  FaLock,
} from "react-icons/fa";

const SignUp: React.FC = () => {
  const [dob, setDob] = useState("");
  const [studentType, setStudentType] = useState<"school" | "college" | "">("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    college: "",
    purpose: "",
    schoolCode: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: false,
    email: false,
    dob: false,
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const errors = {
      username: formData.username === "",
      email: studentType === "college" && formData.email === "",
      dob: dob === "",
      password: formData.password === "",
      confirmPassword: formData.password !== formData.confirmPassword,
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
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
      { field: "dob", value: dob },
      { field: "password", value: formData.password },
      { field: "confirmPassword", value: formData.confirmPassword },
    ];

    if (studentType === "college") {
      fieldsToValidate.push(
        { field: "email", value: formData.email },
        { field: "purpose", value: formData.purpose }
      );
    } else if (studentType === "school") {
      fieldsToValidate.push({
        field: "schoolCode",
        value: formData.schoolCode,
      });
    }

    const allFieldsValid = fieldsToValidate.every(({ field, value }) =>
      validateField(field, value)
    );
    const passwordsMatch = validatePasswordMatch();

    if (allFieldsValid && passwordsMatch) {
      alert("Form submitted successfully! Wait for admin approval.");
    }
  };

  const passwordSuggestions = (
    <ul className="text-xs text-gray-600">
      <li>Use at least 8 characters.</li>
      <li>Include both letters and numbers.</li>
      <li>Add special characters for extra security.</li>
    </ul>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url(./images/lab_bg.jpg)" }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Join the Adventure!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create your account and start exploring!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Are you a school or college student?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="studentType"
                  value="school"
                  onChange={() => setStudentType("school")}
                  checked={studentType === "school"}
                />
                School Student
              </label>
              <label>
                <input
                  type="radio"
                  name="studentType"
                  value="college"
                  onChange={() => setStudentType("college")}
                  checked={studentType === "college"}
                />
                College Student
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="text-gray-400 ml-3" />
              <input
                type="text"
                id="username"
                className={`w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                  formErrors.username ? "border-red-500" : "focus:ring-blue-600"
                } rounded-lg`}
                placeholder="Enter your username"
                onChange={handleInputChange}
                onBlur={(e) => validateField('username', e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-700 font-bold mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaCalendarAlt className="text-gray-400 ml-3" />
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                  formErrors.dob ? "border-red-500" : "focus:ring-blue-600"
                } rounded-lg`}
                onBlur={(e) => validateField('date', e.target.value)}
              />
            </div>
          </div>
          {studentType === "college" ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaEnvelope className="text-gray-400 ml-3" />
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                      formErrors.email
                        ? "border-red-500"
                        : "focus:ring-blue-600"
                    } rounded-lg`}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="college"
                  className="block text-gray-700 font-bold mb-2"
                >
                  College Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaSchool className="text-gray-400 ml-3" />
                  <input
                    type="text"
                    id="college"
                    className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                    placeholder="Enter your college name"
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('text', e.target.value)}
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
                  <FaLock className="text-gray-400 ml-3" />
                  <input
                    type="password"
                    id="password"
                    className={`w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                      formErrors.password
                        ? "border-red-500"
                        : "focus:ring-blue-600"
                    } rounded-lg`}
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('password', e.target.value)}
                  />
                </div>
                {passwordSuggestions}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaLock className="text-gray-400 ml-3" />
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                      formErrors.confirmPassword
                        ? "border-red-500"
                        : "focus:ring-blue-600"
                    } rounded-lg`}
                    placeholder="Confirm your password"
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('confirmPassword', e.target.value)}
                  />
                </div>
                <div className="mb-4">
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
                    rows={3}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('purpose', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </>
          ) : (
            studentType === "school" && (
              <div className="mb-4">
                <label
                  htmlFor="schoolCode"
                  className="block text-gray-700 font-bold mb-2"
                >
                  School Code <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaSchool className="text-gray-400 ml-3" />
                  <input
                    type="text"
                    id="schoolCode"
                    className={`w-full px-3 py-2 focus:outline-none focus:ring-2 ${
                      formErrors.username
                        ? "border-red-500"
                        : "focus:ring-blue-600"
                    } rounded-lg`}
                    placeholder="Enter your school code"
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('schoolCode', e.target.value)}
                  />
                </div>
              </div>
            )
          )}
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
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
