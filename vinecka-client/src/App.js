import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import axios from "axios";

import Home from "./components/Home/Home";
import Vinarne from "./components/Shop/Vinarne";
import Login from "./components/Login/Login";
import ShopOnline from "./components/Shop/shopOnline/ShopOnline"
import ShoppingCart from "./components/Cart/ShoppingCart"
import PayGate from "./components/Cart/PayGate"
import Orders from "./components/Payment/Orders"
import SuccessPayment from "./components/Payment/SuccessPayment";
import RejectPayment from "./components/Payment/RejectPayment";
import Vinka from "./components/Wines/Vinka";
import Events from "./components/Events/Events";
import Services from "./components/Services/Services";

import Spinner from "react-bootstrap/Spinner";

// App.js
export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    setLoadingData(true)
    axios
      .get(`https://mas-vino.herokuapp.com/get-user-data`, {
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
      .get(`https://mas-vino.herokuapp.com/logout`, {
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
      {loadingData ? 
            <Spinner
              style={{ marginLeft: "49%", marginTop: "20%" }}
              animation="border"
            /> :
      <div style={{marginTop: "56px"}}>
        <Switch>
          <Route exact path="/">
            <Home userId={userData._id} isOwner={userData.isOwner}  />
          </Route>
          <Route exact path="/vinarne">
            <Vinarne userData={userData} />
          </Route>
          <Route exact path="/vinka">
            <Vinka userData={userData} />
          </Route>
          <Route exact path="/login-page">
            {isLoggedIn ? <Home userId={userData._id} isOwner={userData.isOwner} /> : <Login />}
          </Route>
          <Route exact path="/cart-page">
            <ShoppingCart userId={userData._id} />
          </Route>
          <Route exact path={`/success-payment`}>
            <SuccessPayment userId={userData._id} />
          </Route>
          <Route exact path={`/failed-payment`}>
            <RejectPayment userId={userData._id} />
          </Route>
          <Route exact path={`/cancel-payment`}>
            <RejectPayment userId={userData._id} />
          </Route>
          <Route exact path={`/objednavky`}>
            <Orders userId={userData._id} isOwner={userData.isOwner} />
          </Route>
          <Route exact path={`/akcie`}>
            <Events isOwner={userData.isOwner} />
          </Route>
          <Route exact path={`/sluzby`}>
            <Services isOwner={userData.isOwner} />
          </Route>
          <Route exact path={`/:shopUrl`}>
            <ShopOnline userId={userData._id} isOwner={userData.isOwner} />
          </Route>
          <Route exact path={`/shop/payment`}>
            <PayGate />
          </Route>
        </Switch>
      </div>}
    </div>
  );
};
