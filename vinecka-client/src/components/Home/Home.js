import React, {useState, useEffect} from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";

import ShowItem from '../Shop/ViewShop/ShowItem';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image"

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

import bannerDovoz from "./bannermasvinocropped.png"


const {MIN_HEIGHT_JUMBO} = options
const token = process.env.REACT_APP_API_SECRET

//Home.js
export default ({userId, isOwner, shoppingCart, setShoppingCart}) => {
  let history = useHistory();
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

  const [bannerHeight, setBannerHeight] = useState('')
  
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    const height = document.getElementById('banner').clientHeight;
    setBannerHeight(height);
  }, [dimensions])

  useEffect(() => {
    setLoading(true)
    setFeaturedWines([])
    setFeaturedIds([])
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/home/`, {token})
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
          return axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/find-item-by-id/${item}`, {token})
            .then(res => {
              const response = res.data
              const newObj = {...response[0], shopId: response[1]}
              return setFeaturedWines(prev => [...prev, newObj])
            })
            .catch(err => err && console.log('Error while setting full featured wines, ', err))
        })
      })
      .catch(err => err && console.log('Error while fetching featured wines, ', err))
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/`, {token})
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

  const showEvents = () => {
    return (
      <Col md={6} style={{padding:'35px'}}>
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
          <Link to={`/eventy`}>
            <Card className="h-100 w-100 body-image" onMouseEnter={() => setIsHoveredEvents('block')} onTouchStart={() => setIsHoveredEvents('block')} onMouseLeave={() => setIsHoveredEvents('none')} style={{ textAlign:"center", color: "whitesmoke",
            //  background: 'rgba(52,58,64,0)',
              border: '1.5px solid white' }} >
                <Card.Img className="h-100 w-100" src={getImage(eventsData[1]) ? getImage(eventsData[1]) : eventsData[1]} />
                <Card.ImgOverlay className={isHoveredEvents === 'none' ? 'fade-out' : 'fade-in'} style={{ background: "rgba(52,58,64,0.3)"}} >
                </Card.ImgOverlay>
            </Card>
        </Link>
      </Col>
    )
  }

  const showServices = () => {
    return (
      <Col md={6} style={{padding:'35px'}}>
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
            <Card className="h-100 w-100 body-image" onMouseEnter={() => setIsHoveredServices('block')} onTouchStart={() => setIsHoveredServices('block')} onMouseLeave={() => setIsHoveredServices('none')} style={{ textAlign:"center", color: "whitesmoke", 
            // background: 'rgba(52,58,64,0)', 
            border: '1.5px solid white'}} >
                <Card.Img className="h-100 w-100" src={getImage(servicesData[1]) ? getImage(servicesData[1]) : servicesData[1]} />
                <Card.ImgOverlay className={`${isHoveredServices === 'none' ? 'fade-out' : 'fade-in'}`} style={{ background: "rgba(52,58,64,0.3)"}} >
                  <div></div>
                </Card.ImgOverlay>
            </Card>
        </Link>
      </Col>
    )
  }

  const ShowGeneral = ({fSz = '115%'}) => {
    return (
      <Row className="text-center mb-2">
        <Col className="mt-2 mb-2" style={{fontSize: fSz}}>
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
    let nextImage = ''
    const output = carouselData.map((shop, i) => {
      const {shopName, owner, url, imageLink, textColor} = shop
      const image = nextImage
        ? nextImage
        : getImage(imageLink);
      const nextImageLink = shop[i+1] ? shop[i+1].imageLink : ''
      nextImage = nextImageLink ? getImage(nextImageLink) : ''
      return (
        <Carousel.Item className="car-image-bg" key={`${url}-${imageLink}`} 
          style={{
            height: MIN_HEIGHT_JUMBO*2, 
            width: "100%",
            background: `url(${image}) center center no-repeat`, 
            backgroundSize: 'cover'  
          }}
        >
          <Link to={`/${url}`}>
            <Carousel.Caption style={{zIndex:'+1' ,marginBottom: MIN_HEIGHT_JUMBO+75, color: textColor === 'white' ? 'whitesmoke' : '#333333'}}>
              <h1>{shopName}</h1>
            </Carousel.Caption>
          </Link>
          <div style={{backgroundColor: '#141a1095', color: "whitesmoke", padding: '40px', marginTop: MIN_HEIGHT_JUMBO, height: MIN_HEIGHT_JUMBO}}>
          </div>
        </Carousel.Item>
      )
    })
    return output
  }

  return (
    loading ? 
    <Spinner
      style={{ marginLeft: "49%", marginTop: "20%" }}
      animation="border"
    />
    :
    <>
    <div>
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
      <Carousel indicators={false} style={{height: MIN_HEIGHT_JUMBO*2 }}>
        {carouselData && showCarouselWithData()}  
      </Carousel>
      <Container id="banner" fluid>
          <Row className="image-banner">
              <Image src={bannerDovoz} fluid />
          </Row>
      </Container>
      <div style={{color: "whitesmoke", padding: '20px 0px', marginTop: -MIN_HEIGHT_JUMBO-bannerHeight}}>
        <Container className="d-none d-md-block" fluid>
          <Row className="text-center justify-content-center pt-4">
            <Col className="pt-2" xs={1} sm={2} md={3} xl={4} >
              <hr style={{backgroundColor: "whitesmoke", paddingBottom: "1px"}} />
            </Col>
            <Col xs={10} sm={8} md={6} xl={4} >
              <h2>Vína Malých Karpát</h2>
            </Col>
            <Col className="pt-2"  xs={1} sm={2} md={3} xl={4} >
              <hr style={{backgroundColor: "whitesmoke", paddingBottom: "1px"}}/>
            </Col>
          </Row>
          <Row className="text-center justify-content-center">
            <Col>
              <em style={{fontSize: "160%"}}>Vychutnajte si tie najlepšie vína z Malokarpatskej oblasti. </em>
              <br /><strong style={{fontSize: "125%"}}>#podpormemalychvinarov</strong>
            </Col>
          </Row>
          <ShowGeneral />
        </Container>
        <Container className="d-none d-sm-block d-md-none" fluid>
          <Row className="text-center justify-content-center pt-2">
            <Col xs={10} sm={8} md={6} xl={4} >
              <h3>Vína Malých Karpát</h3>
            </Col>
          </Row>
          <Row className="text-center justify-content-center">
            <Col>
              <em style={{fontSize: "115%"}}>Vychutnajte si tie najlepšie vína z Malokarpatskej oblasti.</em>
              <br /><strong style={{fontSize: "90%"}}>#podpormemalychvinarov</strong>
            </Col>
          </Row>
          <ShowGeneral fSz="100%" />
        </Container>
        <Container className="d-block d-sm-none pt-2" fluid>
          <Row className="text-center justify-content-center">
            <Col xs={10} sm={8} md={6} xl={4} >
              <h4>Vína Malých Karpát</h4>
            </Col>
          </Row>
          <Row className="text-center justify-content-center">
            <Col>
              <em style={{fontSize: "100%"}}>Vychutnajte si tie najlepšie vína z Malokarpatskej oblasti. </em>
              <br /><strong style={{fontSize: "80%"}}>#podpormemalychvinarov</strong>
            </Col>
          </Row>
          <ShowGeneral fSz="85%" />
        </Container>
      </div>
      <div className="pb-4" style={{height: bannerHeight}}></div>
      {/* <svg className="d-none d-lg-block" preserveAspectRatio="none" height="20%" width="100%" style={{position: "absolute", top: 376, left: 0}} xmlns="http://www.w3.org/2000/svg" viewBox="130 -70 1200 390"><path fill="#141a1080" fill-opacity="1" d="M0,288L60,277.3C120,267,240,245,360,213.3C480,181,600,139,720,112C840,85,960,75,1080,85.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg> */}
      <div className="mt-4 pt-3 pb-3 px-4">
        {isOwner &&
        <Row>
          <ShowUpdateFeatured />
        </Row>}
        <Row className="text-center pt-4 pb-2 justify-content-center">
            <p className="font-sizing shadow" style={{backgroundColor: 'whitesmoke', borderRadius: '5px', padding: '0px 10px'}}>Naše najpredávanejšie</p>
        </Row>
        <Row className="text-center mx-4">
          <ShowItem shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} colXsSettings={6} colMdSettings={3} shopItems={featuredWines} shopId={'home'} userId={userId} setShouldReload={false} shouldReload={false} isOwner={false} />
        </Row>
        <Row className="text-center pt-4 pb-2 justify-content-center">
          <Col>
            <Button style={{fontSize: '125%'}} variant="dark" onClick={() => history.push(`/vina`)} >Zobraziť všetky vína</Button>
          </Col>
        </Row>
      </div>
      <div className="pt-3 pb-3" style={{backgroundColor: '#141a1095', color: "whitesmoke"}}>
        <Container className="pt-3 pb-3">
            <Row className="text-center pt-2 pb-4">
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><HiOutlineBadgeCheck style={{fontSize: "300%"}} /></p>
                <h5>DÔVERYHODNOSŤ</h5>
                Zaručujeme len tie nalepšie vína od poctivých lokálnych výrobcov, ktorí vykonávajú svoju prácu telom i dušou.
              </Col>
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><FiTruck style={{fontSize: "300%", color: 'whitesmoke !important'}} /></p>
                <h5>ROZVOZ</h5>
                Vína vám dovezieme osobne (Pezinok a okolie). <br />Možná dohoda a dovoz i ďalej, volajte na 0948 721 868.
              </Col>
              <Col className="mt-4" lg={3} sm={6} xs={12}>
                <p style={{height: "50px"}}><GoPackage style={{fontSize: "300%"}} /></p>
                <h5>OSOBNÝ ODBER</h5>
                Ul. Eugena Suchoňa 24, <br />902 01 Pezinok. <br />Možná dohoda, volajte na 0948 721 868.
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
        <Container>
          <Row>
            {showEvents()}
            {showServices()}
          </Row>
        </Container>
      </div>
    </div>
  </>
  );
};
