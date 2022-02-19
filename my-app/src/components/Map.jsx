import React, { Component,useState,useEffect } from 'react';
import { GoogleMap, KmlLayer, LoadScript, Polygon } from '@react-google-maps/api';
import db from './firebase.config';
import './Map.css'
import data from '../states2.json'

let objs = []
//Compiles wanted data from JSON (name/ID/coords) into JS objects and saves in array
for (let i = 0; i < data.features.length; i++) {
  let newObj = new Object()
  newObj.name = data.features[i].properties.name
  newObj.id = data.features[i].id
  newObj.coordinates = data.features[i].geometry.coordinates
  objs.push(newObj)
}


let coordinates = []
for(let i = 0; i < objs.length; i++){
  //this is the coordinates of state @ i
  let crdArray = objs[i].coordinates
  for(let j = 0; j < crdArray.length; j++){
    //this is the first array of coordinate arrays @ state @ i
    let secondArray = crdArray[j]
    for(let k = 0; k < secondArray.length; k++){
      let thirdArray = secondArray[k]
      //check if nested object contains more nested arrays
      if(thirdArray.length > 2){
        for(let l = 0; l < thirdArray.length; l++){
          let fourthArray = thirdArray[l]
          let newObj = new Object()
          newObj.lat = fourthArray[0]
          newObj.lng = fourthArray[1]
          coordinates.push(newObj)
        }
      //add coordinates to 'coordinates' array
      } else {
          let newObj = new Object()
          newObj.lat = thirdArray[0]
          newObj.lng = thirdArray[1]
          coordinates.push(newObj)
      }
    }
  }
}

console.log(coordinates)


const containerStyle = {
  width: '85%',
  height: '600px',
  float: 'right',
  
};


const center = {
  lat: 39.8283,
  lng: -98.5795,
};

// const options = {
//   fillColor: "lightblue",
//   fillOpacity: 1,
//   strokeColor: "red",
//   strokeOpacity: 1,
//   strokeWeight: 2,
//   clickable: false,
//   draggable: false,
//   editable: false,
//   geodesic: false,
//   zIndex: 1
// }



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
          // polygons={
          //   this.props.coordinates.map((p, i) => {
          //     return({
          //       boundaries: p
          //     })
          //   })
          // }
        >
          { /* Child components, such as markers, info windows, etc. */ }
          {/* { <KmlLayer id='stateBorder' url="https://www.nohrsc.noaa.gov/data/vector/master/cnt_us.kmz" 
          options={{ preserveViewport: true }}
          /> } */}
          <Polygon
            paths={coordinates}
            editable={false}
            key={1}
            options={{
              fillColor: "yellow",
              fillOpacity: .4,
              strokeColor: "red",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: false,
              draggable: false,
              editable: false,
              geodesic: false,
              zIndex: 1
            }}
          />
        </GoogleMap>
      </LoadScript>

    )
  }
}

export default Map;