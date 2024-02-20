'use client'
import { useMutation, useQuery } from '@apollo/client'
import {
    Box,
    Button,
    Card,
    CardBody,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    Avatar,
    Flex,
    Heading,
    ModalCloseButton,
    useRadio,
    Stack,
    useRadioGroup,
    UseRadioProps,
    chakra
} from '@chakra-ui/react'
import { useAlertService } from '@/services/useAlertService'
import React, { useEffect, useState } from 'react'
import { CHECKIN_CHILD, CHECKOUT_CHILD, CHILD_BY_QRCODE } from '../_graphql'

type ChildByQrCode = {
    getChildByQRCode: {
        _id: string
        firstName: string
        lastName: string
        picture: string
        gender: string
        parents: {
            _id: string
            picture: string
            firstName: string
            lastName: string
            relationship: string
        }[]
        alternativeContacts: {
            _id: string
            firstName: string
            lastName: string
            picture: string
        }[]
    }
}

type Parent = {
    _id: string
    picture: string
    firstName: string
    lastName: string
    relationship?: string
}

function CustomRadio(props: UseRadioProps & { parent: Record<string, any> }) {
    const { parent, ...radioProps } = props
    const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
        useRadio(radioProps)

    return (
        <chakra.label {...htmlProps} cursor="pointer">
            <input {...getInputProps({})} hidden />
            <Box
                {...getRadioProps()}
                bg={state.isChecked ? 'brand.50' : 'transparent'}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                borderColor="brand.50"
                px={5}
                py={3}
            >
                <Flex {...getLabelProps()}>
                    <Avatar
                        name={`${parent.firstName} ${parent.lastName}`}
                        src={parent.picture}
                    />
                    <Box ml="3" textAlign={'left'}>
                        <Text fontWeight="bold">
                            {`${parent.firstName} ${parent.lastName}`}
                        </Text>
                        <Text fontSize="sm">
                            {(parent?.relationship && 'Parent') || 'Guardian'}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </chakra.label>
    )
}

const ParentModal = ({
    image,
    onClose,
    isCheckIn
}: {
    onClose: () => void
    image: {
        value: string | null
        info: string | null
    }
    isCheckIn: boolean
}) => {
    const alertService = useAlertService()

    const { loading, data } = useQuery<ChildByQrCode>(CHILD_BY_QRCODE, {
        variables: { qrCodeData: image.info },
        fetchPolicy: 'no-cache',
        onError: (error) => {
            alertService.error(error.message, error.name)
            onClose()
        },
        skip: image.value === null
    })
    const [checkedById, setCheckedById] = useState<string>('')
    const [groupData, setGroupData] = useState<Parent[]>([])
    const [checkIn, checkInResult] = useMutation(CHECKIN_CHILD)
    const [checkOut, checkOutResult] = useMutation(CHECKOUT_CHILD)

    const submitChildCheck = async () => {
        let firstName, lastName
        if (data?.getChildByQRCode) {
            firstName = data.getChildByQRCode.firstName
            lastName = data.getChildByQRCode.lastName
        }
        try {
            if (isCheckIn) {
                await checkIn({
                    variables: {
                        input: {
                            qrCode: image.info,
                            checkInBy: checkedById
                        }
                    }
                })
                alertService.success(`Checked in ${firstName} ${lastName}`, 'Success')
                onClose()
            } else {
                await checkOut({
                    variables: {
                        input: {
                            qrCode: image.info,
                            checkOutBy: checkedById
                        }
                    }
                })
                alertService.success(`Checked out ${firstName} ${lastName}`, 'Success')
                onClose()
            }
        } catch (error: any) {
            alertService.error(error.message, error.name)
        }
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'checkedById',
        defaultValue: '',
        onChange: setCheckedById
    })

    useEffect(() => {
        if (data) {
            setGroupData([
                ...data.getChildByQRCode.parents,
                ...data.getChildByQRCode?.alternativeContacts
            ])
        }
    }, [data])

    return (
        <Modal isOpen onClose={onClose}>
            <ModalOverlay />

            {loading ? (
                <Spinner size="lg" />
            ) : (
                <ModalContent bg="white">
                    <ModalHeader fontWeight="normal">Select adult</ModalHeader>

                    <ModalCloseButton />
                    {!!data && (
                        <Card>
                            <CardBody>
                                <Flex
                                    my={2}
                                    flex="1"
                                    gap="4"
                                    alignItems="center"
                                    flexWrap="wrap"
                                >
                                    <Avatar
                                        borderWidth="1px"
                                        size="lg"
                                        borderColor="gray.100"
                                        name={`${data.getChildByQRCode.firstName} ${data.getChildByQRCode.lastName}`}
                                        src={data.getChildByQRCode.picture}
                                    />
                                    <Box py={3}>
                                        <Heading size="md">{`${data.getChildByQRCode.firstName} ${data.getChildByQRCode.lastName}`}</Heading>
                                        <Text textColor="gray">
                                            Gender: {data.getChildByQRCode.gender || '-'}
                                        </Text>
                                    </Box>
                                </Flex>
                                {data.getChildByQRCode && (
                                    <Box>
                                        <Text py={4} size="md">
                                            Who is{' '}
                                            {isCheckIn ? 'checking-in ' : 'checking-out '}{' '}
                                            this child?
                                        </Text>
                                        <Stack
                                            marginTop={2}
                                            marginBottom={2}
                                            {...getRootProps()}
                                        >
                                            {groupData.map((parent) => {
                                                return (
                                                    <CustomRadio
                                                        key={parent._id}
                                                        parent={parent}
                                                        {...getRadioProps({
                                                            value: parent._id
                                                        })}
                                                    />
                                                )
                                            })}
                                        </Stack>
                                        <Box pt={6}>
                                            <Button
                                                width="full"
                                                isDisabled={checkedById === ''}
                                                isLoading={
                                                    checkInResult.loading ||
                                                    checkOutResult.loading
                                                }
                                                onClick={submitChildCheck}
                                            >
                                                {isCheckIn
                                                    ? 'Check In Child'
                                                    : 'Check Out Child'}
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </CardBody>
                        </Card>
                    )}
                </ModalContent>
            )}
        </Modal>
    )
}

export default ParentModal
