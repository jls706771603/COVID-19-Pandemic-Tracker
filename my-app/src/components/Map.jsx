import React, { Component,useState,useEffect, useRef } from 'react';
import { Marker, GoogleMap, LoadScript, Polygon, useGoogleMap, GoogleMapsMarkerClusterer, MapContext } from '@react-google-maps/api';
import db from './firebase.config';
import './Map.css'
import data from '../states2.json'
import countyData from '../counties.json'
import { collection, doc, query, QuerySnapshot, getDoc } from 'firebase/firestore/lite';
import { ref, push, getDatabase, get, child } from 'firebase/database'

let objs = []
let objCoords = []
let finalStateCoords = []
const countyCoords = []

//
for (let i = 0; i < countyData.features.length; i++) {
  let newObj = new Object()
  newObj.coordinates = countyData.features[i].geometry.coordinates
  newObj.name = countyData.features[i].properties.NAME
  newObj.countyNum = countyData.features[i].properties.COUNTY
  newObj.stateNum = countyData.features[i].properties.STATE
  countyCoords.push(newObj)
}


console.log("County Coords: " + JSON.stringify(countyCoords))
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




//MAP STYLES ------------
//map container style
const containerStyle = {
  width: '85%',
  height: '600px',
  float: 'right',
  
};
const defaultMapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  minZoom: 3
}


const center = {
  lat: 39.8283,
  lng: -98.5795,
};

//polygon & map options options
const highOptions = {
  fillColor: "red",
  fillOpacity: .4,
  strokeColor: "black",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

const medOptions = {
  fillColor: "yellow",
  fillOpacity: .4,
  strokeColor: "black",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

const lowOptions = {
  fillColor: "green",
  fillOpacity: .4,
  strokeColor: "black",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}
const defOptions = {
  fillColor: "black",
  fillOpacity: .2,
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

//parses county coordinates to compile array of single level coordinate index of each county
// let fullCounties = []
// function countyParse() {
//   for(let i = 0; i < countyCoords.length; i++){
//     let newArr = []
//     let coords = countyCoords[i].coordinates
//     console.log("Coords Length: " + coords.length)
//     if(coords.length <= 1){
//       let holder = coords[0]
//       for(let j = 0; j < holder.length; j++){
//         let holderTwo = holder[j]
//         let newObj = new Object()
//         newObj.lat = holderTwo[1]
//         newObj.lng = holderTwo[0]
//         newObj.countyName = countyCoords[i].name
//         newObj.countyNum = countyCoords[i].countyNum
//         newObj.stateNum = countyCoords[i].stateNum
//         newArr.push(newObj)
//         console.log("County Name: " + newObj.countyName)
//       }
//     } else {   
//         for(let j = 0; j < coords.length; j++){
//           let coordstepone = coords[j]
//           console.log(coords)
//           for(let k = 0; k < coordstepone.length; k++){
//             let secondArr = []
//             let coordsteptwo = coordstepone[k]
//             for(let l = 0; l < coordsteptwo.length; l++){
//               let coordstepthree = coordsteptwo[l]
//               let newObj = new Object()
//               newObj.lat = coordstepthree[1]
//               newObj.lng = coordstepthree[0]
//               newObj.countyName = countyCoords[i].name
//               newObj.countyNum = countyCoords[i].countyNum
//               newObj.stateNum = countyCoords[i].stateNum
//               secondArr.push(newObj)
//             }
//             fullCounties.push(secondArr)
//           }
//         }
//       }
  
//     fullCounties.push(newArr)
//   }
// }
// countyParse()
// console.log(fullCounties)


//parses state coordinates to compile array of single level coordinate index of each state

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
        newObj.options = defOptions
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
            newObj.options = defOptions
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
//filter empty arrays from stateList
fullStates = fullStates.filter((e) => {
  return e.length > 0
})

// fullCounties = fullCounties.filter((e) => {
//   return e.length > 0
// })

// ------------------------------ MAP -----------------------------
function Map()  {
  const [stateList, setStateList] = useState([])
  const [countyList, setCountyList] = useState([])
  const [stateInfo, setStateInfo] = useState([])
  const [countyInfo, setCountyInfo] = useState([])
  const dbRef = ref(getDatabase())
  const [countyMap, setCountyMap] = useState(false)

  //pulls state list data to sync with polygon coordinates
  useEffect(() => {
    get(child(dbRef, `states/stateList`)).then((snapshot => {
      if(snapshot.exists()) {
        setStateInfo(snapshot.val())
      } else {
        console.log("No data!")
      }
    }))
  }, [])

  // useEffect(() => {
  //   get(child(dbRef, `counties/countyList`)).then((snapshot => {
  //     if(snapshot.exists()) {
  //       setStateInfo(snapshot.val())
  //     } else {
  //       console.log("No data!")
  //     }
  //   }))
  // }, [])

  //syncs stateList state for mapping from stateParse function, fires updatePolygons to update state options for coloring
  useEffect(() => {
    const interval = setInterval(() => {
      updatePolygons()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateCounties()
  //    }, 30000)
  //    return () => clearInterval(interval)
  // }, [])

  
//returns proper set of polygon options based on caseRate
  function getOptions(caseRate) {
    if(caseRate > .25){
      return highOptions
    } else if (caseRate < .10) {
      return lowOptions
    } else {
      return medOptions
    }
  }

//updates options in stateList associated with polygon coordinates
  function updatePolygons() {
    console.log("Update Polygons")
    stateInfo.forEach((state) => {
      console.log(state.name)
      let caseRate = state.cases/state.population
      state.caseRate = caseRate
      fullStates.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name){
              f.options = getOptions(caseRate)
              console.log(f.options)
          }
        })
      })   
    })
    setStateList(fullStates)
    console.log("Map Refreshed")
    console.log(stateList)
  }

  // function updateCounties() {
  //   countyInfo.forEach((county) => {
  //     console.log(county.name)
  //     let caseRate = county.cases/county.population
  //     county.caseRate = caseRate
  //     fullCounties.forEach((e) => {
  //       e.forEach((f) => {
  //         if (f.name === county.name){
  //           f.options = getOptions(caseRate)
  //         }
  //       })
  //     })
  //   })
  //   setCountyList(fullCounties)
  //   console.log("Map Refreshed")
  // }
  // console.log("State List + " + JSON.stringify(stateList))
  // console.log("State Info + " + JSON.stringify(stateInfo))


    return (
      //Map View Buttons
      <div>
      {!countyMap && (
        <button onClick={() => setCountyMap(true)}>County View</button>
      )}
      {countyMap && (
        <button onClick={() => setCountyMap(false)}>State View</button>
      )}

      {/* County Map View
      {countyMap && (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          mapContainerStyle={containerStyle}
          options = {defaultMapOptions}
        >
          {countyList.map((e) => (
            <Polygon
              paths = {e}
              options = {e[0].options}
              key = {e[0].lat+e[0].lng+e[0].countyNum}
              />
          ))}
          
        </GoogleMap>
      </LoadScript>)} */}

      {/* State Map View */}
      {!countyMap && (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          mapContainerStyle={containerStyle}
          options = {defaultMapOptions}
        >
          {stateList.map((e) => (
            <Polygon
              paths = {e}
              options = {e[0].options}
              key = {e[0].lat+e[0].lng}
              />
          ))}
          
        </GoogleMap>
      </LoadScript>)}
      </div>


    )
    
}

export default Map