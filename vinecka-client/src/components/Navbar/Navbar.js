import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import {FiShoppingCart} from "react-icons/fi"

// Navbar.js
export default ({ isLoggedIn, handleLogOut, userName }) => {

  return (
    <Navbar fixed="top" bg="dark" variant="dark" expand="md">
      <Navbar.Brand>
        <img
          alt=""
          src="https://st2.depositphotos.com/8301258/11284/v/950/depositphotos_112842636-stock-illustration-logo-shop-bags-icon-symbol.jpg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link className={`nav-elem`} to="/">
            Domov
          </Link>

          <Link className={`nav-elem`} to="/vinarne">
            Vinarne
          </Link>

          <Link className={`nav-elem`} to="/vinka">
            Vinka
          </Link>

          <Link className={`nav-elem`} to="/akcie">
            Akcie
          </Link>

          <Link className={`nav-elem`} to="/sluzby">
            Sluzby
          </Link>
        </Nav>
        <Nav className="mr-sm-2">
            <Link className={`nav-elem`} to="/cart-page">
              <FiShoppingCart />
            </Link>
          {isLoggedIn ? (
            <>
              <Link className={`nav-elem`} to="/objednavky">
                Objednavky
              </Link>
              <Link className={`nav-elem`} onClick={handleLogOut} to="">
                Logout
              </Link>
            </>
          ) : (
            <Link className={`nav-elem`} to="/login-page">
              Login
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
