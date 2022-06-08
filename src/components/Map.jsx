import React, { Component, useState, useEffect, useRef } from 'react';
import { Marker, GoogleMap, LoadScript, Polygon, useGoogleMap, GoogleMapsMarkerClusterer, MapContext, InfoWindow } from '@react-google-maps/api';
import db from './firebase.config';
import './Map.css'
import data from '../states2.json'
import countyData from '../counties.json'
import { collection, doc, query, QuerySnapshot, getDoc } from 'firebase/firestore/lite';
import { ref, push, getDatabase, get, child, set } from 'firebase/database'
import { Hide } from '@chakra-ui/react';

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
  for (let i = 0; i < objs.length; i++) {
    let stateArray = objs[i].coordinates
    for (let j = 0; j < stateArray.length; j++) {
      let miniArray = stateArray[j]
      for (let k = 0; k < miniArray.length; k++) {
        let thirdArray = miniArray[k]
        thirdArray.flatten(Infinity)
        if (thirdArray.length > 2) {
          for (let l = 0; l < thirdArray.length; l++) {
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
  width: '100%',
  height: '700px',
  float: 'center',
};
const defaultMapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  minZoom: 3,
  scrollwheel: false,
  styles: [
    {
      featureType: 'administrative.country',
      stylers: [{ visibility: 'off' }]
    },
    // {
    //     featureType: 'administrative.province',
    //     stylers: [{ visibility: 'off' }]
    //   }
    {
      featureType: 'administrative.locality',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      elementType: "labels.text",
      stylers: [{ visibility: 'off' }]
    }
  ]
}



const center = {
  lat: 39.8283,
  lng: -98.5795,
};

//polygon & map options options
const highOptions = {
  fillColor: "red",
  fillOpacity: .7,
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
  fillOpacity: .7,
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
  fillColor: "#F8D66D",
  fillOpacity: .7,
  strokeColor: "black",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: true,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}
const medLowOptions = {
  fillColor: "#8CD47E",
  fillOpacity: .7,
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
  fillOpacity: .7,
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
for (let i = 0; i < objs.length; i++) {
  //this is the coordinates of state @ i
  let crdArray = objs[i].coordinates
  for (let j = 0; j < crdArray.length; j++) {
    //this is the first array of coordinate arrays @ state @ i
    let secondArray = crdArray[j]
    for (let k = 0; k < secondArray.length; k++) {
      let thirdArray = secondArray[k]
      //check if nested object contains more nested arrays
      if (thirdArray.length > 2) {
        for (let l = 0; l < thirdArray.length; l++) {
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
  for (let i = 0; i < objs.length; i++) {
    let newArr = []
    //this is 0.coordinates.i
    let coords = objs[i].coordinates
    if (coords.length === 1) {
      let holder = coords[0]
      for (let j = 0; j < holder.length; j++) {
        let holderTwo = holder[j]
        let newObj = new Object()
        newObj.lat = holderTwo[1]
        newObj.lng = holderTwo[0]
        newObj.name = objs[i].name
        newObj.options = defOptions
        newArr.push(newObj)
      }
    }
    else if (coords.length > 1) {
      for (let j = 0; j < coords.length; j++) {
        let coordstepone = coords[j]
        for (let k = 0; k < coordstepone.length; k++) {
          let secondArr = []
          let coordsteptwo = coordstepone[k]
          for (let l = 0; l < coordsteptwo.length; l++) {
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
// console.log(fullStates)
//filter empty arrays from stateList
fullStates = fullStates.filter((e) => {
  return e.length > 0
})

// fullCounties = fullCounties.filter((e) => {
//   return e.length > 0
// })



// ------------------------------ MAP -----------------------------
function Map() {
  const [twoWeekList, setTwoWeekList] = useState([])
  const [threeMonthList, setThreeMonthList] = useState([])
  const [sixMonthList, setSixMonthList] = useState([])
  const [vaccList, setVaccList] = useState([])
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
  const [vaccStateData, setVaccStateData] = useState([])
  const [mappedList, setMappedList] = useState([])
  const [twoWeekView, setTwoWeekView] = useState(false)
  const [threeMonthView, setThreeMonthView] = useState(false)
  const [sixMonthView, setSixMonthView] = useState(false)
  const [vaccView, setVaccView] = useState(false)
  const [classChange, setClassChange] = useState("")
  const [selected, setSelected] = useState([]);
  const [reloadMap, setReloadMap] = useState(false)


  //pulls all time state data to sync with polygon coordinates
  useEffect(() => {
    get(child(dbRef, `states/stateList`)).then((snapshot => {
      if (snapshot.exists()) {
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
        setVaccStateData(snapshot.val())
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
  useEffect(() => {
    get(child(dbRef, `6 Month State Data/sixMonthData`)).then((snapshot => {
      if (snapshot.exists()) {
        setSixMonthsStateData(snapshot.val())
      } else {
        console.log("No data!")
      }
    }))
  }, [])

  useEffect(() => {
    setTwoWeekView(true)
    updateTwoWeekPolygons()
    setReloadMap(true)
  }, [twoWeekStateData, setReloadMap])

  //changes visuals of the buttons
  useEffect(() => {
    setClassChange(["mapvalue", "mapvalue2"])
  }, [])

  useEffect(() => {

  }, [classChange])

  useEffect(() => {

  }, [selected])


  //returns proper set of polygon options based on caseRate
  function getOptions(caseRate) {
    // console.log("Case Rate : " + caseRate)
    if (caseRate >= 20) {
      return highOptions
    } else if (caseRate > 10 && caseRate < 20) {
      return medOptions
    } else {
      return lowOptions
    }
  }

  function getVacOptions(index) {
    if (index < 10) {
      return highOptions
    } else if (index >= 10 && index <= 20) {
      return medHighOptions
    } else if (index > 20 && index <= 36) {
      return medOptions
    } else if (index > 36 && index <= 45) {
      return medLowOptions
    } else {
      return lowOptions
    }
  }

  function getSixMonthOptions(caseRate) {
    // console.log("Case Rate : " + caseRate)
    if (caseRate >= 60) {
      return highOptions
    } else if (60 > caseRate && caseRate > 50) {
      return medOptions
    } else {
      return lowOptions
    }
  }

  //provides infoWindow with data on user click
  function infoWindowData(selectedName, attribute) {
    if (sixMonthView === false && threeMonthView === false && twoWeekView === true && vaccView === false) {
      for (let i = 0; i < twoWeekStateData.length; i++) {
        // console.log("selectedName: " + JSON.stringify(selectedName))
        if (twoWeekStateData[i].name === selectedName && attribute === 'deaths') {
          console.log(twoWeekStateData[i].deaths)
          return twoWeekStateData[i].deaths
        }
        if (twoWeekStateData[i].name === selectedName && attribute === 'cases') {
          console.log(twoWeekStateData[i].cases)
          return twoWeekStateData[i].cases
        }
        if (twoWeekStateData[i].name === selectedName && attribute === 'vacRate') {
          return twoWeekStateData[i].vacRate
        }
        if (twoWeekStateData[i].name === selectedName && attribute === 'dailyCases') {
          let holder = (twoWeekStateData[i].cases) / (twoWeekStateData[i].population)
          holder = (holder / 14) * 100000
          return holder.toFixed(2)
        }
      }
    } else if (sixMonthView === false && threeMonthView === true && twoWeekView === false && vaccView === false) {
      for (let i = 0; i < threeMonthsStateData.length; i++) {
        // console.log("selectedName: " + JSON.stringify(selectedName))
        if (threeMonthsStateData[i].name === selectedName && attribute === 'deaths') {
          return threeMonthsStateData[i].deaths
        }
        if (threeMonthsStateData[i].name === selectedName && attribute === 'cases') {
          return threeMonthsStateData[i].cases
        }
        if (threeMonthsStateData[i].name === selectedName && attribute === 'vacRate') {
          return threeMonthsStateData[i].vacRate
        }
        if (threeMonthsStateData[i].name === selectedName && attribute === 'dailyCases') {
          let holder = (threeMonthsStateData[i].cases) / (threeMonthsStateData[i].population)
          holder = (holder / 90) * 100000
          return holder.toFixed(2)
        }
      }
    } else if (sixMonthView === true && threeMonthView === false && twoWeekView === false && vaccView === false) {
      for (let i = 0; i < sixMonthsStateData.length; i++) {
        // console.log("selectedName: " + JSON.stringify(selectedName))
        if (sixMonthsStateData[i].name === selectedName && attribute === 'deaths') {
          return sixMonthsStateData[i].deaths
        }
        if (sixMonthsStateData[i].name === selectedName && attribute === 'cases') {
          return sixMonthsStateData[i].cases
        }
        if (sixMonthsStateData[i].name === selectedName && attribute === 'vacRate') {
          return sixMonthsStateData[i].vacRate
        }
        if (sixMonthsStateData[i].name === selectedName && attribute === 'dailyCases') {
          let holder = (sixMonthsStateData[i].cases) / (sixMonthsStateData[i].population)
          holder = (holder / 180) * 100000
          return holder.toFixed(2)
        }
      }

    } else if (sixMonthView === false && threeMonthView === false && twoWeekView === false && vaccView === true) {
      for (let i = 0; i < vaccStateData.length; i++) {
        // console.log("selectedName: " + JSON.stringify(selectedName))
        if (vaccStateData[i].name === selectedName && attribute === 'vacRate') {
          return vaccStateData[i].vacRate
        }
        if (vaccStateData[i].name === selectedName && attribute === 'One Dose') {
          return vaccStateData[i].oneDoseRate
        }
        if (vaccStateData[i].name === selectedName && attribute === 'plus 18 rate') {
          return vaccStateData[i].plusRate18
        }
        if (vaccStateData[i].name === selectedName && attribute === 'plus 65 rate') {
          return vaccStateData[i].plusRate65
        }
      }
    }
  }


  //updates options in stateList associated with polygon coordinates
  function updateTwoWeekPolygons() {
    setSelected([true, false, false, false])
    // var array = []
    // setMappedList(array)
    let holder = fullStates
    twoWeekStateData.forEach((state) => {
      let caseRate = ((state.cases) / state.population)
      caseRate = (caseRate / 14)
      caseRate = caseRate * 100000
      if (caseRate === Infinity) {
        caseRate = 0
      }
      state.caseRate = (caseRate)
      console.log(state.name + " case Rate is: " + state.caseRate)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name) {
            f.options = getOptions(state.caseRate)
            f.caseRate = state.caseRate
            f.cases = state.cases
          }
        })
      })
    })
    setTwoWeekList(holder)
  }
  function updateSixMonthPolygons() {
    setSelected([false, false, true, false])
    // var array = []
    // setMappedList(array)
    let holder = fullStates
    sixMonthsStateData.forEach((state) => {
      let caseRate = ((state.cases) / state.population)
      // console.log(state.name + ' ' + state.cases + ' ' + state.population)
      caseRate = (caseRate / 180)
      caseRate = caseRate * 100000
      if (caseRate === Infinity) {
        console.log("caserate infinity")
      }
      state.caseRate = (caseRate)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name) {
            f.options = getSixMonthOptions(state.caseRate)
            f.caseRate = state.caseRate
            f.cases = state.cases
          }
        })
      })
    })
    setSixMonthList(holder)
  }

  //updates options in stateList associated with polygon coordinates
  function updateThreeMonthPolygons() {
    setSelected([false, true, false, false])
    // var array = []
    // setMappedList(array)
    let holder = fullStates
    threeMonthsStateData.forEach((state) => {
      let caseRate = ((state.cases) / state.population)
      caseRate = (caseRate / 90)
      caseRate = caseRate * 100000
      if (caseRate === Infinity) {
        caseRate = 0
      }
      state.caseRate = (caseRate)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name) {
            f.options = getOptions(state.caseRate)
            f.population = state.caseRate
            f.cases = state.cases
          }
        })
      })
    })
    setThreeMonthList(holder)
  }


  //update vaccination polygons:
  function updateVaccPolygons() {
    setSelected([false, false, false, true])
    let sortedArray = vaccStateData.sort((a, b) => Number(a.vacRate) - Number(b.vacRate))
    setVaccStateData(sortedArray)
    let holder = fullStates
    sortedArray.forEach((state) => {
      let vacRate = (state.vacRate)
      holder.forEach((e) => {
        e.forEach((f) => {
          if (f.name === state.name) {
            f.options = getVacOptions(sortedArray.indexOf(state))
          }
        })
      })
    })
    setVaccList(holder)
  }


  function toggleMap(value) {
    console.log(value)
    if (value === 'Two Week Data') {
      setSixMonthView(false)
      setThreeMonthView(false)
      setTwoWeekView(true)
      setVaccView(false)
      updateTwoWeekPolygons()
    }
    if (value === 'Three Month Data') {
      setSixMonthView(false)
      setThreeMonthView(true)
      setTwoWeekView(false)
      setVaccView(false)
      updateThreeMonthPolygons()
    }
    if (value === 'Six Month Data') {
      setSixMonthView(true)
      setThreeMonthView(false)
      setTwoWeekView(false)
      setVaccView(false)
      updateSixMonthPolygons()
    }
    if (value === 'Vaccination Map') {
      setSixMonthView(false)
      setThreeMonthView(false)
      setTwoWeekView(false)
      setVaccView(true)
      updateVaccPolygons()
    }
  }

  //gets selected elements midpoint for infowindow location
  function getMidpoint(selected, type) {
    let lowestLat = selected[0].lat
    let lowestLng = selected[0].lng
    let highestLat = selected[0].lat
    let highestLng = selected[0].lng
    if (type === 'lat') {
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].lat < lowestLat) {
          lowestLat = selected[i].lat
        }
        if (selected[i].lat > highestLat) {
          highestLat = selected[i].lat
        }
      }
      let lat = lowestLat + ((highestLat - lowestLat) / 2)
      // console.log(lat)
      return lat
    }
    if (type === 'lng') {
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].lng < lowestLng) {
          lowestLng = selected[i].lng
        }
        if (selected[i].lng > highestLng) {
          highestLng = selected[i].lng
        }
      }
      let lng = lowestLng + ((highestLng - lowestLng) / 2)
      // console.log(lng)
      return lng
    }
  }





  return (
    //Map View Buttons
    <div className='mapBackground'>
      <div className='mapTextContainer'>
        <div className='mapTextTop'><span> {selected[0] ? "2 Week Data" : ""}{selected[1] ? "3 Month Data" : ""}{selected[2] ? "6 Month Data" : ""}{selected[3] ? "Vaccination Map" : ""}</span></div>
      </div>
      <div className='mapButtonContainer'>
        <button className='mapItem' onClick={() => toggleMap('Two Week Data')}><span className={selected[0] ? classChange[1] : classChange[0]}>Two Week Data</span></button>
        <button className='mapItem' onClick={() => toggleMap('Three Month Data')}><span className={selected[1] ? classChange[1] : classChange[0]}>Three Month Data</span></button>
        <button className='mapItem' onClick={() => toggleMap('Six Month Data')}><span className={selected[2] ? classChange[1] : classChange[0]}>Six Month Data</span></button>
        <button className='mapItem' onClick={() => toggleMap('Vaccination Map')}><span className={selected[3] ? classChange[1] : classChange[0]}>Vaccination Map</span></button>
      </div>
      {!threeMonthView && twoWeekView && !sixMonthView && !vaccView && (
        <LoadScript
          googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
        >
          <GoogleMap
            center={center}
            zoom={4}
            mapContainerStyle={containerStyle}
            options={defaultMapOptions}
          >
            {twoWeekList.map((e, index) => (
              <Polygon
                paths={e}
                options={e[0].options}
                key={index}
                onClick={(props, polygon) => {
                  setSelectedElement(e)
                  setActivePolygon(polygon)
                }}
              >
              </Polygon>
            ))}
            {selectedElement ? (
              <InfoWindow
                visible={showInfoWindow}
                position={{
                  lat: getMidpoint(selectedElement, 'lat'),
                  lng: getMidpoint(selectedElement, 'lng')
                }}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}

              >
                <div>
                  <h1 class='infoTitle'>{selectedElement[0].name}</h1>
                  <h5>Average Daily Cases: {infoWindowData(selectedElement[0].name, 'dailyCases')}</h5>
                  <h5>Cases: {infoWindowData(selectedElement[0].name, 'cases')}</h5>
                  <h5>Deaths: {infoWindowData(selectedElement[0].name, 'deaths')}</h5>
                </div>
              </InfoWindow>
            ) : null}

          </GoogleMap>
        </LoadScript>)}

      {threeMonthView && !twoWeekView && !sixMonthView && !vaccView && (
        <LoadScript
          googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
        >
          <GoogleMap
            center={center}
            zoom={4}
            mapContainerStyle={containerStyle}
            options={defaultMapOptions}
          >
            {threeMonthList.map((e, index) => (
              <Polygon
                paths={e}
                options={e[0].options}
                key={index}
                onClick={(props, polygon) => {
                  setSelectedElement(e)
                  setActivePolygon(polygon)
                }}
              >
              </Polygon>
            ))}
            {selectedElement ? (
              <InfoWindow
                visible={showInfoWindow}
                position={{
                  lat: getMidpoint(selectedElement, 'lat'),
                  lng: getMidpoint(selectedElement, 'lng')
                }}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}

              >
                <div>
                  <h1 class='infoTitle'>{selectedElement[0].name}</h1>
                  <h5>Average Daily Cases: {infoWindowData(selectedElement[0].name, 'dailyCases')}</h5>
                  <h5>Cases: {infoWindowData(selectedElement[0].name, 'cases')}</h5>
                  <h5>Deaths: {infoWindowData(selectedElement[0].name, 'deaths')}</h5>
                </div>
              </InfoWindow>
            ) : null}

          </GoogleMap>
        </LoadScript>)}

      {!threeMonthView && !twoWeekView && sixMonthView && !vaccView && (
        <LoadScript
          googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
        >
          <GoogleMap
            center={center}
            zoom={4}
            mapContainerStyle={containerStyle}
            options={defaultMapOptions}
          >
            {sixMonthList.map((e, index) => (
              <Polygon
                paths={e}
                options={e[0].options}
                key={index}
                onClick={(props, polygon) => {
                  setSelectedElement(e)
                  setActivePolygon(polygon)
                }}
              >
              </Polygon>
            ))}
            {selectedElement ? (
              <InfoWindow
                visible={showInfoWindow}
                position={{
                  lat: getMidpoint(selectedElement, 'lat'),
                  lng: getMidpoint(selectedElement, 'lng')
                }}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}

              >
                <div>
                  <h1 class='infoTitle'>{selectedElement[0].name}</h1>
                  <h5>Average Daily Cases: {infoWindowData(selectedElement[0].name, 'dailyCases')}</h5>
                  <h5>Cases: {infoWindowData(selectedElement[0].name, 'cases')}</h5>
                  <h5>Deaths: {infoWindowData(selectedElement[0].name, 'deaths')}</h5>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </LoadScript>)}

      {!threeMonthView && !twoWeekView && !sixMonthView && vaccView && (
        <LoadScript
          googleMapsApiKey="AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc"
        >
          <GoogleMap
            center={center}
            zoom={4}
            mapContainerStyle={containerStyle}
            options={defaultMapOptions}
          >
            {vaccList.map((e, index) => (
              <Polygon
                paths={e}
                options={e[0].options}
                key={index}
                onClick={(props, polygon) => {
                  setSelectedElement(e)
                  setActivePolygon(polygon)
                }}
              >
              </Polygon>
            ))}
            {selectedElement ? (
              <InfoWindow
                visible={showInfoWindow}
                position={{
                  lat: getMidpoint(selectedElement, 'lat'),
                  lng: getMidpoint(selectedElement, 'lng')
                }}
                onCloseClick={() => {
                  setSelectedElement(null);
                }}

              >
                <div>
                  <h1 class='infoTitle'>{selectedElement[0].name}</h1>
                  <h5>Vaccination Rate: {infoWindowData(selectedElement[0].name, 'vacRate')}%</h5>
                  <h5>One Dose: {infoWindowData(selectedElement[0].name, 'One Dose')}%</h5>
                  <h5>18+ Vaccination Rate: {infoWindowData(selectedElement[0].name, 'plus 18 rate')}%</h5>
                  <h5>65+ Vaccination Rate: {infoWindowData(selectedElement[0].name, 'plus 65 rate')}%</h5>
                </div>
              </InfoWindow>
            ) : null}

          </GoogleMap>
        </LoadScript>)}
      {!vaccView && twoWeekView && <h5>Red states indicate 20 or more new cases per day. Yellow states indicate between 10 and 20 new cases per day. Green states indicate less than 10 new cases per day. All calculations are per done per 100,000 residents of a state</h5>}
      {!vaccView && threeMonthView && <h5>Red states indicate 20 or more new cases per day. Yellow states indicate between 10 and 20 new cases per day. Green states indicate less than 10 new cases per day. All calculations are per done per 100,000 residents of a state</h5>}
      {!vaccView && sixMonthView && <h5>Red states indicate 60 or more new cases per day. Yellow states indicate between 50 and 60 new cases per day. Green states indicate less than 50 new cases per day. All calculations are per done per 100,000 residents of a state</h5>}
      {vaccView && <h5>Red states indicate the lowest 10 vaccination rates. Orange indicates the bottom 10 to 20 states. Yellow indcates states above the bottom 20 but below the top 20. Light green indicates the top 10-20 states. Green indicates the top 10 vaccination rates.</h5>}
    </div>


  )

}

export default Map