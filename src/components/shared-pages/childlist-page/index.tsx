'use client'
import { Box, Stack, Heading, Text, SimpleGrid } from '@chakra-ui/react'
import CheckInOutCard, { CheckInOutCardProps } from './CheckInOutCard'
import { useEffect, useState } from 'react'
import { useAlertService } from '@/services/useAlertService'
import { useLazyQuery } from '@apollo/client'
import { FIND_ALL_CHILDREN } from '../../../app/user/parent/_grapql'

export default function ChildListSharedPage() {
    const [children, setChildren] = useState<CheckInOutCardProps[] | []>([])
    const alertService = useAlertService()
    const [findAllChildren] = useLazyQuery(FIND_ALL_CHILDREN, {
        onCompleted: (data) => {
            setChildren(data.myProfile.parent.children)
        },
        onError: (error) => {
            alertService.error(error.message, error.name)
        }
    })

    const listChildren = () => {
        return children.length > 0 ? (
            children.map((child: CheckInOutCardProps) => {
                return (
                    <CheckInOutCard
                        key={child._id}
                        firstName={child.firstName}
                        lastName={child.lastName}
                        dateOfBirth={child.dateOfBirth}
                        gender={child.gender}
                        allergies={child.allergies}
                        bloodGroup={child.bloodGroup}
                        picture={child.picture}
                        qrCode={child.qrCode}
                        childId={child._id}
                    />
                )
            })
        ) : (
            <Text>No child added yet.</Text>
        )
    }

    useEffect(() => {
        findAllChildren()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children])

    return (
        <Box
            minH={['container.sm', 'container.md']}
            borderRadius={4}
            bg={'white'}
            mx={'auto'}
            pt={5}
            px={{ base: 2, sm: 12, md: 17 }}
        >
            <Box p={8}>
                <Stack spacing={4} justifyContent={'start'} maxW={'container.xl'}>
                    <Heading fontSize={{ base: '3xl', sm: '3xl' }} fontWeight={'bold'}>
                        List of Children
                    </Heading>
                    <Text color={'gray.600'} mb="4" fontSize={{ base: 'sm', sm: 'lg' }}>
                        You see the your child details and generate code for them
                    </Text>
                    <SimpleGrid
                        spacing={3}
                        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    >
                        {listChildren()}
                    </SimpleGrid>
                </Stack>
            </Box>
        </Box>
    )
}
