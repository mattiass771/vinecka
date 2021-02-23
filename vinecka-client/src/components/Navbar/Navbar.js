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
    backgroundColor: '#001402',
    fontSize: '120%'
  }

  const logoStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    zIndex: '+3',
    pointerEvents: 'none'
  }

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if ((limit - currentScrollPos) < 1250 && currentScrollPos > 250) setVisible(false)
    else {
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 250 );
    }
    setPrevScrollPos(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <>
      <div className="text-center w-100" style={{...logoStyles, top: visible ? '0' : '-152px'}}>
        <hr className="col-lg-2 col-md-3 d-none d-md-inline-block" style={{backgroundColor: 'whitesmoke', marginBottom: '-31px'}} />
        <img
          alt=""
          src={logo}
          width="auto"
          height="135"
          style={{marginTop: '-20px'}}
          
        />
        <hr className="col-lg-2 col-md-3 d-none d-md-inline-block" style={{backgroundColor: 'whitesmoke', marginBottom: '-31px'}} />
    </div>
    <Navbar collapseOnSelect className="justify-content-center" style={{...navbarStyles, top: visible ? '0' : '-152px', paddingTop: '100px'}} variant="dark" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="row justify-content-center text-center">
        <Nav className="my-4 my-md-0">
          <Nav.Item className="navihover">
            <Link className="navilink pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1" to="/">
              Domov
            </Link>
          </Nav.Item>

          <Nav.Item className="navihover">
            <Link className="navilink pt-3 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1" to="/vinarne">
              Vinárne
            </Link>
          </Nav.Item>

          <Nav.Item className="navihover">
            <Link className="navilink pt-3 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1" to="/vinka">
                Vínka
            </Link>
          </Nav.Item>

          <Nav.Item className="navihover">
            <Link className="navilink pt-3 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1" to="/akcie">
              Akcie
            </Link>
          </Nav.Item>

          <Nav.Item className="navihover">
            <Link className="navilink pt-3 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1" to="/sluzby">
              Služby
            </Link>
          </Nav.Item>

          <Nav.Item className="navihover">
            <Link className="navilink pt-3 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1" to="/kontakt">
              Kontakt
            </Link>
          </Nav.Item>
        </Nav>
        <Nav style={{position: "absolute", right: 16, top: 16}}>
            <Nav.Item className="navihover">
              <Link className="navilink pt-3 pb-3 mr-1 ml-1" to="/cart-page">
                <FiShoppingCart />
              </Link> 
            </Nav.Item>
          {!isLoggedIn ? (
            <>
              <Nav.Item className="navihover">
                <Link className="navilink pt-3 pb-3 mr-1 ml-1" to="/objednavky">
                  Objednávky
                </Link>
              </Nav.Item>
              <Nav.Item className="navihover">
                <Link className="navilink pt-3 pb-3 mr-1 ml-1" onClick={handleLogOut} to="">
                Odhlásiť
                </Link>
              </Nav.Item>
            </>
          ) : (
            <Nav.Item className="navihover">
              <Link className="navilink pt-3 pb-3" to="/login-page">
                Prihlásiť
              </Link>
            </Nav.Item>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </>
  );
};
