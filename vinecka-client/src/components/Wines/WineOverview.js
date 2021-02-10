import React, { useEffect, useState } from "react";

import ShowItem from '../Shop/ViewShop/ShowItem';

import Row from 'react-bootstrap/Row'
import Container from "react-bootstrap/Container";

//Shop.js
export default ({ userData, shopData }) => {
  const [showAddedPopup, setShowAddedPopup] = useState(false)
  const {userId} = userData

  const ShowWines = () => {
    return shopData.map((shop,i) => {
      const {shopItems, url, shopId} = shop
      return (
        <ShowItem key={`${shopId}-${i}`} shopItems={shopItems} url={url} shopId={shopId} userId={userId} setShouldReload={false} shouldReload={false} setShowAddedPopup={setShowAddedPopup} isOwner={false} />
      )
    })
  }
  
  return (
    <Container>
      <Row className="text-center">
        <ShowWines />
      </Row>
    </Container>
  );
};