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

  const limit = Math.max( 
    document.body.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.clientHeight, 
    document.documentElement.scrollHeight, 
    document.documentElement.offsetHeight 
    );


  const navbarStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    width: '100%',
    zIndex: '+2',
    backgroundColor: '#373f27',
    fontSize: '120%'
  }

  const logoStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    zIndex: '+3',
  }

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if ((limit - currentScrollPos) < 1100 && currentScrollPos > 50) setVisible(false)
    else {
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 50 );
    }
    setPrevScrollPos(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <React.Fragment>
      <div className="text-center w-100" style={{...logoStyles, top: visible ? '0' : '-156px', borderBottom: "1px solid whitesmoke"}}>
        <img
          alt=""
          src={logo}
          width="auto"
          height="100"
        />
      </div>
    <Navbar className="justify-content-center" style={{...navbarStyles, top: visible ? '0' : '-156px', paddingTop: '108px'}} variant="dark" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="row justify-content-lg-center">
        <Nav className="ml-4 ml-md-0">
          <Nav.Link className="navihover" active>
            <Link className="navilink pt-4 pb-3 mr-lg-4 ml-lg-4" to="/">
              Domov
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover" active>
            <Link className="navilink pt-3 pb-3 mr-lg-4 ml-lg-4" to="/vinarne">
              Vinarne
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink pt-3 pb-3 mr-lg-4 ml-lg-4" to="/vinka">
                Vinka
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink pt-3 pb-3 mr-lg-4 ml-lg-4" to="/akcie">
              Akcie
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink pt-3 pb-3 mr-lg-4 ml-lg-4" to="/sluzby">
              Sluzby
            </Link>
          </Nav.Link>

          <Nav.Link className="navihover">
            <Link className="navilink pt-3 pb-3 mr-lg-4 ml-lg-4" to="/kontakt">
              Kontakt
            </Link>
          </Nav.Link>
        </Nav>
        <Nav style={{position: "absolute", right: 16}}>
            <Nav.Link className="navihover">
              <Link className="navilink pt-3 pb-3" to="/cart-page">
                <FiShoppingCart />
              </Link> 
            </Nav.Link>
          {isLoggedIn ? (
            <>
              <Nav.Link className="navihover">
                <Link className="navilink pt-3 pb-3" to="/objednavky">
                  Objednavky
                </Link>
              </Nav.Link>
              <Nav.Link className="navihover">
                <Link className="navilink pt-3 pb-3" onClick={handleLogOut} to="">
                Logout
                </Link>
              </Nav.Link>
            </>
          ) : (
            <Nav.Link className="navihover">
              <Link className="navilink pt-3 pb-3" to="/login-page">
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
