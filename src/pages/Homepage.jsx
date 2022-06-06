import {
  Badge,
  chakra,
  Code,
  Heading,
  List,
  ListItem,
  OrderedList,
  Tag,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { Layout } from '../components/Layout'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Map from '../components/Map'
import Graph from '../components/Graph'
import Table from '../components/Table'
import Flipper from '../components/Flipper'
import About from '../components/About'
import NewsList from '../components/NewsList.js'


const location = {
  lat: 39.8283,
  lng: -98.5795,
}

export default function Homepage() {
  const { currentUser } = useAuth()
  return (
    <Layout width="100%">
      {/*<Heading>Home page</Heading>*/}
      {/*<Text my={6}> {`The current user is : ${currentUser}`} </Text>*/}
      <Map location={location} zoomLevel={4}></Map>
      <Graph />
      <Flipper />
      <Table />

      <Heading size='md' mt={20}>
        Some other links (only for reference):
      </Heading>
      <List>
        <ListItem>
          <Link to='/reset-password'>reset page</Link>
        </ListItem>
        <ListItem>
          <Link to='/forgot-password'>forgot page</Link>
        </ListItem>
      </List>
    </Layout>
  )
}
