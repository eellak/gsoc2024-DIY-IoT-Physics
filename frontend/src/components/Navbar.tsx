import React from "react";
import "../assets/css/style.css";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid ">
        <a className="navbar-brand" href="#">
          <img
            src="./public/images/gfoss.png"
            alt="GFOSS"
            width="210"
            height="55"
          />
        </a>
        <a className="navbar-brand justify-content-center text-capitalize text-center fs-4" href="#">
          Welcome to IoT Physics Lab!
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto mb-2 mb-lg-0 ">
            <li className="nav-item ">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                About
              </a>
            </li>
            {/* <button type="button" className="btn btn-primary position-relative">
              Info{" "}
              <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2">
                <span className="visually-hidden">unread messages</span>
              </span>
            </button> */}
            <button className="btn btn-outline-primary me-2" type="button">
              Signin
            </button>
            <button className="btn btn-outline-warning me-2" type="button">
              Signup
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
