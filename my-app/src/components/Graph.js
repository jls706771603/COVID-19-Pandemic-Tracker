import { ref, push, getDatabase, get, child  } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js';
import './Graph.css'


export default function Graph() {
    const [stateDateList, setStateDateList] = useState([])
    const [graphData, setGraphData] = useState([])
    const [dateListSet, setDateListSet] = useState(false)
    const dbRef = ref(getDatabase())
    let dateSnapshot = []
    let singleSnaps = []
    

    useEffect(() => {
        get(child(dbRef, `states/stateList`)).then((snapshot => {
          if(snapshot.exists()) {
            setStateDateList(snapshot.val())
          } else {
            console.log("No data!")
          }
        }))
      }, [])

      console.log(JSON.stringify(stateDateList))
    
        return (
            <div className='graph1'>
                    <Plot
                        data={[
                            {
                                x: ['01/01/2022', '01/02/2022', '01/03/2022', '01/04/2022', '01/05/2022', '01/06/2022', '01/07/2022', '01/08/2022', '01/09/2022', '01/10/2022', '01/11/2022', '01/12/2022', '01/13/2022', '01/14/2022'],
                                y: [10, 20, 30, 50, 80, 150, 300, 500, 800, 600, 300, 340, 200, 130],
                                type: 'scatter'
                            }
                        ]}
                    layout={{ width: 1000, height: 500, title: 'Last 2 Weeks of Covid-19 Cases' }}
                    config={{ displayModeBar: false }}
                    />
                <Plot
                    data={[
                        {
                            x: [50, 210],
                            y: [0, 50, 100]
                        }
                    ]}
                    layout={{ width: 1000, height: 500, title: 'Last 2 Weeks of Covid-19 Cases' }}
                    config={{ displayModeBar: false }}
                />
            </div>
        )
    
}