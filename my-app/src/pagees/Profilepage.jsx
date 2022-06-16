import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { Badge, Code, Container, Heading, chakra, Flex, Center, FormControl, Stack, FormLabel, Input, Button, Text, VStack, StackDivider } from '@chakra-ui/react'
import { Card } from '../components/Card'
import { useAuth, upload } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'

export default function Profilepage() {
  const { currentUser } = useAuth()
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png');
  const [preview, setPreview] = useState()

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

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!photo) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(photo)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  return (
    <Layout>
      <Heading>
        Profile page
      </Heading>
      
      <Container maxW='container.lg' overflowX='auto' py={4} centerContent>
        <chakra.form>
          <Stack spacing='2'>
            <Card>
              <Flex>
                <Center marginRight='1em'>
                  <img src={photoURL} alt="Avatar" className='avatar'/>
                </Center>
                <Center>
                  <Text>Email: {currentUser?.email}</Text>
                </Center>
              </Flex>
            </Card>
            <Card>
              <FormControl className='image-upload'>
                <VStack
                  divider={<StackDivider borderColor='gray.200' />}
                  spacing={4}
                  align='stretch'
                >
                  <Center>
                    <FormLabel>
                      {/*<img src={photoURL} alt="Avatar" className='avatar'/>*/}
                      {photo && <img src={preview} alt="Avatar" className='avatar'/> }
                      Upload an Image
                    </FormLabel>
                  </Center>
                  <Center>
                    <Input  
                      onChange={handleChange} 
                      name='file' 
                      type='file' 
                      autoComplete='file' 
                      required 
                    />
                  </Center>
                </VStack>
              </FormControl>
              <Button 
                onClick={handleClick}
                type='submit' 
                colorScheme='primary' 
                size='lg' 
                fontSize='md'
                disabled={loading || !photo}
                marginTop='1em'
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