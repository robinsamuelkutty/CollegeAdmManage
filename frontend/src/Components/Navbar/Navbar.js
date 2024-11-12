import React, { useRef } from "react";
import "./Navbar.css";
import logo from "../../images/logo.png";
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from "react-router-dom";

function Navbar({ admin }) {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  return (
    <header>
      <img className="logo" src={logo} alt="Your Logo" />
      <h1>ADMIN PANEL</h1>
      <nav ref={navRef}>
        <Link to="/adminHome">Home</Link>
        <Link
          to={{
            pathname: "/studentPage",
            state: { admin }
          }}
        >
          Students
        </Link>
        <Link
          to={{
            pathname: "/teacherList",
            state: { admin }
          }}
        >
          Teachers
        </Link>
        <Link
          to={{
            pathname: "/classtutor",
            state: { admin }
          }}
        >
          Class Tutors
        </Link>
        <button
          className="nav-btn nav-close-btn"
          onClick={showNavbar}
        >
          <FaTimes />
        </button>
      </nav>
      <button
        className="nav-btn"
        onClick={showNavbar}
      >
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
