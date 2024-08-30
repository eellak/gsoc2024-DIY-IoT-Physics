import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Import Firebase auth

const Navbar = ({ user }: { user: any }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-current border-b border-gray-700">
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
        <div className="hidden lg:flex lg:items-center lg:w-auto">
          <ul className="flex flex-col lg:flex-row lg:space-x-6 text-white">
            <li className="m-3">
              <Link to="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li className="m-3">
              <a href="#" className="hover:text-gray-400">
                Contact Us
              </a>
            </li>
            <li className="m-3">
              <a href="https://gfoss.eu/" className="hover:text-gray-400">
                About
              </a>
            </li>
            {user ? (
              <>
                <li className="m-3 text-white">Welcome, {user.email}</li>
                <li className="m-1">
                  <button
                    onClick={handleLogout}
                    className="btn bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
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
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
