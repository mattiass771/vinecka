import React, {useState} from 'react';
import CreateShop from "./CreateShop";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default ({userData, shopData}) => {
    const [showCreateShop, setShowCreateShop] = useState(false)

    const showShops = () => {
        return shopData.map(shop => {
            const { _id, shopName, owner, description } = shop
            return (
                <Col className="mt-2 mb-2" md={4} key={_id} >
                    <Card style={{ textAlign:"center", color: "whitesmoke" }} id={_id} >
                        <Card.Img src="https://miro.medium.com/max/295/1*i5iqn7xB-l0kLwsJJBYEWQ.jpeg" />
                        <Card.ImgOverlay style={{ background: "rgba(52,58,64,0.4)", }} >
                                <Card.Title>
                                    {shopName}
                                </Card.Title>
                                <Card.Text>
                                    <h6>Owner: {owner}</h6>
                                </Card.Text>
                                <Card.Text>
                                    {description}
                                </Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                </Col>
            )
        })
    }

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    {showCreateShop ? 
                    <CreateShop userData={userData} /> :
                    <Button style={{marginTop: "20px"}} variant="dark" onClick={() => setShowCreateShop(true)}>New Shop</Button>
                    }
                    
                </Col>
            </Row>
            <hr />
            <Row>
                {showShops()}
            </Row>
        </Container>
    )
}