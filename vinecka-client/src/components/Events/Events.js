import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import CardColumns from 'react-bootstrap/CardColumns'

import MapPopup from '../Contact/MapPopup'

import AddEvent from './AddEvent'
import EditEvent from './EditEvent'

import {MdDateRange, MdLocationOn, MdDelete, MdEdit} from 'react-icons/md'

export default ({isOwner}) => {
    const [eventsData, setEventsData] = useState([])
    const [eventPopup, setEventPopup] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [editing, setEditing] = useState('')
    const [showMapPopup, setShowMapPopup] = useState('')

    const handleEditing = (e) => {
        const itemId = e.currentTarget.parentNode.id;
        let editingObj = {}
        editingObj[itemId] = true
        setEditing({...editing, ...editingObj})
    }

    const getImage = (image) => {
        try {
            const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
            return img;
        } catch {
            return null;
        }
    };

    const deleteCard = (eventId) => {
        axios.delete(`https://mas-vino.herokuapp.com/events/${eventId}/`)
            .then(() => setRefresh(!refresh))
            .catch((err) => err && console.log(`Error ${err}`));
    };

    const sortEventsData = (data) => {
        return data.sort((a, b) => (a.when < b.when) ? 1 : -1)
    }

    useEffect(() => {
        axios.get(`https://mas-vino.herokuapp.com/events/`)
            .then(res => {
                const events = res.data
                const result = sortEventsData(events)
                setEventsData(result)
            })
            .catch(err => err && console.log(err))
    }, [refresh])

    const handleSubmit = (passLink) => {
        const win = window.open(passLink, "_blank");
        win.focus();
    }

    const ShowEvents = () => {
        const output = eventsData.map((event, i) => {
            const { _id, name, link, description, imageLink, when, where, until } = event
            return (
                <Card key={_id} className="h-100 mt-4" id={_id}>
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
                        <EditEvent refresh={refresh} setRefresh={setRefresh} setEventPopup={setEditing} eventPopup={editing[_id]} eventData={event} />
                    }
                    <Card.Img variant="top" style={{ height: '350px', width: '100%', objectFit: 'cover' }} src={getImage(imageLink) ? getImage(imageLink) : imageLink} />
                    <Card.Body>
                        <Card.Title>{name}<Button onClick={() => handleSubmit(link)} size="sm" variant="dark" style={{float: 'right'}}>Viac info</Button></Card.Title>
                        <Card.Text dangerouslySetInnerHTML={{__html: description}}></Card.Text>
                    </Card.Body>
                    {(when || where) &&
                    <Card.Footer>
                        <small className="text-muted">
                            <MdDateRange style={{fontSize: '130%'}} /> {when}{until && ` - ${until}`}
                            <br /> 
                            <a className="link-no-deco" onClick={() => setShowMapPopup(where)}><MdLocationOn style={{fontSize: '130%'}} /> {where}</a>
                        </small>
                    </Card.Footer>}
                </Card>
            )
        })
        const colRight = output.filter((card,i) => i%2 === 0)
        const colLeft = output.filter((card,i) => i%2 !== 0)
        return (
            <Row className="justify-content-center justify-content-md-start" >
                <Col className={`mt-4 h-100`} md={12} lg={6}>
                    {colRight}
                </Col>
                <Col className={`mt-4 h-100`} md={12} lg={6}>
                    {colLeft}
                </Col>
            </Row>
        )
    }

    return (
        <Container className="mb-4">
            {showMapPopup &&
                <MapPopup geoString={showMapPopup} showMapPopup={showMapPopup} setShowMapPopup={setShowMapPopup} />
            }
            {eventPopup &&
                <AddEvent refresh={refresh} setRefresh={setRefresh} setEventPopup={setEventPopup} eventPopup={eventPopup} />
            }
            {isOwner &&
            <Row className="justify-content-center" >
                <Button className="mt-4" variant="dark" onClick={() => setEventPopup(true)}>Pridat Event</Button>
            </Row>}
            <ShowEvents />
        </Container>
    )
}