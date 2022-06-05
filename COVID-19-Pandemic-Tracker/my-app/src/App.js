import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Map from './components/Map'
import Graph from './components/Graph'
import Table from './components/Table'
import Flipper from './components/Flipper'
import About from './components/About'
import NewsList from './components/NewsList.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React from 'react'
import AppRouter from './components/AppRouter'
import AuthContextProvider from './contexts/AuthContext'

function App() {
  return (
    <Router>
      <div className="App">
        <AuthContextProvider>
          <AppRouter />
        </AuthContextProvider>
      </div>
    </Router>
  );
}

export default App;