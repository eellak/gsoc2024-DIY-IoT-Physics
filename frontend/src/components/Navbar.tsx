import { Link } from 'react-router-dom';
import "../App.css";
import { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-current border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center">
          <img
            src="./images/gfoss.png"
            alt="GFOSS"
            className="object-cover border rounded w-52"
          />
        </Link>
        <div className="text-center flex-grow hidden lg:block">
          <p className="text-white text-2xl hover:text-3xl font-semibold">
            Welcome to IoT Physics Lab!
          </p>
        </div>
        <button
          className="lg:hidden text-white focus:outline-none"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M3 6h18M3 12h18M3 18h18" clipRule="evenodd" />
          </svg>
        </button>
        <div className={`${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto`}>
          <ul className="flex flex-col lg:flex-row lg:space-x-6 text-white">
            <li className="m-3">
              <Link to="/" className="hover:text-gray-400">Home</Link>
            </li>
            <li className="m-3">
              <a href="#" className="hover:text-gray-400">Contact Us</a>
            </li>
            <li className="m-3">
              <a href="https://gfoss.eu/" className="hover:text-gray-400">About</a>
            </li>
            <li className="m-1">
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full lg:w-auto">
                <Link to="/signup">Sign Up</Link>
              </button>
            </li>
            <li className="m-1">
              <button className="btn bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded w-full lg:w-auto">
                <Link to="/signin">Sign In</Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
