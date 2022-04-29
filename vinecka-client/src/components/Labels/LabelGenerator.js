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
import unnamed from './unnamed.jpg'

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
    const bottleByColor = {
        "biele": whiteBottle,
        "červené": redBottle,
        "ružové": roseBottle
    }
    const addItemToCart = (itemId, shopId, label) => {        
        if (shoppingCart.find(val => val.itemId === itemId && val.label?._id === label._id)) {
          const newShoppingCart = shoppingCart.map(item => {
            if (item.itemId === itemId && item.label?._id === label._id) {                
                return {...item, count: item.count + 1}
            }
            return item
          })
          return setShoppingCart(newShoppingCart)
        } else {
          const newItem = { shopId, itemId, label, count: 1 }
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
    }, [])
    console.log(wines)
    return (
        loading ? (
            <Spinner
              style={{ marginLeft: "49%", marginTop: "20%" }}
              animation="border"
            />
          ) : 
        <Container className="py-4" fluid>
            <Row style={{height: '65vh'}}>
                <Col xs={12} md={4} style={{height: '100%', overflowY: 'scroll', alignContent: 'flex-start'}} className="d-flex flex-wrap">
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
                            }}
                            className="shadow-generator"
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
                <Col xs={12} md={4} style={{border: '3px solid #2c1111', backgroundColor: '#fff'}} className="d-flex text-center">
                    {wineSelected?._id &&
                        <div
                            key={wineSelected._id}
                            style={{
                                height: '0',
                                width: '100%',
                                margin: '16px',
                                paddingBottom: '100%',
                                backgroundSize: 'contain',
                                backgroundColor: '#fff',
                            }}
                        >
                            <h4>{wineSelected.itemName}</h4>
                            <h5>
                                {labelSelected._id ? 
                                    (Number(wineSelected.price.replace(',','.')) + labelSelected.price)
                                        .toFixed(2).toString().replace('.', ',') : 
                                    wineSelected.price
                                } €
                            </h5>
                            <figure style={{position: 'relative', width: '100px', margin: '0 auto'}}>
                                <img 
                                    src={bottleByColor[wineSelected.color]}
                                    style={{
                                        height: '50vh'
                                    }}
                                />
                                {labelSelected._id &&
                                    <img 
                                        src={unnamed}
                                        style={{
                                            position: 'absolute',
                                            top: 190,
                                            left: 4,
                                            height: '145px'
                                        }}
                                    />
                                }
                            </figure>
                            <Button style={{width: "100%"}} onClick={() => addItemToCart(wineSelected._id, wineSelected.shopId, labelSelected)} variant="dark">
                                Pridať do košíka.
                            </Button>
                        </div>
                    }
                </Col>
                <Col xs={12} md={4} style={{height: '100%', overflowY: 'scroll', alignContent: 'flex-start'}} className="d-flex flex-wrap">
                    {labels.map(label =>
                        <div
                            key={label._id}
                            style={{
                                height: '0',
                                width: '48%',
                                paddingBottom: '48%',
                                borderRadius: '8px',
                                margin: '1%',
                                background: `url(${label.imageLink}) no-repeat center`,
                                backgroundSize: 'contain',
                                backgroundColor: '#fff',
                            }}
                            className="shadow-generator"
                            onClick={() => setLabelSelected(label)}
                        >
                            <span style={{paddingTop: '2px', borderTopLeftRadius: '8px' ,backgroundColor: '#fff'}}>
                                &nbsp;{label.price.toFixed(2).toString().replace('.', ',')} €
                            </span>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}