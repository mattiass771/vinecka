import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import axios from "axios";

import Home from "./components/Home/Home";
import Vinarne from "./components/Shop/Vinarne";
import Login from "./components/Login/Login";
import ShopOnline from "./components/Shop/shopOnline/ShopOnline"
import ShoppingCart from "./components/Cart/ShoppingCart"
import PayGate from "./components/Payment/PayGate"

import Spinner from "react-bootstrap/Spinner";

// App.js
export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    setLoadingData(true)
    axios
      .get(`http://localhost:5000/get-user-data`, {
        withCredentials: true
      })
      .then((res) => {
        if (res.data) {
          const { _id, userName, fullName, email, shopId, isOwner } = res.data;
          setUserData({ _id, userName, fullName, email, shopId, isOwner });
          setIsLoggedIn(userName ? true : false);
        } else {
          setUserData({})
        }
      })
      .catch((err) => err && console.log("Load Error " + err))
      .then(() => setLoadingData(false))
  }, []);
  const handleLogOut = () => {
    axios
      .get(`http://localhost:5000/logout`, {
        withCredentials: true
      })
      .then(() => {
        setUserData({});
        setIsLoggedIn(false);
      })
      .catch((err) => console.log(`Error ${err}`))
      .then(() => window.location.reload());
  };
  return (
    <div>
      <Navbar userName={userData.fullName} isLoggedIn={isLoggedIn} handleLogOut={handleLogOut} />
      <div style={{marginTop: "56px"}}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/vinarne">
          {loadingData ? 
          <Spinner
            style={{ marginLeft: "49%", marginTop: "20%" }}
            animation="border"
          /> : <Vinarne userData={userData} />}
          
          </Route>
          <Route exact path="/login-page">
            {loadingData ? 
          <Spinner
            style={{ marginLeft: "49%", marginTop: "20%" }}
            animation="border"
          /> : isLoggedIn ? <Home /> : <Login />}
          </Route>
          <Route exact path="/cart-page">
            {loadingData ? 
            <Spinner
              style={{ marginLeft: "49%", marginTop: "20%" }}
              animation="border"
            /> : <ShoppingCart userId={userData._id} />}
          </Route>
          {!loadingData &&
          <Route exact path={`/:shopUrl`}>
            <ShopOnline userId={userData._id} isOwner={userData.isOwner} />
          </Route>}
          {!loadingData &&
          <Route exact path={`/shop/payment`}>
            <PayGate />
          </Route>}
        </Switch>
      </div>
    </div>
  );
};
