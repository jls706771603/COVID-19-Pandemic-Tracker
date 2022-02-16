
import React, { Component,useState,useEffect } from 'react';
import { GoogleMap, KmlLayer, LoadScript, Polygon } from '@react-google-maps/api';
import db from './firebase.config';
import './Map.css'
import data from '../states2.json'




const containerStyle = {
  width: '85%',
  height: '600px',
  float: 'right',
  
};


const center = {
  lat: 39.8283,
  lng: -98.5795,
};

const options = {
  fillColor: "lightblue",
  fillOpacity: 1,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}
const onLoad = polygon => {
  console.log("polygon: ", polygon);
}


class Map extends Component {
    //   const [usaList, setUsaList]=useState([])

    // useEffect(() => {
    //   fetchUsaList();
    // }, [])

    // const fetchUsaList=async() => {
    //   const response = db.collection('usa/usaList')
    //   const data = await response.get();
    //   data.docs.forEach(item => {
    //     setUsaList([...usaList, item.data()])
    //     console.log(item.cases)
    //   })
    // }

  render() {
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap id="map"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          { <KmlLayer id='stateBorder' url="https://www.nohrsc.noaa.gov/data/vector/master/cnt_us.kmz" 
          options={{ preserveViewport: true }}
          /> }
          <Polygon
            path={data.coordinates}
            onLoad={onLoad}
            key={1}
            options={options}
          />
        </GoogleMap>
      </LoadScript>

    )
  }
}

export default Map;