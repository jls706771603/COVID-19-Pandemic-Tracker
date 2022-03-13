import React, { Component,useState,useEffect } from 'react';
import { GoogleMap, LoadScript, Polygon, InfoWindow } from '@react-google-maps/api';
import db from './firebase.config';
import { ref, push, getDatabase, get, child } from 'firebase/database'
import './Map.css'
import data from '../states2.json'
import { collection, doc, query, QuerySnapshot, getDoc } from 'firebase/firestore/lite';

function Map()  {
  const [stateList, setStateList] = useState([])
  const [stateGeoList, setStateGeoList] = useState([])
  const [stateLoading, setStateLoading] = useState(true)
  const[selected, setSelected] = React.useState(null)
  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])
  
  //deprecated, no long need stateList
  // //pulling data from firebase, adding case rate to each doc and options, setting stateList
  // useEffect(() => {
  //   const dbRef = ref(getDatabase())
  //   get(child(dbRef, `states/stateList/`)).then((snapshot => {
  //     if (snapshot.exists()) {
  //       stateSnapshot = snapshot.val()
  //       stateSnapshot.forEach((doc) => {
  //         let optNumber = ((doc.cases)/(doc.population)*100)
  //         doc.caseCalculation = optNumber
  //         // if(optNumber > 20) {
  //         //   doc.options = highCaseOptions
  //         // } else if(12 < optNumber < 20) {
  //         //   doc.options = medCaseOptions
  //         // } else {
  //         //   doc.options = lowCaseOptions
  //         // }
  //         localStorage.setItem('State Ref', JSON.stringify(stateSnapshot))
  //       })
  //       setStateList(stateSnapshot)
  //       setStateLoading(false)
  //     } else {
  //       console.log("No data")
  //     }
  //   }))
  // }, [])

  useEffect(() => {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `stateGeo/fullStates`)).then((snapshot => {
      if (snapshot.exists()) {
        stateSnapshot = snapshot.val()
        stateSnapshot.forEach((doc) => {
          let optNumber = ((doc.cases)/(doc.population)*100)
          doc.caseCalculation = optNumber
          if(optNumber > 20) {
            doc.options = highCaseOptions
          } else if(12 < optNumber < 20) {
            doc.options = medCaseOptions
          } else {
            doc.options = lowCaseOptions
           }
          localStorage.setItem('State Ref', JSON.stringify(stateSnapshot))
        })
        setStateGeoList(stateSnapshot)
        
      } else {
        console.log("No data")
      }
    }))
  }, [])





let fullStates = []
let stateSnapshot = []
let countyObjs = []

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


const highCaseOptions = {
  fillColor: "red",
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

const medCaseOptions = {
  fillColor: "yellow",
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

const lowCaseOptions = {
  fillColor: "green",
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
//Gets correct color options for polygons
function getOptions(e) {
  if(e[0].caseRate > 30) {
    return highCaseOptions
  } else if(e[0].caseRate < 20) {
    return lowCaseOptions
  } else{
    return medCaseOptions
  }
}



  //INFO WINDOW HELPERS
  function returnCases() {
    return stateGeoList.find((e) => e.name === selected[0].name).cases
  }

  function returnDeaths() {
    return stateGeoList.find((e) => e.name === selected[0].name).deaths
  }

  function returnVac() {
    return stateGeoList.find((e) => e.name === selected[0].name).vacRate
  }
 

    return (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          // onClick={(event) => {
          //   console.log(event)
          // }}
          onload={onMapLoad}
          mapContainerStyle={containerStyle}
          options={defaultMapOptions}
        >
          {stateGeoList.map((e, index) => (
            <Polygon 
              key = {index}
              onClick = {() => {
                console.log(e)
              }}
              paths = {e}
              options = {getOptions(e)}
              
              />
          ))}

          {/* {selected ? (<InfoWindow 
          key = {selected.id}
          position={{lat:selected[0].lat, lng: selected[0].lng}}
          onCloseClick={() => {
            setSelected(null)
          }}>
            <div>
            <h2>{selected[0].name}</h2>
            <p>All Time Cases: {returnCases()}</p>
            <p>All Time Deaths: {returnDeaths()}</p>
            <p>Vaccination Rate: {returnVac()}</p>
            </div>
           </InfoWindow>) : null}  */}


          
        </GoogleMap>
        {/* {!showPolygons && <button onclick= {() => setShowPolygons(true)}>Show State Data</button>}
        {showPolygons && <button onclick= {() => setShowPolygons(false)}>Hide State Data</button>} */}
      </LoadScript>
    )
    
}

export default Map
