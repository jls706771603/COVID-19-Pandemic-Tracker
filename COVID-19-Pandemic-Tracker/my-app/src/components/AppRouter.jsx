import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import Homepage from '../pages/Homepage'
import Loginpage from '../pages/Loginpage'
import NotfoundPage from '../pages/NotfoundPage'
import Profilepage from '../pages/Profilepage'
import ProtectedPage from '../pages/ProtectedPage'
import Registerpage from '../pages/Registerpage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import { useAuth } from '../contexts/AuthContext'

import Header from './Header'
import Footer from './Footer'
import Map from './Map'
import Graph from './Graph'
import Table from './Table'
import Flipper from './Flipper'
import About from './About'
import NewsList from './NewsList.js'

export default function AppRouter(props) {
  return (
    <>
      <Router>
        {/*<Header />*/}
        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route path="/tracking">
            <NewsList />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <ProtectedRoute exact path='/login' component={Loginpage} />
          <ProtectedRoute exact path='/register' component={Registerpage} />
          <ProtectedRoute exact path='/profile' component={Profilepage} />
          <ProtectedRoute exact path='/protected-page' component={ProtectedPage} />
          <ProtectedRoute exact path='/forgot-password' component={ForgotPasswordPage} />
          <ProtectedRoute exact path='/reset-password' component={ResetPasswordPage} />
          <Route exact path='*' component={NotfoundPage} />
        </Switch>
        <Footer />
      </Router>
    </>
  )
}

function ProtectedRoute(props) {
  const { currentUser } = useAuth()
  const location = useLocation()
  const {path} = props

  if (path === '/login' || path === '/register' || path === '/forgot-password' || path === 'reset-password') {
    return currentUser ? (
      <Redirect to={location.state?.from ?? '/profile'} />
    ) : (
      <Route {...props} />
    )
  }

  return currentUser ? (
  <Route {...props} />
  ) : (
    <Redirect 
      to={{
        pathname: '/login',
        state: { from: path }
      }} 
    />
  )
}