import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import AddService from './AddService'
import EditService from './EditService'

import {MdDateRange, MdLocationOn, MdDelete, MdEdit} from 'react-icons/md'

export default ({isOwner}) => {
    const [servicesData, setServicesData] = useState([])
    const [servicePopup, setServicePopup] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [editing, setEditing] = useState('')

    const handleEditing = (e) => {
        const itemId = e.currentTarget.parentNode.id;
        let editingObj = {}
        editingObj[itemId] = true
        setEditing({...editing, ...editingObj})
    }

    const getImage = (image) => {
        try {
            const img = require(`../../../../src/uploads/${image.replace(/_/g, '-')}`);
            return img;
        } catch {
            return null;
        }
    };

    const deleteCard = (serviceId) => {
        axios.delete(`http://localhost:5000/services/${serviceId}/`)
            .then(() => setRefresh(!refresh))
            .catch((err) => err && console.log(`Error ${err}`));
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/services/`)
            .then(res => {
                const result = res.data
                setServicesData(result)
            })
            .catch(err => err && console.log(err))
    }, [refresh])

    const handleSubmit = (passLink) => {
        const win = window.open(passLink, "_blank");
        win.focus();
    }

    const ShowServices = () => {
        return servicesData.map(service => {
            const { _id, name, link, description, imageLink, when, where } = service
            return (
                <Col key={_id} style={{maxWidth:'800px'}} className="mt-4" md={12} lg={6}>
                    <Card bg="dark" text="white" className="h-100" id={_id}>
                        {isOwner &&
                            <Button
                                onClick={() => deleteCard(_id)}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    marginBottom: "-40px",
                                    zIndex: "+5"
                                }}
                                variant="outline-danger"
                                >
                                <MdDelete style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
                            </Button>}
                        {isOwner &&
                        <Button
                            onClick={(e) => handleEditing(e)}
                            style={{
                                width: "40px",
                                height: "40px",
                                marginBottom: "-40px",
                                marginLeft: "40px",
                                zIndex: "+5"
                            }}
                            variant="outline-warning"
                            >
                            <MdEdit style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
                            </Button>}
                            
                        {editing &&
                            <EditService refresh={refresh} setRefresh={setRefresh} setServicePopup={setEditing} servicePopup={editing[_id]} serviceData={service} />
                        }
                        <Card.Img variant="top" style={{ height: '350px' }} src={getImage(imageLink) ? getImage(imageLink) : imageLink} />
                        <Card.Body>
                            <Card.Title>{name}<Button onClick={() => handleSubmit(link)} size="sm" variant="outline-light" style={{float: 'right', marginTop: '-5px'}}>Viac info</Button></Card.Title>
                            <Card.Text>{description}</Card.Text>
                        </Card.Body>
                        {(when || where) &&
                        <Card.Footer>
                            <small className="text-muted"><MdDateRange style={{fontSize: '130%'}} /> {when}<br /> <MdLocationOn style={{fontSize: '130%'}} /> {where}</small>
                        </Card.Footer>}
                    </Card>
                </Col>
            )
        })
    }

    return (
        <Container className="mb-4">
            {servicePopup &&
                <AddService refresh={refresh} setRefresh={setRefresh} setServicePopup={setServicePopup} servicePopup={servicePopup} />
            }
            {isOwner &&
            <Row className="justify-content-center" >
                <Button className="mt-4" variant="dark" onClick={() => setServicePopup(true)}>Pridat Sluzbu</Button>
            </Row>}
            <Row className="justify-content-center justify-content-md-start" >
                <ShowServices />
            </Row>
        </Container>
    )
}