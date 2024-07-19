import { Link } from 'react-router-dom';
import "../App.css";

const Navbar = () => {
  return (
    <nav className="bg-current border-b border-gray-700">
    {/* <nav className="bg-gray-800 border-b border-gray-700 fixed top-0 left-0 right-0"> */}
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center">
          <img
            src="./images/gfoss.png"
            alt="GFOSS"
            className="object-cover border rounded w-52"
          />
        </a>
        <div className="flex-grow text-center">
          <p className="text-white text-2xl hover:text-3xl font-semibold">
            Welcome to IoT Physics Lab!
          </p>
        </div>
        <button
          className="block lg:hidden text-white focus:outline-none"
          type="button"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M3 6h18M3 12h18M3 18h18" clipRule="evenodd" />
          </svg>
        </button>
        <div className="hidden lg:flex lg:items-center lg:w-auto">
          <ul className="flex flex-col lg:flex-row lg:space-x-6 text-white">
            <li className="m-3">
              {/* <a href="#" className="hover:text-gray-300"><Link to="/" className="hover:text-gray-300">Home</Link></a> */}
              <Link to="/" className="hover:text-gray-400">Home</Link>
            </li>
            <li className="m-3">
              <a href="#" className="hover:text-gray-400">Contact Us</a>
            </li>
            <li className="m-3">
              <a href="#" className="hover:text-gray-400">About</a>
            </li>          
            

            <li className="m-1">            
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              <Link to="/signup">Sign Up</Link>
              </button>
            </li>
            <li className="m-1">
              <button className="btn bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded">
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
