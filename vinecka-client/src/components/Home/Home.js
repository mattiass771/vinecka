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
import Button from "react-bootstrap/Button";

import UpdateEvents from './UpdateEvents';
import UpdateServices from './UpdateServices';
import UpdateDescription from './UpdateDescription';

import options from '../../config/options';

import { MdEdit,MdMailOutline } from "react-icons/md";
import { BiCodeAlt } from "react-icons/bi";
import { FaFacebookF,FaInstagram } from "react-icons/fa";

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

  const [eventsData, setEventsData] = useState([])
  const [servicesData, setServicesData] = useState([])
  const [descriptionGeneral, setDescriptionGeneral] = useState('')

  const [eventsPopup, setEventsPopup] = useState(false)
  const [servicesPopup, setServicesPopup] = useState(false)
  const [descriptionsPopup, setDescriptionsPopup] = useState(false)

  const [forceRefresh, setForceRefresh] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`https://mas-vino.herokuapp.com/home/`)
      .then(res => {
        const featured = res.data.featuredWines
        const events = [res.data.descriptionEvents, res.data.imageLinkEvents]
        const services = [res.data.descriptionServices, res.data.imageLinkServices]
        const description = res.data.descriptionGeneral
        setEventsData(events)
        setServicesData(services)
        setDescriptionGeneral(description)
        setFeaturedIds(featured)
        setTempId(featured)
        setFeaturedWines([])
        featured.map(item => {
          axios.get(`https://mas-vino.herokuapp.com/shop/find-item-by-id/${item}`)
            .then(res => {
              const response = res.data
              const newObj = {...response[0], shopId: response[1]}
              return setFeaturedWines(prev => [...prev, newObj])
            })
            .catch(err => err && console.log('Error while setting full featured wines, ', err))
        })
      })
      .catch(err => err && console.log('Error while fetching featured wines, ', err))
    axios.get(`https://mas-vino.herokuapp.com/shop/`)
      .then(res => setCarouselData(res.data))
      .catch(err => err && console.log('Error while fetching shops for carousel, ', err))
      .then(() => setLoading(false))  
  }, [forceRefresh])

  const getImage = (image) => {
    try {
        const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
        return img;
    } catch {
        return null;
    }
  };

  const ShowEvents = () => {
    return (
      <Row className="mt-4 mb-4">
        <Col className="mt-4 mb-4">
          {eventsData[0]} <br/>
          <Link to="/akcie"><Button variant="dark">Zoznam akcii</Button></Link>
        </Col>
        <Col className="mt-4 mb-4">
          {isOwner &&
            <Button
              onClick={() => setEventsPopup(true)}
              style={{
                width: "40px",
                height: "40px",
                marginBottom: "-40px",
                zIndex: "+1",
                position:'absolute'
              }}
              variant="outline-warning"
            >
              <MdEdit style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
            </Button>}
          <img className="w-100" src={getImage(eventsData[1]) ? getImage(eventsData[1]) : eventsData[1]} /> 
        </Col>
      </Row>
    )
  }

  const ShowServices = () => {
    return (
      <Row className="mt-4 mb-4 pt-4 pb-4">
        <Col className="mt-4 mb-4">
          {isOwner &&
            <Button
              onClick={() => setServicesPopup(true)}
              style={{
                width: "40px",
                height: "40px",
                marginBottom: "-40px",
                zIndex: "+1",
                position:'absolute'
              }}
              variant="outline-warning"
            >
              <MdEdit style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
            </Button>}
          <img className="w-100" src={getImage(servicesData[1]) ? getImage(servicesData[1]) : servicesData[1]} /> 
        </Col>
        <Col className="mt-4 mb-4">
          {servicesData[0]} <br/>
          <Link to="/sluzby"><Button variant="dark">Zoznam sluzieb</Button></Link>
        </Col>
      </Row>
    )
  }

  const ShowGeneral = () => {
    return (
      <Row className="text-center mt-4 mb-4">
        <Col className="mt-4 mb-4">
          {isOwner &&
            <Button
              onClick={() => setDescriptionsPopup(true)}
              style={{
                width: "40px",
                height: "40px",
                marginBottom: "-40px",
                zIndex: "+1",
                position:'absolute'
              }}
              variant="outline-warning"
            >
              <MdEdit style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
            </Button>}
          {descriptionGeneral}
        </Col>
      </Row>
    )
  }

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
    for (let i = 0; i<featuredIds.length; i++) {
      if (featuredIds[i] !== tempId[i]) {
        setFeaturedIds(tempId)
        axios.post(`https://mas-vino.herokuapp.com/home/featured-wines`, {featuredWines: tempId})
          .then(res => window.location.reload())
          .catch(err => err && console.log(err))
        break;
      }
    }
  }

  const handleFeaturedIds = (e, i) => {
    const newValue = tempId[i]
    let newIdAvail = [...isIdAvail]
    axios.get(`https://mas-vino.herokuapp.com/shop/find-item-by-id/${newValue}`)
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

  const ShowUpdateFeaturedWines = () => {
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
      {eventsPopup &&
        <UpdateEvents eventsText={eventsData[0]} eventsImage={eventsData[1]} eventsPopup={eventsPopup} setEventsPopup={setEventsPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      {servicesPopup &&
        <UpdateServices servicesText={servicesData[0]} servicesImage={servicesData[1]} servicesPopup={servicesPopup} setServicesPopup={setServicesPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      {descriptionsPopup &&
        <UpdateDescription descriptionsText={descriptionGeneral} descriptionsPopup={descriptionsPopup} setDescriptionsPopup={setDescriptionsPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      <Carousel indicators={false} style={{maxHeight: MAX_HEIGHT_JUMBO}}>
        {carouselData && showCarouselWithData()}  
      </Carousel>
      <div>
        <Container>
          <ShowGeneral />
        </Container>
      </div>
      <div style={{background: 'rgba(52,58,64, 0.2)'}}>
        <Container className="pt-3 pb-3">
          {isOwner &&
          <Row>
            <ShowUpdateFeaturedWines />
          </Row>}
          <Row className="text-center pt-4 pb-4">
            <ShowItem colXsSettings={6} colMdSettings={3} shopItems={featuredWines} shopId={'home'} userId={userId} setShouldReload={false} shouldReload={false} setShowAddedPopup={setShowAddedPopup} isOwner={false} />
          </Row>
        </Container>
      </div>
      <div>
        <Container>
          <ShowEvents />
        </Container>
      </div>
      <div style={{background: 'rgba(52,58,64, 0.2)'}}>
        <Container>
          <ShowServices />
        </Container>
      </div>
      <div>
        <Container>
          <Row className="text-center pt-4 pb-4 mb-4">
            <Col>
              <a rel="noopener noreferrer" target="_blank" href="https://github.com/mattiass771" style={{textDecoration: 'none', color: '#333333'}}>
                <BiCodeAlt style={{fontSize: '150%', marginTop: '-2px'}} /> by <strong>MZ</strong>
              </a>
            </Col>
            <Col>
              <a rel="noopener noreferrer" target="_blank" href="https://facebook.com" style={{textDecoration: 'none', color: '#333333'}}>
                <FaFacebookF style={{fontSize: '130%', marginTop: '-2px', marginRight: '-4px'}} />acebook.com<strong>/masvino</strong>
              </a>
            </Col>
            <Col>
              <a rel="noopener noreferrer" target="_blank" href="https://instagram.com" style={{textDecoration: 'none', color: '#333333'}}>
                <FaInstagram style={{fontSize: '150%', marginTop: '-2px'}} /><strong>#masvino</strong>
              </a>
            </Col>
            <Col>
              <MdMailOutline style={{fontSize: '150%', marginTop: '-2px'}} /><strong style={{color: '#333333'}}>masvino@mail.com</strong>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
