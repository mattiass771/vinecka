import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import redBottle from './red-placeholder.png'
import roseBottle from './rose-placeholder.png'
import whiteBottle from './white-placeholder.png'
import { FiShoppingCart } from "react-icons/fi"
import { MdDelete } from "react-icons/md"
import AddLabel from './AddLabel';

const token = process.env.REACT_APP_API_SECRET

const getImage = (image) => {
    try {
        const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
        return img;
    } catch {
        return null;
    }
};

export default ({isOwner, shoppingCart, setShoppingCart}) => {
    const [labels, setLabels] = useState([])
    const [wines, setWines] = useState([])
    const [loading, setLoading] = useState(false)
    const [wineSelected, setWineSelected] = useState({})
    const [labelSelected, setLabelSelected] = useState({})
    const [labelPopup, setLabelPopup] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const bottleByColor = {
        "biele": whiteBottle,
        "červené": redBottle,
        "ružové": roseBottle
    }
    const deleteCard = (labelId) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/labels/delete-label/${labelId}/`, {token})
            .then(() => setRefresh(!refresh))
            .catch((err) => err && console.log(`Error ${err}`));
    };
    const addItemToCart = (itemId, shopId, label) => { 
        const itemLabelId = `${itemId}-${label._id}`       
        if (shoppingCart.find(val => val.itemId === itemLabelId)) {
          const newShoppingCart = shoppingCart.map(item => {
            if (item.itemId === itemLabelId) {                
                return {...item, count: item.count + 1}
            }
            return item
          })
          return setShoppingCart(newShoppingCart)
        } else {
          const newItem = { shopId, itemId: itemLabelId, label, count: 1 }
          setShoppingCart([...shoppingCart, newItem])
        }
    }
    useEffect(() => {
        setLoading(true)
        const getLabels = axios.post(`${process.env.REACT_APP_BACKEND_URL}/labels/`, {token})
        const getWinesWithLabels = axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/find-items-with-labels/`, {token})
        Promise.all([getLabels, getWinesWithLabels])
            .then(res => {
                setLabels(res[0].data)
                setWines(res[1].data)
                setLoading(false)
            })
    }, [refresh])
    return (
        loading ? (
            <Spinner
              style={{ marginLeft: "49%", marginTop: "20%" }}
              animation="border"
            />
        ) : 
        <Container className="container py-4 d-none d-lg-block" fluid>
            {isOwner &&
                <Row className="text-center">
                    <Col>
                        <Button onClick={() => setLabelPopup(true)} variant="dark">Pridat etikety</Button>
                    </Col>
                </Row>
            }
            {isOwner && labelPopup &&
                <AddLabel refresh={refresh} setRefresh={setRefresh} setLabelPopup={setLabelPopup} labelPopup={labelPopup} />
            }
            <Row style={{height: '100%'}}>
                <Col className="text-center">
                    <h1>Víno pre každú príležitosť!</h1>
                    <p>
                        Využi náš super jednoduchý generátor perfekných darčekov a poskladaj si víno ako
                        ušité na mieru pre každú vhodnú (i nevhodnú) príležitosť. 
                        Na výber máš obrovské množstvo kombinácii vín a etikiet, tak neváhaj a začni skladať!
                    </p>
                </Col>
            </Row>
            <Row  className="text-center">
                <Col md={{span:4}}>
                    <h4>Vyber si víno</h4>
                </Col>
                <Col md={{span:4, offset:4}}>
                    <h4>Vyber si etiketu</h4>
                </Col>
            </Row>
            <Row style={{height: '55vh'}}>
                <Col md={4} style={{height: '100%', overflowY: 'scroll', alignContent: 'flex-start'}} className="d-flex flex-wrap">
                    {wines.map(wine =>
                        <div
                            key={wine._id}
                            style={{
                                height: '0',
                                width: '48%',
                                paddingBottom: '48%',
                                borderRadius: '8px',
                                margin: '1%',
                                background: `url(${getImage(wine.imageLink)}) no-repeat center`,
                                backgroundSize: 'contain',
                                backgroundColor: '#fff',
                                cursor: 'pointer'
                            }}
                            className="shadow-generator fade-over"
                            onClick={() => setWineSelected(wine)}
                        >
                            <span style={{paddingTop: '1px',backgroundColor: '#fff'}}>
                                {wine.itemName}
                                <br />
                                {wine.price} €
                            </span>
                        </div>
                    )}
                </Col>
                <Col md={4} style={{border: '3px solid #2c1111', backgroundColor: '#fff'}} className="d-flex text-center">
                    {wineSelected?._id &&
                        <div
                            key={wineSelected._id}
                            style={{
                                height: '30vh',
                                width: '100%',
                                margin: '16px',
                                backgroundSize: 'contain',
                                backgroundColor: '#fff',
                                position: 'relative',
                            }}
                        >
                            <h4>
                                {wineSelected.itemName}&nbsp;
                                
                                <Button disabled={!!!labelSelected._id} onClick={() => addItemToCart(wineSelected._id, wineSelected.shopId, labelSelected)} variant="dark">
                                    <FiShoppingCart />
                                </Button></h4>
                            <h5>
                                {labelSelected._id ? 
                                    (Number(wineSelected.price.replace(',','.')) + labelSelected.price)
                                        .toFixed(2).toString().replace('.', ',') : 
                                    wineSelected.price
                                } €
                            </h5>
                            <figure style={{position: 'relative', width: '100px', height: '45vh', margin: '0 auto'}}>
                                <img 
                                    src={bottleByColor[wineSelected.color]}
                                    style={{
                                        height: '35vh'
                                    }}
                                />
                                {labelSelected._id &&
                                    <img 
                                        src={getImage(labelSelected.imageLink)}
                                        style={{
                                            position: 'absolute',
                                            top: 134,
                                            left: 16,
                                            height: '100px'
                                        }}
                                    />
                                }
                            </figure>
                        </div>
                    }
                </Col>
                <Col md={4} style={{height: '100%', overflowY: 'scroll', alignContent: 'flex-start'}} className="d-flex flex-wrap">
                    {labels.map(label =>
                        <div
                            key={label._id}
                            style={{
                                height: '0',
                                width: '48%',
                                paddingBottom: '48%',
                                borderRadius: '8px',
                                margin: '1%',
                                background: `url(${getImage(label.imageLink)}) no-repeat center`,
                                backgroundSize: 'contain',
                                backgroundColor: '#fff',
                                cursor: 'pointer'
                            }}
                            className="shadow-generator fade-over"
                            onClick={() => setLabelSelected(label)}
                        >
                            {isOwner &&
                            <Button
                                onClick={() => deleteCard(label._id)}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    marginBottom: "0px",
                                    zIndex: "+5"
                                }}
                                variant="outline-danger"
                                >
                                <MdDelete style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
                            </Button>}
                            <span style={{paddingTop: '2px', borderTopLeftRadius: '8px' ,backgroundColor: '#fff'}}>
                                {isOwner && label.name}
                                &nbsp;{label.price.toFixed(2).toString().replace('.', ',')} €
                            </span>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}