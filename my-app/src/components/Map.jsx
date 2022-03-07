import React, { Component,useState,useEffect } from 'react';
import { Marker, GoogleMap, KmlLayer, LoadScript, Polygon, useGoogleMap, GoogleMapsMarkerClusterer, Polyline, MapContext } from '@react-google-maps/api';
import db from './firebase.config';
import './Map.css'
import data from '../states2.json'

let objs = []
let objCoords = []
let finalStateCoords = []
const countyCoords = []


//Compiles wanted data from JSON (name/ID/coords) into JS objects and saves in array
for (let i = 0; i < data.features.length; i++) {
  let newObj = new Object()
  newObj.name = data.features[i].properties.name
  newObj.id = data.features[i].id
  newObj.coordinates = data.features[i].geometry.coordinates
  // newObj.coordinates = flatten(newObj.coordinates)
  objCoords.push(data.features[i].geometry.coordinates)
  objs.push(newObj)
}

//loads coordinates into separate arrays, each index is its own state
function fillObjCoords() {
  for(let i = 0; i < objs.length; i++) {
    let stateArray = objs[i].coordinates
    for(let j = 0; j < stateArray.length; j++) {
      let miniArray = stateArray[j]
      for(let k = 0; k < miniArray.length; k++){
        let thirdArray = miniArray[k]
        thirdArray.flatten(Infinity)
        if(thirdArray.length > 2) {
          for(let l = 0; l < thirdArray.length; l++){
            let fourthArray = thirdArray[l]
            let newObj = new Object()
            newObj.lat = fourthArray[1]
            newObj.lng = fourthArray[0]
            objCoords[i].push(newObj)
          }
        } else {
            let newObj = new Object()
            //let holder = new google.maps.LatLng(thirdArray[0], thirdArray[1])
            newObj.lat = thirdArray[1]
            newObj.lng = thirdArray[0]
            newObj[i].push(newObj)
            objCoords[i].push(newObj)
         }
        
      }
    }
  }
}

// getCounties()
// function getCounties() {
//   for(let i = 0; i < countyData.length; i++){
//     let holder = countyData.features[i].geometry
//     countyCoords.push(holder)
//   }
//   console.log(countyCoords)
// }



//MAP STYLES ------------
//map container style
const containerStyle = {
  width: '85%',
  height: '600px',
  float: 'right',
  
};


const center = {
  lat: 39.8283,
  lng: -98.5795,
};

//polygon draw options
const options = {
  fillColor: "lightblue",
  fillOpacity: .5,
  strokeColor: "black",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}


//maps json coordinates to single level long array of coordinates
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
          //let holder = google.maps.LatLng(fourthArray[0], fourthArray[1])
          newObj.lat = fourthArray[1]
          newObj.lng = fourthArray[0]
          coordinates.push(newObj)
        }
      //add coordinates to 'coordinates' array
      } else {
          let newObj = new Object()
          //let holder = new google.maps.LatLng(thirdArray[0], thirdArray[1])
          newObj.lat = thirdArray[1]
          newObj.lng = thirdArray[0]
          coordinates.push(newObj)
      }
    }
  }
}

console.log(objs)

let fullStates = []
function stateParse() {
  for(let i = 0; i < objs.length; i++) {
    let newArr = []
    //this is 0.coordinates.i
    let coords = objs[i].coordinates
    if(coords.length === 1) {
      let holder = coords[0]
      for(let j = 0; j < holder.length; j++) {
        let holderTwo = holder[j]
        let newObj = new Object()
        newObj.lat = holderTwo[1]
        newObj.lng = holderTwo[0]
        newObj.name = objs[i].name
        newArr.push(newObj)
      }
    } 
    else if(coords.length > 1) {
      for(let j = 0; j < coords.length; j++){
        let coordstepone = coords[j]
        for(let k = 0; k < coordstepone.length; k++){
          let secondArr = []
          let coordsteptwo = coordstepone[k]
          for(let l = 0; l < coordsteptwo.length; l++){
            let coordstepthree = coordsteptwo[l]
            let newObj = new Object()
            newObj.lat = coordstepthree[1]
            newObj.lng = coordstepthree[0]
            newObj.name = objs[i].name
            secondArr.push(newObj)
          }
          fullStates.push(secondArr)
        }
        
      }
    }

    
    fullStates.push(newArr)
  }
}

stateParse()
console.log(fullStates)



function Map()  {
  const [stateList, setStateList] = useState([])

  useEffect(() => {
    fetchStates();
  }, [])
  
  
  const fetchStates=async() => {
    const response = db.document('states')
    const data = await response.get();
    data.docs.forEach(item=> {
      setStateList([...stateList, item.data()])
    })
  }
  
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          mapContainerStyle={containerStyle}
        >
          {fullStates.map((e) => (
            <Polygon
              paths = {e}
              options = {options}
              />
          ))}



          
        </GoogleMap>
      </LoadScript>

    )
    
}

export default Map
