import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useMoralisSubscription } from 'react-moralis'

// chakra ui
import {
  Box,
  Flex,
  Center,
  Heading,
  Text,
  Image,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  Button,
  Spinner,
  Progress,
} from '@chakra-ui/react'

const CreateDao = () => {
  const router = useRouter()
  const { guildID } = router.query

  const createSymbol = (name) => {
    var symbol = name
      .replace(/[^A-Za-z]/g, '')
      .replace(/[aeiou]/gi, '')
      .toUpperCase()
    symbol = symbol.length <= 4 ? symbol : symbol.slice(0, 4)

    return symbol
  }

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      if (guildID == undefined) {
        return
      }

      let createdResponse = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_ADDRESS +
          `/v1/create_dao/guildCreated?guildID=${guildID}`
      )

      const wasGuildCreated = createdResponse.data.wasGuildCreated

      if (wasGuildCreated) {
        let response = await axios.post(
          process.env.NEXT_PUBLIC_SERVER_ADDRESS +
            '/v1/create_dao/getCompletedDao',
          {
            guildID: guildID,
          }
        )

        const completedDaoData = response.data.response

        setDaoImage(completedDaoData.daoImage)
        setDaoName(completedDaoData.daoName)
        setUserImage(completedDaoData.userImage)
        setUserName(completedDaoData.userName)
        setSymbolValue(createSymbol(completedDaoData.daoName))

        setLoading(false)

        setStep(3)
      } else {
        let response = await axios.post(
          process.env.NEXT_PUBLIC_SERVER_ADDRESS +
            '/v1/create_dao/getPendingDao',
          {
            guildID: guildID,
          }
        )

        const pendingDaoData = response.data.response

        setDaoImage(pendingDaoData.daoImage)
        setDaoName(pendingDaoData.daoName)
        setUserImage(pendingDaoData.userImage)
        setUserName(pendingDaoData.userName)
        setSymbolValue(createSymbol(pendingDaoData.daoName))

        setLoading(false)
      }
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [guildID])

  const [daoImage, setDaoImage] = useState('https://bit.ly/dan-abramov')
  const [daoName, setDaoName] = useState('DAO Name')
  const [userImage, setUserImage] = useState('https://bit.ly/dan-abramov')
  const [userName, setUserName] = useState('Username')

  const [loading, setLoading] = useState(true)

  const [symbolValue, setSymbolValue] = useState(createSymbol(daoName))
  const [sliderValue, setSliderValue] = useState(10)
  const [showTooltip, setShowTooltip] = useState(false)

  const [subEnabled, setSubEnabled] = useState(false)
  const [progressData, setProgressData] = useState({
    progress: 0,
    message: 'Starting DAO creation',
  })

  const [step, setStep] = useState(1)

  useMoralisSubscription('daoProgress', (q) => q, [], {
    onCreate: (data) => {
      if (guildID === data.attributes.guildID) {
        const progressEntry = {
          guildID: data.attributes.guildID,
          progress: data.attributes.progress,
          message: data.attributes.message,
        }
        setProgressData(progressEntry)
      }
    },
    onUpdate: (data) => {
      if (guildID === data.attributes.guildID) {
        const progressEntry = {
          guildID: data.attributes.guildID,
          progress: data.attributes.progress,
          message: data.attributes.message,
        }
        setProgressData(progressEntry)
      }
    },
    enabled: subEnabled,
  })

  const handleSumbit = async () => {
    if (
      daoImage == '' ||
      daoImage == null ||
      daoImage == undefined ||
      symbolValue == '' ||
      symbolValue == null ||
      symbolValue == undefined
    ) {
      alert('You need to fill out the form')
    }
    setStep(2)
    setSubEnabled(true)
    let response = await axios.post(
      process.env.NEXT_PUBLIC_SERVER_ADDRESS + '/v1/create_dao/createDao',
      {
        guildID: guildID,
        daoImage: daoImage,
        symbolValue: symbolValue,
        sliderValue: sliderValue,
      }
    )
    setSubEnabled(false)
    setStep(3)

    console.log('Update Response: ', response.data)
  }

  const daoFormComponent = (
    <Fragment>
      <Center mb="12">
        <Heading>Create DAO</Heading>
      </Center>
      <Box mb="12">
        <Flex align="center" mb="4">
          <Box mr="4">DAO:</Box>
          <Image
            boxSize="80px"
            borderRadius="5px"
            objectFit="cover"
            src={daoImage}
            alt="DAO_image"
            mr="2"
          />
          <Box>{daoName}</Box>
        </Flex>
        <Flex align="center">
          <Box mr="4">Creator:</Box>
          <Image
            boxSize="80px"
            borderRadius="5px"
            objectFit="cover"
            src={userImage}
            alt="DAO_image"
            mr="2"
          />
          <Box>{userName}</Box>
        </Flex>
      </Box>
      <Box mb="16">
        <Box mb="4">
          <Text>DAO / NFT Image URL:</Text>
          <Input
            value={daoImage}
            onChange={(event) => setDaoImage(event.target.value)}
            size="lg"
          />
        </Box>
        <Box mb="4">
          <Text>Token Symbol:</Text>
          <Input
            value={symbolValue}
            onChange={(event) => setSymbolValue(event.target.value)}
            size="lg"
          />
        </Box>
        <Box mb="4">
          <Text>Creator Allocation:</Text>
          <Slider
            id="slider"
            defaultValue={10}
            min={0}
            max={100}
            colorScheme="teal"
            onChange={(v) => setSliderValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
              25%
            </SliderMark>
            <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
              50%
            </SliderMark>
            <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
              75%
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${sliderValue}%`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        </Box>
      </Box>
      <Box>
        <Button
          colorScheme="teal"
          size="lg"
          w="100%"
          onClick={() => {
            handleSumbit()
          }}
        >
          Create DAO
        </Button>
      </Box>
    </Fragment>
  )

  const loadingComponent = (
    <Fragment>
      <Center>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal"
          size="xl"
        />
      </Center>
    </Fragment>
  )

  const progressComponent = (
    <Fragment>
      <Center mb="8">
        <Image
          boxSize="sm"
          borderRadius="10"
          objectFit="cover"
          src="https://media3.giphy.com/media/fwfbJvRNHb5sI/giphy.gif?cid=790b761190cbace901b0fa77e6785016b821ef6fca669e68&rid=giphy.gif&ct=g"
          alt="Dao_creation"
        />
      </Center>

      <Box mb="4">
        <Heading as="h4" size="md" mb="1">
          DAO Creation in progress...
        </Heading>
        <Text fontSize="sm">{progressData.message}</Text>
      </Box>

      <Box>
        <Progress hasStripe value={progressData.progress} isAnimated />
      </Box>
    </Fragment>
  )

  const daoCreatedComponent = (
    <Fragment>
      <Center mb="8">
        <Image
          boxSize="sm"
          borderRadius="10"
          objectFit="cover"
          src={daoImage}
          alt="Dao_creation"
        />
      </Center>

      <Center mb="4">
        <Heading size="lg" mb="1">
          {daoName} Created 🎉
        </Heading>
      </Center>

      <Box>
        <Button
          colorScheme="teal"
          size="lg"
          w="100%"
          onClick={() => {
            console.log('Clicked')
          }}
        >
          Return to Discord
        </Button>
      </Box>
    </Fragment>
  )

  const renderSwitch = (pageStep) => {
    switch (pageStep) {
      case 1:
        return daoFormComponent
      case 2:
        return progressComponent
      case 3:
        return daoCreatedComponent
      default:
        return daoFormComponent
    }
  }

  return (
    <Fragment>
      <Box
        maxW="sm"
        borderWidth="3px"
        borderRadius="lg"
        overflow="hidden"
        m="4"
        p="4"
      >
        {loading ? (
          <Fragment>{loadingComponent}</Fragment>
        ) : (
          <Fragment>{renderSwitch(step)}</Fragment>
        )}
      </Box>
    </Fragment>
  )
}

export default CreateDao
