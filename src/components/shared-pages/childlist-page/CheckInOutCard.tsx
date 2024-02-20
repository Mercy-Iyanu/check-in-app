import {
    Box,
    Heading,
    Text,
    Card,
    CardBody,
    Button,
    Avatar,
    useDisclosure,
    Flex,
    CardFooter
} from '@chakra-ui/react'
import CheckInOutDeleteModal from './CheckInOutDeleteModal'
import QrCodeModal from './QrCodeModal'
import { useState } from 'react'

export type CheckInOutCardProps = {
    _id?: string
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    allergies?: string
    bloodGroup?: string
    picture?: string
    childId?: string
    qrCode?: string
}

export default function CheckInOutCard({
    childId,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    allergies,
    bloodGroup,
    picture = '',
    qrCode
}: CheckInOutCardProps) {
    const [getChildId, setGetChildId] = useState<string | undefined>('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenQr, onOpen: onOpenQr, onClose: onCloseQr } = useDisclosure()
    const handleOnClick = () => {
        onOpen()
        setGetChildId(childId)
    }

    const downloadImage = async (
        imageSrc: string,
        imageName: string,
        forceDownload = false
    ) => {
        if (forceDownload) {
            const imageBlob = await fetch(imageSrc)
                .then((response) => response.arrayBuffer())
                .then((buffer) => new Blob([buffer], { type: 'image/jpeg' }))

            const link = document.createElement('a')
            link.href = URL.createObjectURL(imageBlob)
            link.download = imageName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            const link = document.createElement('a')
            link.href = imageSrc
            link.download = imageName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const qrCodeImage: any = qrCode

    const downloadQrCodeImage = (childName: string) => {
        downloadImage(qrCodeImage, childName)
    }

    return (
        <Box maxW={'full'}>
            <div>
                <CheckInOutDeleteModal
                    id={getChildId}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    fullName={` ${firstName} ${lastName}`}
                    picture={picture}
                />
                <QrCodeModal
                    qrCodeImage={qrCode}
                    isOpen={isOpenQr}
                    onOpen={onOpenQr}
                    onClose={onCloseQr}
                />
                <Card mt={2} variant={'outline'} width={'full'}>
                    <CardBody>
                        <Flex flex="1" my={4} gap="4" alignItems="center" flexWrap="wrap">
                            <Avatar name={`${firstName} ${lastName}`} src={picture} />
                            <Box>
                                <Heading size="md"> {`${firstName} ${lastName}`}</Heading>
                                <Text>Gender: {gender || '-'} </Text>
                            </Box>
                        </Flex>
                        <Box>
                            <Text py="2" color={'gray.600'} fontSize="xs">
                                Date Of Birth
                            </Text>
                            <Heading size="xs">
                                {new Date(dateOfBirth).toDateString()}
                            </Heading>
                        </Box>
                        <Box>
                            <Text py="2" color={'gray.600'} fontSize="xs">
                                Blood Group
                            </Text>
                            <Heading size="xs">{bloodGroup || '-'}</Heading>
                        </Box>

                        <Box>
                            <Text py="2" color={'gray.600'} fontSize="xs">
                                Allergies
                            </Text>
                            <Heading size="xs" noOfLines={[1, 2]}>
                                {allergies || '-'}
                            </Heading>
                        </Box>
                    </CardBody>
                    <CardFooter
                        gap={2}
                        justify="space-between"
                        flexWrap="wrap"
                        sx={{
                            '& > button': {
                                minW: '136px'
                            }
                        }}
                    >
                        <Button
                            onClick={() =>
                                downloadQrCodeImage(`${firstName} ${lastName}`)
                            }
                            flex="1"
                        >
                            Download Code
                        </Button>
                        <Button flex="1" variant="outline" onClick={onOpenQr}>
                            Show Code
                        </Button>
                        <Button
                            onClick={handleOnClick}
                            colorScheme="red"
                            variant="ghost"
                            flex="1"
                        >
                            Delete Child
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Box>
    )
}
