'use client'
import {
    Box,
    Button,
    SimpleGrid,
    VisuallyHidden,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useRadioGroup,
    Flex,
    Heading, Text
} from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'
import { Camera, CameraType } from 'react-camera-pro'
import RadioCard from './RadioCard'
import RtQr, { find_qr } from 'rt-qr'
import ParentModal from './ParentModal'

enum Check {
    Null = 'Null',
    In = 'Check In',
    Out = 'Check Out'
}

const PERMISSION_DENIED ='Permission has been denied to access the camera. Please enable camera permissions and refresh the page.'
const NO_CAMERA_MESSAGE ='No camera detected. Please enable camera permissions and refresh the page.'

const CheckInOut = () => {
    const options = [Check.In, Check.Out]

    const [check, setCheck] = useState<string>(Check.Null)
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'check',
        defaultValue: Check.Null,
        onChange: setCheck
    })
    const group = getRootProps()

    const camera = useRef<CameraType>(null)
    const [numberOfCameras, setNumberOfCameras] = useState(0)
    const [image, setImage] = useState<{
        value: string | null
        info: string | null
    }>({
        value: null,
        info: null
    })
    const clearImage = () =>
        setImage({
            value: null,
            info: null
        })

    const { isOpen, onOpen, onClose } = useDisclosure({ onClose: clearImage })

    useEffect(() => {
        const qrInterval = setInterval(async () => {
            if (isOpen && image.value === null) {
                await RtQr()
                try {
                    const photo = camera.current?.takePhoto()
                    if (photo !== undefined) {
                        const qr = find_qr(photo)
                        if (qr.valid) {
                            setImage({
                                value: photo,
                                info: qr.message
                            })
                        }
                    }
                } catch {}
            }
        }, 150)
        return () => clearInterval(qrInterval)
    }, [isOpen, image.value])

    return (
        <Box
            minH={['container.sm', 'container.md']}
            borderRadius={4}
            mx={'auto'}
            py={5}
            px={{ base: 2, sm: 12, md: 17 }}
        >
            <Flex my={2} alignItems="center" gap="2" flexWrap="wrap">
                <Box p="2">
                    <Heading size="md" my={2}>
                        Check-In/Check-out Child
                    </Heading>
                    <Text color={'gray.600'}>
                        Here you can checkin or checkout a child
                    </Text>
                </Box>
            </Flex>
            <SimpleGrid
                columns={2}
                spacing={4}
                {...group}
                templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
            >
                <VisuallyHidden>Check Type</VisuallyHidden>
                {options.map((value) => {
                    const radio = getRadioProps({ value })
                    return (
                        <RadioCard key={value} {...radio}>
                            {value}
                        </RadioCard>
                    )
                })}
            </SimpleGrid>

            <Button
                marginTop="8"
                width={'350px'}
                size="lg"
                isDisabled={Check.Null === check}
                onClick={onOpen}
            >
                Start Scanning
            </Button>
            <Modal {...{ isOpen, onClose }} size="full">
                <ModalOverlay />
                {image.value !== null && (
                    <ParentModal
                        isCheckIn={check === Check.In}
                        image={image}
                        onClose={() => clearImage()}
                    />
                )}
                <ModalContent bg="brand.900" color="#fff">
                    <ModalHeader textAlign="center">
                        Scan QR Code for {check === Check.In ? ' Check In' : 'Check Out'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            height="calc(100vh - 132px)"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box
                                width="min(80vw, 80vh)"
                                aspectRatio={'1 / 1'}
                                height="auto"
                                border="2px white solid"
                                position="relative"
                            >
                                <Camera
                                    ref={camera}
                                    errorMessages={{
                                        noCameraAccessible: NO_CAMERA_MESSAGE,
                                        permissionDenied: PERMISSION_DENIED,
                                        switchCamera:
                                            'Could not switch camera successfully'
                                    }}
                                    facingMode="environment"
                                    numberOfCamerasCallback={setNumberOfCameras}
                                />
                            </Box>
                            <Box>
                                <Box>
                                    {numberOfCameras > 1 && (
                                        <Button
                                            style={{
                                                marginTop: '3rem'
                                            }}
                                            isDisabled={Check.Null === check}
                                            onClick={() => camera.current?.switchCamera()}
                                        >
                                            Switch Camera
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default CheckInOut
