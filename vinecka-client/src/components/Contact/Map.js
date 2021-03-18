import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import logo from './marker_transparent.png'

export default withScriptjs(withGoogleMap((props) => {
    return (
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: 48.282568631514685, lng: 17.252950813557483 }}
        >
            <div style={{height: '5px '}}>
            <Marker 
                icon={{
                    url: logo
                }}
                position={{ lat: 48.282411181745005, lng: 17.25283474894052 }} 
            />
            </div>
        </GoogleMap>
    )
}))