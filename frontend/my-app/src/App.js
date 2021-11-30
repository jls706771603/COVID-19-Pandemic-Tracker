import './App.css';
import {useState} from 'react';
import db from './firebase.config';



const App = () => {
  const [info, setInfo] = useState([]);

  //Get Data on Page Loading
  window.addEventListener('load', () => {
    Fetchdata();
  });

  //Should access Firebase collection but not working ATM, if you view console log after starting
  //the app, the snapshot is still empty
  const Fetchdata = ()=>{
    db.collection("pandemic-tracker-1b4e2-default-rtdb.firebaseio.com/counties/countyList/").get().then((querySnapshot) => {
      console.log(querySnapshot)

      //Get Data and add to array
      querySnapshot.docs.forEach(element => {
        var data = element.data();
        setInfo(arr => [...arr, data]);
        console.log(element)
      });
    
    })
  }

  return (
    <div>
      <center>
        <h2>County Numbers</h2>
      </center>

    {
      info.map((data) => (
        <Frame id = {data.id}
        cases={data.cases}
        dates={data.cases}
        deaths={data.cases}
        name={data.cases}
        state={data.cases}/>
      ))
    }
    </div>
  );
}

  const Frame = ({cases, date, deaths, name, state, id}) => {
    console.log(id + " " + cases + " " + deaths + " " + date + " " + state + " " + name);
    return (
      <center>
        <div className="div">
          <p>Name: {name}</p>
          <p>ID: {id}</p>
          <p>State: {state}</p>
          <p>Cases: {cases}</p>
          <p>Deaths: {deaths}</p>
          <p>Date: {date}</p>
        </div>
      </center>
    )
  }




export default App;