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
import Card from "react-bootstrap/Card";

import UpdateEvents from './UpdateEvents';
import UpdateServices from './UpdateServices';
import UpdateDescription from './UpdateDescription';
import UpdateFeatured from './UpdateFeatured';

import options from '../../config/options';

import { MdEdit } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FiTruck } from "react-icons/fi";
import { GoPackage } from "react-icons/go";
import { RiSecurePaymentFill } from "react-icons/ri";

const {MAX_HEIGHT_JUMBO, MIN_HEIGHT_JUMBO} = options

//Home.js
export default ({userId, isOwner}) => {
  const [carouselData, setCarouselData] = useState('')
  const [featuredWines, setFeaturedWines] = useState([])
  const [loading, setLoading] = useState(false)
  const [featuredIds, setFeaturedIds] = useState([])

  const [eventsData, setEventsData] = useState([])
  const [servicesData, setServicesData] = useState([])
  const [descriptionGeneral, setDescriptionGeneral] = useState('')
  const [isHoveredServices, setIsHoveredServices] = useState('none')
  const [isHoveredEvents, setIsHoveredEvents] = useState('none')

  const [eventsPopup, setEventsPopup] = useState(false)
  const [servicesPopup, setServicesPopup] = useState(false)
  const [descriptionsPopup, setDescriptionsPopup] = useState(false)
  const [featuredsPopup, setFeaturedsPopup] = useState(false)

  const [forceRefresh, setForceRefresh] = useState(false)

  useEffect(() => {
    setLoading(true)
    setFeaturedWines([])
    setFeaturedIds([])
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
      <Col md={6} style={{padding:'0'}}>
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
          </Button>
          }
          <Link to={`/akcie`}>
            <Card className="h-100 w-100" onMouseEnter={() => setIsHoveredEvents('block')} onMouseLeave={() => setIsHoveredEvents('none')} style={{ textAlign:"center", color: "whitesmoke" }} >
                <Card.Img className="h-100 w-100" src={getImage(eventsData[1]) ? getImage(eventsData[1]) : eventsData[1]} />
                <Card.ImgOverlay className={isHoveredEvents === 'none' ? 'fade-in' : 'fade-out'} style={{ background: "rgba(52,58,64,0.4)"}} >
                        <h3 style={{paddingTop: "50%"}}>
                            Služby
                        </h3>
                </Card.ImgOverlay>
            </Card>
        </Link>
      </Col>
    )
  }

  const ShowServices = () => {
    return (
      <Col md={6} style={{padding:'0'}}>
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
        <Link to={`/sluzby`}>
            <Card className="h-100 w-100" onMouseEnter={() => setIsHoveredServices('block')} onMouseLeave={() => setIsHoveredServices('none')} style={{ textAlign:"center", color: "whitesmoke" }} >
                <Card.Img className="h-100 w=100" src={getImage(servicesData[1]) ? getImage(servicesData[1]) : servicesData[1]} />
                <Card.ImgOverlay className={isHoveredServices === 'none' ? 'fade-in' : 'fade-out'} style={{ background: "rgba(52,58,64,0.4)"}} >
                        <h3 style={{paddingTop: "50%"}}>
                            Služby
                        </h3>
                </Card.ImgOverlay>
            </Card>
        </Link>
      </Col>
    )
  }

  const ShowGeneral = () => {
    return (
      <Row className="text-center mb-2">
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

  const ShowUpdateFeatured = () => {
    return <Row>
        <Col className="mb-4">
          {isOwner &&
            <Button
              onClick={() => setFeaturedsPopup(true)}
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
        </Col>
      </Row>
  }

  const showCarouselWithData = () => {
    return carouselData.map(shop => {
      const {shopName, owner, url, imageLink} = shop
      const image = getImage(imageLink)
        ? getImage(imageLink)
        : imageLink;
      return (
        <Carousel.Item key={`${url}-${imageLink}`} style={{maxHeight: MAX_HEIGHT_JUMBO, minHeight: MIN_HEIGHT_JUMBO }}>
            <Link to={`/${url}`}>
            <img
              style={{minHeight: MIN_HEIGHT_JUMBO, maxWidth: "100%"}}
              className="d-block carousel-image"
              src={image}
              alt={`Carousel-${imageLink}`}
            />
            <Carousel.Caption style={{zIndex:'+1'}}>
              <h3>{shopName}</h3>
              <p>{owner}</p>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
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
      {eventsPopup &&
        <UpdateEvents eventsText={eventsData[0]} eventsImage={eventsData[1]} eventsPopup={eventsPopup} setEventsPopup={setEventsPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      {servicesPopup &&
        <UpdateServices servicesText={servicesData[0]} servicesImage={servicesData[1]} servicesPopup={servicesPopup} setServicesPopup={setServicesPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      {descriptionsPopup &&
        <UpdateDescription descriptionsText={descriptionGeneral} descriptionsPopup={descriptionsPopup} setDescriptionsPopup={setDescriptionsPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      {featuredsPopup &&
        <UpdateFeatured getImage={getImage} featuredIds={featuredIds} featuredsPopup={featuredsPopup} setFeaturedsPopup={setFeaturedsPopup} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} />
      }
      <Carousel indicators={false} style={{maxHeight: MAX_HEIGHT_JUMBO, minHeight: MIN_HEIGHT_JUMBO }}>
        {carouselData && showCarouselWithData()}  
      </Carousel>
      <svg preserveAspectRatio="none" height="20%" width="100%" style={{position: "absolute", top: 376, left: 0}} xmlns="http://www.w3.org/2000/svg" viewBox="130 -70 1200 390"><path fill="white" fill-opacity="1" d="M0,288L60,277.3C120,267,240,245,360,213.3C480,181,600,139,720,112C840,85,960,75,1080,85.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
      <div className="pb-4" style={{backgroundColor: 'white', color: "rgba(55, 63, 39, 1)"}}>
        <Container>
          <Row className="text-center justify-content-center pt-4">
            <Col className="pt-2" xs={2} sm={3} md={4}>
              <hr style={{backgroundColor: "rgba(55, 63, 39, 1)", paddingBottom: "1px"}} />
            </Col>
            <Col xs={8} sm={6} md={4}>
              <h1>Naše vína</h1>
            </Col>
            <Col className="pt-2"  xs={2} sm={3} md={4}>
              <hr style={{backgroundColor: "rgba(55, 63, 39, 1)", paddingBottom: "1px"}}/>
            </Col>
          </Row>
          <Row className="text-center justify-content-center">
            <Col>
              <em style={{fontSize: "200%"}}>Tie najlepšie vínka z Malokarpatskej oblasti.</em>
            </Col>
          </Row>
          <ShowGeneral />
        </Container>
      </div>
      <div className="pt-3 pb-3">
        <Container className="pt-3 pb-3">
          {isOwner &&
          <Row>
            <ShowUpdateFeatured />
          </Row>}
          <Row className="text-center pt-4 pb-4">
            <ShowItem colXsSettings={6} colMdSettings={3} shopItems={featuredWines} shopId={'home'} userId={userId} setShouldReload={false} shouldReload={false} isOwner={false} />
          </Row>
        </Container>
      </div>
      <div className="pt-3 pb-3" style={{backgroundColor: 'rgba(55, 63, 39, 0.6)', color: "whitesmoke"}}>
        <Container className="pt-3 pb-3">
            <Row className="text-center pt-2 pb-4">
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><HiOutlineBadgeCheck style={{fontSize: "300%"}} /></p>
                <h5>OVERENÍ PREDAJCOVIA</h5>
                Kvalitné vína od poctivých lokálnych výrobcov, ktorí vykonávajú svoju prácu telom i dušou.
              </Col>
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><FiTruck style={{fontSize: "300%", color: 'whitesmoke !important'}} /></p>
                <h5>ROZVOZ</h5>
                ZDARMA: Pri kúpe nad 150 Eur (Pezinok a okolie). Možná dohoda a dovoz i ďalej, volajte na 0948 721 868.
              </Col>
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><GoPackage style={{fontSize: "300%"}} /></p>
                <h5>OSOBNÝ ODBER</h5>
                Sacherka Cafe, Radničné nám. 42/5, 902 01 Pezinok. Možná dohoda, volajte na 0948 721 868.
              </Col>
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><RiSecurePaymentFill style={{fontSize: "300%"}} /></p>
                <h5>PLATBA</h5>
                Hotovosťou pri dobierke, alebo bežnými platobnými kartami, či cez internet banking.
              </Col>
            </Row>
        </Container>
      </div>
      <div>  
        <Row>
          <ShowEvents />
          <ShowServices />
        </Row>
      </div>
    </>
  );
};
