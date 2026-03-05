import './Header.css';
import { useState } from "react";

function Header({ setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header id="nav-bar">
      <div id="left-icons">
        <img src="/src/assets/logos/TMU.svg" alt="TMU Logo" />
        <h1>TMU EVENTS</h1>
      </div>

      <nav id="right-icons">

        <div className="nav-links-desktop">
          <img src="/src/assets/icons/home.svg" alt="Home Button" onClick={() => {setPage("home");}}/>
          <img src="/src/assets/icons/profile.svg" alt="Profile Button" />
        </div>

        <div className="menu-container">
          <a className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <img src="/src/assets/icons/hamburger_menu.svg" alt="Menu" />
          </a>

          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <a onClick={() => {setPage("home");}}> Home </a>
            <a> Profile </a>
          </div>
        </div>

      </nav>
    </header>
  );
}

export default Header;