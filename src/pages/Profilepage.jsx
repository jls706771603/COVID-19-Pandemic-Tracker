import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { Badge, Code, Container, Heading, chakra, HStack, VStack, Center, FormControl, Stack, FormLabel, Input, Button } from '@chakra-ui/react'
import { Card } from '../components/Card'
import { useAuth } from '../contexts/AuthContext'

export default function Profilepage() {
  const { currentUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Layout>
      <Heading>
        Profile page
        <Badge colorScheme='green' fontSize='lg' mx={4}>
          Protected Page
        </Badge>
      </Heading>

      <Container maxW='container.lg' overflowX='auto' py={4}>
        <chakra.form>
          <Stack spacing='6'>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                name='email' 
                type='email' 
                autoComplete='email' 
                required 
                />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name='password'
                type='password'
                autoComplete='password'
                required
              />
            </FormControl>
            {/* <PasswordField /> */}
            <Button 
              isLoading={isSubmitting}
              type='submit' 
              colorScheme='primary' 
              size='lg' 
              fontSize='md'
            >
              Sign in
            </Button>
          </Stack>
        </chakra.form>
      </Container>
    </Layout>
  )
}
