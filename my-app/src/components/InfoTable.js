import { ref, push, getDatabase, get, child  } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import './InfoTable.css'
import dbRef from './firebase.config.js'

export default function InfoTable() {
const [stateDateList, setStateDateList] = useState([])
const [dateListSet, setDateListSet] = useState(false)
let dateSnapshot = []


const current = new Date()
const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

// useEffect(() => {
//     const dbRef = ref(getDatabase())
//     get(child(dbRef, `dailyState`)).then((snapshot => {
//         if (snapshot.exists()) {
//             dateSnapshot = snapshot.val()
//             setStateDateList(dateSnapshot)
//             // localStorage.setItem('State Dates Ref', JSON.stringify(dateSnapshot))
//             setDateListSet(true)
//         }
//     }))
// })

// const dbRef = ref(getDatabase())
//     get(child(dbRef, `dailyState`)).then((snapshot => {
//         if (snapshot.exists()) {
//             dateSnapshot = snapshot.val()
//             setStateDateList(dateSnapshot)
//             // localStorage.setItem('State Dates Ref', JSON.stringify(dateSnapshot))
//             setDateListSet(true)
//         }
//     }))
// function sevenDayStats() {
//   let pulldates = JSON.parse(localStorage.getItem('State Dates Ref'))
//   console.log(pulldates)
// }

  return (
    <div className='main'>
      <h2>Info Table</h2>
      {/* {setStateDateList && stateDateList[0].map((e) => {
        <p>{e}</p>
      })} */}
    </div>
    
  )
}
