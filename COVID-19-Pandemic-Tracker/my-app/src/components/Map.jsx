import React, { Component,useState,useEffect, useRef } from 'react';
import { Marker, GoogleMap, LoadScript, Polygon, useGoogleMap, GoogleMapsMarkerClusterer, MapContext, InfoWindow } from '@react-google-maps/api';
import db from './firebase.config';
import './Map.css'
import data from '../states2.json'
//import countyData from '../counties.json'
import { collection, doc, query, QuerySnapshot, getDoc } from 'firebase/firestore/lite';
import { ref, push, getDatabase, get, child, set } from 'firebase/database'

let objs = []
let objCoords = []
let finalStateCoords = []
const countyCoords = []

//
/*
for (let i = 0; i < countyData.features.length; i++) {
  let newObj = new Object()
  newObj.coordinates = countyData.features[i].geometry.coordinates
  newObj.name = countyData.features[i].properties.NAME
  newObj.countyNum = countyData.features[i].properties.COUNTY
  newObj.stateNum = countyData.features[i].properties.STATE
  countyCoords.push(newObj)
}*/


// console.log("County Coords: " + JSON.stringify(countyCoords))
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
  clickable: true,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

const medHighOptions = {
  fillColor: "orange",
  fillOpacity: .4,
  strokeColor: "black",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: true,
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
  clickable: true,
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
  clickable: true,
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
  clickable: true,
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
  const [twoWeekList, setTwoWeekList] = useState([])
  const [threeMonthList, setThreeMonthList] = useState([])
  const [sixMonthList, setSixMonthList] = useState([])
  const [stateInfo, setStateInfo] = useState([])
  const [countyInfo, setCountyInfo] = useState([])
  const dbRef = ref(getDatabase())
  const [countyMap, setCountyMap] = useState(false)
  const [selectedElement, setSelectedElement] = useState();
  const [activePolygon, setActivePolygon] = useState(null);
  const [showInfoWindow, setInfoWindowFlag] = useState(true);
  const [twoWeekStateData, setTwoWeekStateData] = useState([])
  const [threeMonthsStateData, setThreeMonthsStateData] = useState([])
  const [sixMonthsStateData, setSixMonthsStateData] = useState([])
  const [mappedList, setMappedList] = useState([])
  const [twoWeekView, setTwoWeekView] = useState(true)
  const [threeMonthView, setThreeMonthView] = useState(false)
  const [sixMonthView, setSixMonthView] = useState(false)



  //pulls all time state data to sync with polygon coordinates
  useEffect(() => {
    get(child(dbRef, `states/stateList`)).then((snapshot => {
      if(snapshot.exists()) {
        setStateInfo(snapshot.val())
      } else {
        // console.log("No data!")
      }
    }))
  }, [])

  //pulls 2 week state data
  useEffect(() => {
    get(child(dbRef, `2 Week State Data/twoWeekData`)).then((snapshot => {
        if (snapshot.exists()) {
            setTwoWeekStateData(snapshot.val())
        } else {
            console.log("No data!")
        }
    }))
}, [])

//pulls 3 month state data
useEffect(() => {
    get(child(dbRef, `90 Day State Data/threeMonthData`)).then((snapshot => {
        if (snapshot.exists()) {
            setThreeMonthsStateData(snapshot.val())
        } else {
            console.log("No data!")
        }
    }))
}, [])

//pulls 6 month state data
useEffect(() =>  {
    get(child(dbRef, `6 Month State Data/sixMonthData`)).then((snapshot => {
        if (snapshot.exists()) {
            setSixMonthsStateData(snapshot.val())
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
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateTwoWeekPolygons()
  //     updateThreeMonthPolygons()
  //     updateSixMonthPolygons()
  //   }, 15000)
  //   return () => clearInterval(interval)
  // }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateCounties()
  //    }, 30000)
  //    return () => clearInterval(interval)
  // }, [])

  
//returns proper set of polygon options based on caseRate
  function getOptions(caseRate) {
      // console.log("Case Rate : " + caseRate)
      if(caseRate > .010){
        return highOptions
      } else if (caseRate > .0070 && caseRate < .010) {
        return medHighOptions
      } else if (caseRate >= .0030 && caseRate < .0070) {
        return medOptions
      } else {
        return lowOptions
      }   
  }

  // async function setMapList() {
  //   console.log("Setting Map List")
  //   if(mapView === 'Last 2 Weeks'){
  //     setMappedList(twoWeekStateData)
  //   }
  //   else if(mapView === 'Last 3 months'){
  //     setMappedList(threeMonthsStateData)
  //   }
  //   else if(mapView === 'Last 6 Months'){
  //     setMappedList(sixMonthsStateData)
  //   }
  //   updateTwoWeekPolygons()
  // }

  function reloadMapView(value) {
    console.log(value)
    // setMapView(value)
    // setMapList()
  }

  //provides infoWindow with data on user click
  function infoWindowData(selectedName, attribute) {
    if(sixMonthView === false && threeMonthView === false && twoWeekView === true){
      for(let i = 0; i < twoWeekStateData.length; i++){
        console.log("selectedName: " + JSON.stringify(selectedName))
        if(twoWeekStateData[i].name === selectedName && attribute === 'deaths'){
          return twoWeekStateData[i].deaths
        }
        if(twoWeekStateData[i].name === selectedName && attribute === 'cases'){
          return twoWeekStateData[i].cases
        }
        if(twoWeekStateData[i].name === selectedName && attribute === 'vacRate'){
          return twoWeekStateData[i].vacRate
        }
    }
  } else if(sixMonthView === false && threeMonthView === true && twoWeekView === false){
      for(let i = 0; i < threeMonthsStateData.length; i++){
        console.log("selectedName: " + JSON.stringify(selectedName))
        if(threeMonthsStateData[i].name === selectedName && attribute === 'deaths'){
          return threeMonthsStateData[i].deaths
        }
        if(threeMonthsStateData[i].name === selectedName && attribute === 'cases'){
          return threeMonthsStateData[i].cases
        }
        if(threeMonthsStateData[i].name === selectedName && attribute === 'vacRate'){
          return threeMonthsStateData[i].vacRate
        }
    }
  }else if(sixMonthView === true && threeMonthView === false && twoWeekView === false) {
      for(let i = 0; i < sixMonthsStateData.length; i++){
        console.log("selectedName: " + JSON.stringify(selectedName))
        if(sixMonthsStateData[i].name === selectedName && attribute === 'deaths'){
          return sixMonthsStateData[i].deaths
        }
        if(sixMonthsStateData[i].name === selectedName && attribute === 'cases'){
          return sixMonthsStateData[i].cases
        }
        if(sixMonthsStateData[i].name === selectedName && attribute === 'vacRate'){
          return sixMonthsStateData[i].vacRate
        }
      }
    
    }
  }


//updates options in stateList associated with polygon coordinates
  function updateTwoWeekPolygons() {
    // var array = []
    // setMappedList(array)
    let holder = fullStates
    twoWeekStateData.forEach((state) => {
      let caseRate = ((state.cases)/state.population)
      if (caseRate === Infinity){
        caseRate = 0
      }
      state.caseRate = (caseRate*1000000)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name){
              f.options = getOptions(caseRate)
              f.population = caseRate
              f.cases = state.cases
          }
        })
      })   
    })
    setTwoWeekList(holder)
  }
  function updateSixMonthPolygons() {
    // var array = []
    // setMappedList(array)
    let holder = fullStates
    sixMonthsStateData.forEach((state) => {
      let caseRate = ((state.cases)/state.population)
      if (caseRate === Infinity){
        caseRate = 0
      }
      state.caseRate = (caseRate*1000000)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name){
              f.options = getOptions(caseRate)
              f.population = caseRate
              f.cases = state.cases
          }
        })
      })   
    })
    setSixMonthList(holder)
  }

  //updates options in stateList associated with polygon coordinates
  function updateThreeMonthPolygons() {
    // var array = []
    // setMappedList(array)
    let holder = fullStates
    threeMonthsStateData.forEach((state) => {
      let caseRate = ((state.cases)/state.population)
      if (caseRate === Infinity){
        caseRate = 0
      }
      state.caseRate = (caseRate*1000000)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name){
              f.options = getOptions(caseRate)
              f.population = caseRate
              f.cases = state.cases
          }
        })
      })   
    })
    setThreeMonthList(holder)
  }
  function toggleMap(value){
    console.log(value)
    if(value === 'Two Week Data'){
      setSixMonthView(false)
      setThreeMonthView(false)
      setTwoWeekView(true)
      updateTwoWeekPolygons()
    }
    if(value === 'Three Month Data'){
      setSixMonthView(false)
      setThreeMonthView(true)
      setTwoWeekView(false)
      updateThreeMonthPolygons()
    }
    if(value === 'Six Month Data'){
      setSixMonthView(true)
      setThreeMonthView(false)
      setTwoWeekView(false)
      updateSixMonthPolygons()
    }
  }
    return (
      //Map View Buttons
      <div>
        <button onClick={() => toggleMap('Two Week Data')}>Two Week Data</button>
        <button onClick={() => toggleMap('Three Month Data')}>Three Month Data</button>
        <button onClick={() => toggleMap('Six Month Data')}>Six Month Data</button>

      {!threeMonthView && twoWeekView && !sixMonthView && (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          mapContainerStyle={containerStyle}
          options = {defaultMapOptions}
        >
          {twoWeekList.map((e, index) => (
            <Polygon
              paths = {e}
              options = {e[0].options}
              key = {index}
              onClick = {(props, polygon) => {setSelectedElement(e)
               setActivePolygon(polygon)}}
              >
            </Polygon>
          ))}
          {selectedElement ? (
            <InfoWindow
              visible={showInfoWindow}
              position = {{
                lat: selectedElement[0].lat,
                lng: selectedElement[0].lng}}
              onCloseClick={() => {
                setSelectedElement(null);
              }}
              
            >
              <div>
                <h1>{selectedElement[0].name}</h1>
                <h5>Deaths: {infoWindowData(selectedElement[0].name, 'deaths')}</h5>
                <h5>Cases: {infoWindowData(selectedElement[0].name, 'cases')}</h5>
                <h5>Vaccination Rate: {infoWindowData(selectedElement[0].name, 'vacRate')}</h5>
              </div>
            </InfoWindow>
          ) : null}
            
        </GoogleMap>
      </LoadScript>)}

      {threeMonthView && !twoWeekView && !sixMonthView && (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          mapContainerStyle={containerStyle}
          options = {defaultMapOptions}
        >
          {threeMonthList.map((e, index) => (
            <Polygon
              paths = {e}
              options = {e[0].options}
              key = {index}
              onClick = {(props, polygon) => {setSelectedElement(e)
               setActivePolygon(polygon)}}
              >
            </Polygon>
          ))}
          {selectedElement ? (
            <InfoWindow
              visible={showInfoWindow}
              position = {{
                lat: selectedElement[0].lat,
                lng: selectedElement[0].lng}}
              onCloseClick={() => {
                setSelectedElement(null);
              }}
              
            >
              <div>
                <h1>{selectedElement[0].name}</h1>
                <h5>Deaths: {infoWindowData(selectedElement[0].name, 'deaths')}</h5>
                <h5>Cases: {infoWindowData(selectedElement[0].name, 'cases')}</h5>
                <h5>Vaccination Rate: {infoWindowData(selectedElement[0].name, 'vacRate')}</h5>
              </div>
            </InfoWindow>
          ) : null}
            
        </GoogleMap>
      </LoadScript>)}
      {!threeMonthView && !twoWeekView && sixMonthView && (
      <LoadScript
        googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
      >
        <GoogleMap 
          center={center}
          zoom={4}
          mapContainerStyle={containerStyle}
          options = {defaultMapOptions}
        >
          {sixMonthList.map((e, index) => (
            <Polygon
              paths = {e}
              options = {e[0].options}
              key = {index}
              onClick = {(props, polygon) => {setSelectedElement(e)
               setActivePolygon(polygon)}}
              >
            </Polygon>
          ))}
          {selectedElement ? (
            <InfoWindow
              visible={showInfoWindow}
              position = {{
                lat: selectedElement[0].lat,
                lng: selectedElement[0].lng}}
              onCloseClick={() => {
                setSelectedElement(null);
              }}
              
            >
              <div>
                <h1>{selectedElement[0].name}</h1>
                <h5>Deaths: {infoWindowData(selectedElement[0].name, 'deaths')}</h5>
                <h5>Cases: {infoWindowData(selectedElement[0].name, 'cases')}</h5>
                <h5>Vaccination Rate: {infoWindowData(selectedElement[0].name, 'vacRate')}</h5>
              </div>
            </InfoWindow>
          ) : null}
            
        </GoogleMap>
      </LoadScript>)}
      </div>


    )
    
}

export default Map