import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import Map from './Map'

export default ({geoString, showMapPopup, setShowMapPopup}) => {
    const [geoLocation, setGeoLocation] = useState('') 
    
    useEffect(() => {
        if (geoString) {
            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${geoString.replace(/ /g, '+')}&key=AIzaSyBoH4TWYVkhYfKSLFAlTn-h4nGOZrLR2SI`)
                .then(res => {
                    const result = res.data.results
                    const location = result[0].geometry.location
                    console.log(location)
                    setGeoLocation(location)
                })
                .catch(err => console.log(`Error getting geodata from google: ${err}`))
        } else {
            setGeoLocation({ lat: 48.282411181745005, lng: 17.25283474894052 })
        }
    }, [])

    return (
        <Modal size="lg" show={showMapPopup !== ''} onHide={() => setShowMapPopup('')}>
            <Modal.Body className="text-center" style={{fontSize: "90%", backgroundColor: 'whitesmoke'}}>
                    {geoLocation &&
                    <Map 
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBoH4TWYVkhYfKSLFAlTn-h4nGOZrLR2SI&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        lat={geoLocation.lat}
                        lng={geoLocation.lng}
                    />}
            </Modal.Body>
            <Modal.Footer className="row justify-content-center">
                <Button variant="dark" onClick={() => setShowMapPopup('')}>
                    Zavrieť
                </Button>
            </Modal.Footer>
        </Modal>
    )
}