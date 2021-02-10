import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import AddEvent from './AddEvent'

import {MdDateRange, MdLocationOn, MdDelete} from 'react-icons/md'

export default ({isOwner}) => {
    const [eventsData, setEventsData] = useState([])
    const [eventPopup, setEventPopup] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const getImage = (image) => {
        try {
            const img = require(`../../../../src/uploads/${image.replace(/_/g, '-')}`);
            return img;
        } catch {
            return null;
        }
    };

    const deleteCard = (eventId) => {
        axios.delete(`http://localhost:5000/events/${eventId}/`)
            .then(() => setRefresh(!refresh))
            .catch((err) => err && console.log(`Error ${err}`));
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/events/`)
            .then(res => setEventsData(res.data))
            .catch(err => err && console.log(err))
    }, [refresh])

    const handleSubmit = (passLink) => {
        const win = window.open(passLink, "_blank");
        win.focus();
    }

    const ShowEvents = () => {
        return eventsData.map(event => {
            const { _id, name, link, description, imageLink, when, where } = event
            return (
                <Col key={_id} style={{maxWidth:'400px'}} className="mt-4" sm={12} md={6} lg={4}>
                    <Card className="h-100">
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
                        <Card.Img variant="top" style={{ maxHeight: '250px' }} src={getImage(imageLink) ? getImage(imageLink) : imageLink} />
                        <Card.Body>
                            <Card.Title>{name}<Button onClick={() => handleSubmit(link)} size="sm" variant="dark" style={{float: 'right', marginTop: '-5px'}}>Viac info</Button></Card.Title>
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
            {eventPopup &&
                <AddEvent refresh={refresh} setRefresh={setRefresh} setEventPopup={setEventPopup} eventPopup={eventPopup} />
            }
            {isOwner &&
            <Row className="justify-content-center" >
                <Button className="mt-4" variant="dark" onClick={() => setEventPopup(true)}>Pridat Event</Button>
            </Row>}
            <Row className="justify-content-center justify-content-md-start" >
                <ShowEvents />
            </Row>
        </Container>
    )
}