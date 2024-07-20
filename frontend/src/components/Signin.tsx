import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, query, where, collection } from "firebase/firestore";

const SignIn: React.FC = () => {
  const [userType, setUserType] = useState<"schoolStudent" | "teacherCollege">("teacherCollege");
  const [formData, setFormData] = useState({ usernameOrEmail: "", passwordOrCode: "" });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userType === "schoolStudent") {
      try {
        // Fetch user with the given username and school code
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", formData.usernameOrEmail), where("schoolCode", "==", formData.passwordOrCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Invalid username or school code.");
          return;
        }

        // Get the user's email from the fetched document
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Sign in using email and school code (as a password)
        await signInWithEmailAndPassword(auth, userData.email, formData.passwordOrCode);
        alert("Login successful!");
      } catch (error: any) {
        console.error("Error signing in: ", error);
        alert("Error signing in: " + error.message);
      }
    } else {
      try {
        // Sign in using email and password
        await signInWithEmailAndPassword(auth, formData.usernameOrEmail, formData.passwordOrCode);
        alert("Login successful!");
      } catch (error: any) {
        console.error("Error signing in: ", error);
        alert("Error signing in: " + error.message);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url(./images/lab_bg.jpg)" }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">
          Ready to dive into the fun?
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">I am a</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="schoolStudent"
                  checked={userType === "schoolStudent"}
                  onChange={() => setUserType("schoolStudent")}
                  className="mr-2"
                />
                School Student
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="teacherCollege"
                  checked={userType === "teacherCollege"}
                  onChange={() => setUserType("teacherCollege")}
                  className="mr-2"
                />
                Teacher/College Student
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="usernameOrEmail"
              className="block text-gray-700 font-bold mb-2"
            >
              Username or Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                id="usernameOrEmail"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                placeholder="Enter your username or email"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {userType === "teacherCollege" ? (
            <div className="mb-6">
              <label
                htmlFor="passwordOrCode"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaLock className="text-gray-400 ml-3 mr-2" />
                <input
                  type="password"
                  id="passwordOrCode"
                  className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                  placeholder="Enter your password"
                  value={formData.passwordOrCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label
                htmlFor="passwordOrCode"
                className="block text-gray-700 font-bold mb-2"
              >
                School Code
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaLock className="text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  id="passwordOrCode"
                  className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                  placeholder="Enter your school code"
                  value={formData.passwordOrCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
