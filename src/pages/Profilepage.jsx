import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { Badge, Code, Container, Heading, chakra, HStack, VStack, Center, FormControl, Stack, FormLabel, Input, Button } from '@chakra-ui/react'
import { Card } from '../components/Card'
import { useAuth, upload } from '../contexts/AuthContext'

export default function Profilepage() {
  const { currentUser } = useAuth()
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png');

  function handleChange(e) {
    if(e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
  }

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser])

  return (
    <Layout>
      <Heading>
        Profile page
        <Badge colorScheme='green' fontSize='lg' mx={4}>
          Protected Page
        </Badge>
      </Heading>
      {currentUser.email}
      <Container maxW='container.lg' overflowX='auto' py={4}>
        <chakra.form>
          <Stack spacing='2'>
            <Card>
              <FormControl className='image-upload'>
                <FormLabel>
                  <img src={photoURL} alt="Avatar" className='avatar'/>
                </FormLabel>
                <Input  
                  onChange={handleChange} 
                  name='file' 
                  type='file' 
                  autoComplete='file' 
                  required 
                />
              </FormControl>
              <Button 
                onClick={handleClick}
                type='submit' 
                colorScheme='primary' 
                size='lg' 
                fontSize='md'
                disabled={loading || !photo}
              >
                Upload
              </Button>
            </Card>
            
          </Stack>
        </chakra.form>
      </Container>
    </Layout>
  )
}
