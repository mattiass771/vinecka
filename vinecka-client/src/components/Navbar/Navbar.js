import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import logo from "./logo.png"

import {FiShoppingCart} from "react-icons/fi"

// Navbar.js
export default ({ isLoggedIn, handleLogOut, userName }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0); 
  const [visible, setVisible] = useState(true);

  const navbarStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    width: '100%',
    zIndex: '+8',
  }

  const logoStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    zIndex: '+9',
  }

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 50);
    setPrevScrollPos(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <React.Fragment>
      <div className="text-center w-100" style={{...logoStyles, top: visible ? '0' : '-156px', borderBottom: "1px solid whitesmoke"}} bg="dark" variant="dark" expand="md">
        <img
          alt=""
          src={logo}
          width="auto"
          height="100"
        />
      </div>
    <Navbar className="justify-content-center" style={{...navbarStyles, top: visible ? '0' : '-156px', paddingTop: '108px'}} bg="dark" variant="dark" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="row justify-content-lg-center">
        <Nav className="ml-4 ml-md-0">
          <Nav.Link className="navihover" active>
            <Link className="navilink" to="/">
              Domov
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover" active>
            <Link className="navilink" to="/vinarne">
              Vinarne
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink" to="/vinka">
                Vinka
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink" to="/akcie">
              Akcie
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink" to="/sluzby">
              Sluzby
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink" to="/kontakt">
              Kontakt
            </Link>
          </Nav.Link>
        </Nav>
        <Nav style={{position: "absolute", right: 16}}>
            <Nav.Link className="navihover">
              <Link className="navilink" to="/cart-page">
                <FiShoppingCart />
              </Link> 
            </Nav.Link>
          {isLoggedIn ? (
            <>
              <Nav.Link className="navihover">
                <Link className="navilink" to="/objednavky">
                  Objednavky
                </Link>
              </Nav.Link>
              <Nav.Link className="navihover">
                <Link className="navilink" onClick={handleLogOut} to="">
                Logout
                </Link>
              </Nav.Link>
            </>
          ) : (
            <Nav.Link className="navihover">
              <Link className="navilink" to="/login-page">
                Login
              </Link>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </React.Fragment>
  );
};
