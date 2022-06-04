import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Map from './components/Map'
import Graph from './components/Graph'
import Table from './components/Table'
import Flipper from './components/Flipper'
import About from './components/About'
import NewsList from './components/NewsList';
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
            <Map />
            <Graph />
            <Flipper />
            <Table />
          </Route>
        </Switch>
        <Switch>
          <Route path="/tracking">
            <NewsList />
          </Route>
        </Switch>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;