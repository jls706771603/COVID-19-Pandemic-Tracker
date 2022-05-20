import './App.css';
import Header from './components/Header'
import Map from './components/Map'
import Graph from './components/Graph'
import Footer from './components/Footer'
import InfoTable from './components/InfoTable'
import Table from './components/Table.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const location = {
  lat: 39.8283,
  lng: -98.5795,
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/">
            <Map location={location} zoomLevel={4}></Map>
            
            <Graph />
            <Table />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;