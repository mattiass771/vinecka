import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

export default ({featuredsPopup, getImage, setFeaturedsPopup, forceRefresh, setForceRefresh, featuredIds}) => {
    const [featured, setFeatured] = useState([])
    const [featuredWines, setFeaturedWines] = useState([])

    useEffect(() => {
        setFeatured(featuredIds)
    }, [])

    useEffect(() => {
        if (featured.length === 4) {
            setFeaturedWines([])
            let featuredArr = ['','','','']
            featured.map((item, i) => {
                    axios.get(`https://mas-vino.herokuapp.com/shop/find-item-by-id/${item}`)
                      .then(res => {
                        const response = res.data
                        const newObj = {...response[0], shopId: response[1]}
                        featuredArr[i] = newObj
                      })
                      .catch(err => err && console.log('Error while setting full featured wines, ', err))
                      .then(() => setFeaturedWines([...featuredArr]))
                })
        }
    }, [featured])

    const handleSave = () => {
        axios.post(`https://mas-vino.herokuapp.com/home/featured-wines`, { featuredWines: featured })
            .then(res => {
                setForceRefresh(!forceRefresh)
                setFeaturedsPopup('')
            })
            .catch(err => err && err.data)
    }

    return (
        <Modal show={featuredsPopup} onHide={() => setFeaturedsPopup(false)}>
            <Modal.Body className="text-center">
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        {featuredWines.length > 3 &&
                        <>
                            <h5>{featuredWines[0].itemName}</h5>
                            <img style={{maxHeight: '100px', maxWidth: '80px'}} src={getImage(featuredWines[0].imageLink) || featuredWines[0].imageLink} />
                        </>
                        }
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                    <input
                        value={featured.length > 3 && featured[0]}
                        className="form-control text-center"
                        name="featured0"
                        type="text"
                        onChange={(e) => setFeatured([e.target.value, featured[1], featured[2], featured[3]])}
                        placeholder="povinne"
                    />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        {featuredWines.length > 3 &&
                        <>
                            <h5>{featuredWines[1].itemName}</h5>
                            <img style={{maxHeight: '100px', maxWidth: '80px'}} src={getImage(featuredWines[1].imageLink) || featuredWines[1].imageLink} />
                        </>
                        }
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                    <input
                        value={featured.length > 3 && featured[1]}
                        className="form-control text-center"
                        name="featured1"
                        type="text"
                        onChange={(e) => setFeatured([featured[0], e.target.value,  featured[2], featured[3]])}
                        placeholder="povinne"
                    />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        {featuredWines.length > 3 &&
                        <>
                            <h5>{featuredWines[2].itemName}</h5>
                            <img style={{maxHeight: '100px', maxWidth: '80px'}} src={getImage(featuredWines[2].imageLink) || featuredWines[2].imageLink} />
                        </>
                        }
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                    <input
                        value={featured.length > 3 && featured[2]}
                        className="form-control text-center"
                        name="featured2"
                        type="text"
                        onChange={(e) => setFeatured([featured[0], featured[1], e.target.value, featured[3]])}
                        placeholder="povinne"
                    />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                        {featuredWines.length > 3 &&
                        <>
                            <h5>{featuredWines[3].itemName}</h5>
                            <img style={{maxHeight: '100px', maxWidth: '80px'}} src={getImage(featuredWines[3].imageLink) || featuredWines[3].imageLink} />
                        </>
                        }
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="form-group text-center mt-1">
                    <input
                        value={featured.length > 3 && featured[3]}
                        className="form-control text-center"
                        name="featured3"
                        type="text"
                        onChange={(e) => setFeatured([featured[0], featured[1], featured[2], e.target.value])}
                        placeholder="povinne"
                    />
                    </Col>
                </Row>
            <br />
            {featured ?
                <Button variant="dark" onClick={() => handleSave()}>
                    Upravit
                </Button> :
                <Button disabled variant="dark">
                    Upravit
                </Button>
            }&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="dark" onClick={() => setFeaturedsPopup(false)}>
                Zrusit
            </Button>
            </Modal.Body>
        </Modal>
    )
}