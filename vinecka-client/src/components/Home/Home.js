import React, {useState, useEffect} from "react";
import axios from 'axios';

import { Link } from "react-router-dom";

import ShowItem from '../Shop/ViewShop/ShowItem';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Carousel from "react-bootstrap/Carousel";
import Spinner from "react-bootstrap/Spinner";

import options from '../../config/options';

const {MAX_HEIGHT_JUMBO} = options

//Home.js
export default ({userId, isOwner}) => {
  const [carouselData, setCarouselData] = useState('')
  const [featuredWines, setFeaturedWines] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddedPopup, setShowAddedPopup] = useState(false)
  const [featuredIds, setFeaturedIds] = useState([])
  const [isIdAvail, setIsIdAvail] = useState(['','','',''])
  const [tempId, setTempId] = useState([])

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:5000/home/`)
      .then(res => {
        const featured = res.data.featuredWines
        setFeaturedIds(featured)
        setTempId(featured)
        featured.map(item => {
          axios.get(`http://localhost:5000/shop/find-item-by-id/${item}`)
            .then(res => {
              const response = res.data
              const newObj = {...response[0], shopId: response[1]}
              return setFeaturedWines(prev => [...prev, newObj])
            })
            .catch(err => err && console.log('Error while setting full featured wines, ', err))
        })
      })
      .catch(err => err && console.log('Error while fetching featured wines, ', err))
    axios.get(`http://localhost:5000/shop/`)
      .then(res => setCarouselData(res.data))
      .catch(err => err && console.log('Error while fetching shops for carousel, ', err))
      .then(() => setLoading(false))  
  }, [])

  const getImage = (image) => {
    try {
        const img = require(`../../../../src/uploads/${image}`);
        return img;
    } catch {
        return null;
    }
  };

  const showCarouselWithData = () => {
    return carouselData.map(shop => {
      const {shopName, owner, url, imageLink} = shop
      const image = getImage(imageLink)
        ? getImage(imageLink)
        : imageLink;
      return (
        <Carousel.Item key={`id-${image}`} style={{maxHeight: MAX_HEIGHT_JUMBO}}>
            <Link to={`/${url}`}>
            <img
              className="d-block w-100"
              src={image}
              alt={`Carousel-${imageLink}`}
            />
            <Carousel.Caption>
              <h3>{shopName}</h3>
              <p>{owner}</p>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      )
    })
  }

  const handleSuccessFeatureChange = () => {
    setFeaturedIds(tempId)
    axios.post(`http://localhost:5000/home/featured-wines`, {featuredWines: tempId})
      .then(res => console.log(res.data))
      .catch(err => err && console.log(err))
  }

  const handleFeaturedIds = (e, i) => {
    const newValue = tempId[i]
    let newIdAvail = [...isIdAvail]
    axios.get(`http://localhost:5000/shop/find-item-by-id/${newValue}`)
      .then(res => {
        if (res.data[0]) {
          newIdAvail[i] = ''
          setIsIdAvail(newIdAvail)
          handleSuccessFeatureChange()
        } else {
          newIdAvail[i] = 'invalid-input'
          setIsIdAvail(newIdAvail)
        }
      })
      .catch(err => console.log(err))
  }

  const handleTempId = (e, i) => {
    const newValue = e.target.value
    let newTempIds = [...tempId]
    newTempIds[i] = newValue
    setTempId(newTempIds)
  }

  const showUpdateFeaturedWines = () => {
    return tempId.map((featured, i) => {
      return (
        <Col key={`featuerd-${i}`} sm={6} md={3} className={`text-center mt-1`}>
          <input
            className={`form-control text-center ${isIdAvail[i]}`}
            type="text"
            name={`featured-${i}`}
            value={featured}
            onChange={(e) => handleTempId(e, i)}
            onBlur={(e) => handleFeaturedIds(e, i)}
          />
        </Col>
      )
    })
  }

  return (
    loading ? 
    <Spinner
      style={{ marginLeft: "49%", marginTop: "20%" }}
      animation="border"
    />
    :
    <>
      {showAddedPopup &&
          <Alert style={{position: "fixed", zIndex: '9', top:56, right:0}} variant="success" onClose={() => setShowAddedPopup(false)} dismissible>
            <p>Item added to cart!</p>
          </Alert>
      }
      <Carousel indicators={false} style={{maxHeight: MAX_HEIGHT_JUMBO}}>
        {carouselData && showCarouselWithData()}  
      </Carousel>
      <div style={{background: 'rgba(52,58,64, 0.2)'}}>
        <Container>
          {isOwner &&
          <Row>
            {showUpdateFeaturedWines()}
          </Row>}
          <Row className="text-center">
            <ShowItem colXsSettings={6} colMdSettings={3} shopItems={featuredWines} shopId={'home'} userId={userId} setShouldReload={false} shouldReload={false} setShowAddedPopup={setShowAddedPopup} isOwner={false} />
          </Row>
        </Container>
      </div>
    </>
  );
};
