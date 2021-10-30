import React from "react";

import ShopItems from "./ViewShop/ShopItems";
import ShopJumbotron from "./ViewShop/ShopJumbotron";
import MaintenanceModePage from "../MaintenanceMode/MaintenanceModePage";

// CreateShop.js
export default ({ isMaintenance, shopData, isOwner, userId, shoppingCart, setShoppingCart }) => {
  return (
    <>
      <ShopJumbotron shopData={shopData} isOwner={isOwner} />
      {isMaintenance && !isOwner ?
        <MaintenanceModePage /> :
        <ShopItems shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} shopData={shopData} isOwner={isOwner} userId={userId} />
      }
    </>
  );
};
