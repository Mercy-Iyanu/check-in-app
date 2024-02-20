/* eslint-disable @next/next/no-img-element */
import {
    Modal,
    ModalContent,
    ModalOverlay,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    Text,
    Flex
} from '@chakra-ui/react'

function QrCodeModal({ qrCodeImage, isOpen, onClose }: any) {
    return (
        <Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    mx={'10px'}
                    pb={6}
                    bg={'black'}
                    mt={'20vh'}
                    border="2px solid white"
                >
                    <ModalHeader>Show this QR at the entrance</ModalHeader>
                    <ModalCloseButton color={'white'} />
                    <ModalBody>
                        <Flex
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'column'}
                        >
                            <Text mb={4} fontSize={'14px'} color={'white'}>
                                Scan QR Code of the device
                            </Text>
                            <img src={qrCodeImage != null ? qrCodeImage : ''} alt="" />
                            <Text style={{ color: 'white' }}>
                                {qrCodeImage != null ? '' : 'No qrCode available!!!'}
                            </Text>
                            <Text
                                mt={4}
                                fontSize={'14px'}
                                textAlign={'center'}
                                color={'white'}
                                width={'68%'}
                            >
                                The QR Code will be automatically detected when you
                                position it between the guide lines
                            </Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default QrCodeModal
