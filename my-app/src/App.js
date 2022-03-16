
import './App.css';
import Header from './components/Header'
import Map from './components/Map'

const location = {
  lat: 39.8283,
  lng: -98.5795,
}

function App() {
  return (
    <div className="App">
      <Header />
      <Map location={location} zoomLevel={4}></Map>
    </div>
  );
}

export default App;
