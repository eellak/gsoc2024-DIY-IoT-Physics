import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 ">
    {/* <footer className="bg-gray-800 text-white py-8 fixed bottom-0 left-0 right-0"> */}
      <div className="container mx-auto px-6 h-15" >
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h5 className="text-xl font-semibold mb-4">About</h5>
            <p className="text-gray-400">Learn more about our project and the team behind it.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">Contact Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">About</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">GitHub</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h5 className="text-xl font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-300">
                <FaFacebook size="24" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <FaGithub size="24" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <FaLinkedin size="24" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-2 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} IoT Physics Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

