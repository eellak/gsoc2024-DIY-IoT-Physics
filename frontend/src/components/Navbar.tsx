import React from "react";
import "../assets/css/style.css";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container">
        <a className="navbar-brand" href="#">
          <img
            src="./images/gfoss.png"
            className="object-fit-cover border rounded" 
            alt="GFOSS"
            width="210"
            height="auto"
          />
        </a>
        <div className="container">
          <p className="navbar-brand text-capitalize text-center fs-3 text-danger-emphasis">
            Welcome to IoT Physics Lab!
          </p>
        </div>

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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 justify-content-end nav-underline nav-fill ">
            <li className="nav-item">
              <a className="nav-link active m-3 " aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active m-3" aria-current="page" href="#">
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active m-3" aria-current="page" href="#">
                About
              </a>
            </li>
            {/* <button type="button" className="btn btn-primary position-relative">
              Info{" "}
              <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2">
                <span className="visually-hidden">unread messages</span>
              </span>
            </button> */}
            <button className="btn btn-outline-primary m-3" type="button">
              Signin
            </button>
            <button className="btn btn-outline-warning m-3" type="button">
              Signup
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
