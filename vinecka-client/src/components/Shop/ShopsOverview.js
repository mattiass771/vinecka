import React, {useState} from 'react';
import CreateShop from "./CreateShop";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { Link } from "react-router-dom";

export default ({userData, shopData}) => {
    const [showCreateShop, setShowCreateShop] = useState(false)
    const [isHovered, setIsHovered] = useState("")

    const getImage = (image) => {
        try {
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
          return img;
        } catch {
          return null;
        }
      };

    const showShops = () => {
        return shopData.map(shop => {
            const { _id, shopName, description, url, overviewImage } = shop
            const handleMouseOver = () => {
                let hoverObj = {}
                hoverObj[_id] = 'none'
                setIsHovered({...isHovered, ...hoverObj})
            }
            const handleMouseLeave = () => {
                let hoverObj = {}
                setIsHovered('')
            }
            return (
                <Col className="mt-2 mb-2" style={{maxHeight: "310px"}} md={4} key={_id} >
                    <Link to={`/${url}`}>
                        <Card className="h-100" onMouseEnter={() => handleMouseOver()} onMouseLeave={() => handleMouseLeave()} style={{ textAlign:"center", color: "whitesmoke" }} id={_id} >
                            <Card.Img className="h-100" src={getImage(overviewImage) ? getImage(overviewImage) : `https://miro.medium.com/max/295/1*i5iqn7xB-l0kLwsJJBYEWQ.jpeg`} />
                            <Card.ImgOverlay className={`${isHovered[_id] === 'none' ? 'fade-out' : 'fade-in'}`} style={{ background: "rgba(52,58,64,0.4)"}} >
                                    <h3 style={{paddingTop: "50%"}}>
                                        {shopName}
                                    </h3>
                            </Card.ImgOverlay>
                        </Card>
                    </Link>
                </Col>
            )
        })
    }

    return (
        <Container>
            <Row>
                {userData.isOwner && 
                <Col className="text-center">
                    {showCreateShop ? 
                    <CreateShop userData={userData} /> :
                    <Button style={{marginTop: "20px"}} variant="dark" onClick={() => setShowCreateShop(true)}>New Shop</Button>
                    }
                </Col>}
            </Row>
            <Row className="mt-4">
                {showShops()}
            </Row>
        </Container>
    )
}