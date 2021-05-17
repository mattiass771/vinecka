import React from "react";

import ShopItems from "./ViewShop/ShopItems";
import ShopJumbotron from "./ViewShop/ShopJumbotron";

// CreateShop.js
export default ({ shopData, isOwner, userId, shoppingCart, setShoppingCart }) => {
  return (
    <>
      <ShopJumbotron shopData={shopData} isOwner={isOwner} />
      <ShopItems shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} shopData={shopData} isOwner={isOwner} userId={userId} />
    </>
  );
};
