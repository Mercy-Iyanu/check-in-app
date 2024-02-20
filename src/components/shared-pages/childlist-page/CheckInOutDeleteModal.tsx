'use client'
import {
    Modal,
    ModalContent,
    ModalOverlay,
    ModalBody,
    Button,
    ModalFooter,
    ModalHeader,
    ModalCloseButton,
    Text,
    Avatar,
    Flex,
    Heading
} from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { DELETE_CHILD } from '../../../app/user/parent/_grapql'
import { useAlertService } from '@/services/useAlertService'

function CheckInOutDeleteModal({ id, isOpen, onClose, fullName, picture }: any) {
    const [deleteChild] = useMutation(DELETE_CHILD)
    const alertService = useAlertService()

    function onDeleteChild() {
        try {
            deleteChild({
                variables: {
                    id
                }
            })
            alertService.success('Child deleted successfully')
            onClose()
        } catch (error: any) {
            alertService.error(error.message, error.name)
        }
    }

    return (
        <Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mx={'10px'} mt={'20vh'}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'column'}
                            gap={4}
                        >
                            <Avatar
                                bg={'brand.50'}
                                size={'xl'}
                                name={fullName}
                                src={picture}
                            />
                            <Heading size={['sm', 'md']} py={2}>
                                Ops! Are sure you want to do this!
                            </Heading>
                            <Text m={2} textAlign={'center'}>
                                You about to delete{' '}
                                <span
                                    style={{
                                        color: 'red',
                                        textDecoration: 'underline',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {fullName}
                                </span>{' '}
                                profile permanently. <br /> Please cross-check again
                                before deleting
                            </Text>
                        </Flex>
                    </ModalBody>

                    <ModalFooter mb={'20px'}>
                        <Flex
                            gap={2}
                            justifyContent={'center'}
                            px={'3rem'}
                            width={'100%'}
                        >
                            <Button width={'100%'} variant={'outline'} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={onDeleteChild} width={'100%'}>
                                Yes, Delete
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default CheckInOutDeleteModal
