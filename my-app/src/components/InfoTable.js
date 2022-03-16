import { ref, push, getDatabase, get, child  } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import './InfoTable.css'

export default function InfoTable() {
const [stateDateList, setStateDateList] = useState([])
let dateSnapshot = []

const current = new Date()
const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

useEffect(() => {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `dailyState`)).then((snapshot => {
        if (snapshot.exists()) {
            dateSnapshot = snapshot.val()
            setStateDateList(dateSnapshot)
        }
    }))
})

  return (
    <div className='main'>
      <h2>Info Table</h2>
      <p>{date}</p>
    </div>
    
  )
}
