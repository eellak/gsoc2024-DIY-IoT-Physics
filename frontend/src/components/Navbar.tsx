
import React from 'react';
import '../assets/css/style.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="https://github.com/eellak/gsoc2024-DIY-IoT-Physics/blob/test/assets/img/gfoss.png" alt="Logo" />
      </div>
      <div className="navbar-text">
        Welcome To Lab !
      </div>
      <div className="navbar-buttons">
        <button className="btn-signin">Sign In</button>
        <button className="btn-signup">Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;
