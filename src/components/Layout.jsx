import React from 'react'
import { Container } from '@chakra-ui/react'
import { Navbar } from './Navbar'

export function Layout(props) {
    return (
        <>
            <Navbar />
            <Container maxW='95%' maxH='95%'>{props.children}</Container>
        </>
    )
}