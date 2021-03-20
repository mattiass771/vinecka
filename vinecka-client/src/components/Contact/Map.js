import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import logo from './marker_transparent.png'

export default withScriptjs(withGoogleMap(({lat, lng}) => {
    console.log(lat, lng)
    return (
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat, lng }}
        >
            <div style={{height: '5px '}}>
            <Marker 
                icon={{
                    url: logo
                }}
                position={{ lat, lng }} 
            />
            </div>
        </GoogleMap>
    )
}))
