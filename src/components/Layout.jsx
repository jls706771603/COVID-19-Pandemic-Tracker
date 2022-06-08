import React from 'react'
import { Container } from '@chakra-ui/react'
import { Navbar } from './Navbar'
import { Navfooter } from './Navfooter'

export function Layout(props) {
    return (
        <>
            <Navbar />
            <Container minH='63.5vh' maxW='95%' maxH='95%'>{props.children}</Container>
            <Navfooter />
        </>
    )
}