import React, { useEffect, useState } from "react";
import axios from "axios";
import ShopsOverview from "./ShopsOverview";

import Spinner from "react-bootstrap/Spinner";

const token = process.env.REACT_APP_API_SECRET

//Shop.js
export default ({ userData }) => {
  const [shopData, setShopData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/shop/`, {token})
      .then((res) => setShopData(res.data ? res.data : {}))
      .catch((err) => {
        if (err) return console.log(`Fetch error: ${err}`);
      })
      .then(() => setLoading(false));
  }, []); //eslint-disable-line
  return (
    <>
      {loading ? (
        <Spinner
          style={{ marginLeft: "49%", marginTop: "20%" }}
          animation="border"
        />
      ) : <ShopsOverview userData={userData} shopData={shopData} />}
    </>
  );
};
