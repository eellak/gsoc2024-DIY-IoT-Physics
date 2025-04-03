import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-black-900/95 backdrop-blur-sm shadow-lg py-2"
      : "bg-[rgba(0,0,0,0.95)] py-2"
  }`;

  const linkClasses =
    "relative px-3 py-2 text-white hover:text-yellow-200 transition-colors duration-300";
  const activeLinkClasses = "text-yellow-300 font-medium";

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                src="./images/gfoss.png"
                alt="GFOSS"
                className="h-12 w-auto object-contain rounded border border-indigo-300/30 transition-all duration-300 group-hover:border-yellow-300/50 group-hover:shadow-glow"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <h1 className="text-white text-2xl font-bold transition-all duration-500 hover:text-yellow-300">
                Welcome to IoT Physics Lab!
              </h1>
            </motion.div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className={`${linkClasses} ${
                  isActiveLink("/") ? activeLinkClasses : ""
                }`}
              >
                Home
                {isActiveLink("/") && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300"
                  />
                )}
              </Link>

              <Link
                to="/contact"
                className={`${linkClasses} ${
                  isActiveLink("/contact") ? activeLinkClasses : ""
                }`}
              >
                Contact Us
                {isActiveLink("/contact") && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300"
                  />
                )}
              </Link>

              <a
                href="https://gfoss.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                About
              </a>

              {user ? (
                <div className="flex items-center space-x-4 ml-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center px-3 py-1 bg-indigo-700/50 rounded-full"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-400 text-indigo-900 flex items-center justify-center mr-2">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium truncate max-w-xs">
                      {user.email}
                    </span>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 font-medium"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 font-medium"
                  >
                    <Link to="/signup">Sign Up</Link>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 font-medium"
                  >
                    <Link to="/signin">Sign In</Link>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <div className="mr-8 text-center">
              <h1 className="text-white text-lg font-semibold">IoT Lab</h1>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-indigo-800 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-white font-medium hover:bg-indigo-700 hover:text-yellow-300"
              >
                Home
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-white font-medium hover:bg-indigo-700 hover:text-yellow-300"
              >
                Contact Us
              </Link>
              <a
                href="https://gfoss.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-white font-medium hover:bg-indigo-700 hover:text-yellow-300"
              >
                About
              </a>

              {user ? (
                <>
                  <div className="px-3 py-2 text-white">
                    <span className="block font-medium text-yellow-300">
                      Signed in as:
                    </span>
                    <span className="block mt-1">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-white font-medium bg-indigo-600 hover:bg-indigo-700 text-center"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/signin"
                    className="block px-3 py-2 rounded-md text-white font-medium bg-yellow-500 hover:bg-yellow-600 text-center mt-2"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
