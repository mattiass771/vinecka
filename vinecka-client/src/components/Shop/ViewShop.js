import React from "react";

import ShopItems from "./ViewShop/ShopItems";
import ShopJumbotron from "./ViewShop/ShopJumbotron";

// CreateShop.js
export default ({ shopData, isOwner, userId }) => {
  return (
    <>
      <ShopJumbotron shopData={shopData} isOwner={isOwner} />
      <ShopItems shopData={shopData} isOwner={isOwner} userId={userId} />
    </>
  );
};
