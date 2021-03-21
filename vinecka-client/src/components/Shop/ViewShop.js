import React from "react";

import ShopItems from "./ViewShop/ShopItems";
import ShopJumbotron from "./ViewShop/ShopJumbotron";

// CreateShop.js
export default ({ shopData, isOwner, userId, updateCart, setUpdateCart }) => {
  return (
    <>
      <ShopJumbotron shopData={shopData} isOwner={isOwner} />
      <ShopItems updateCart={updateCart} setUpdateCart={setUpdateCart} shopData={shopData} isOwner={isOwner} userId={userId} />
    </>
  );
};
