'use client'
import { Heading, Text, Container, Flex, Button, Stack, Spinner } from '@chakra-ui/react'
import ChildDetailCard from './ChildDetailCard'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { FiPlusCircle } from 'react-icons/fi'

import { FIND_ALL_CHILDREN } from '../_grapql'
import { useAlertService } from '@/services/useAlertService'

type ChildType = {
    _id: string
    firstName: string
    gender: string
    lastName: string
    picture: string
}

function DashboardChildrenSection() {
    const [children, setChildren] = useState<ChildType[] | []>([])
    const alertService = useAlertService()

    const [findAllChildren, { loading }] = useLazyQuery(FIND_ALL_CHILDREN, {
        onCompleted: (data) => {
            setChildren(data.myProfile.parent.children)
        },
        onError: (error) => {
            alertService.error(error.message, error.name)
        }
    })

    const listChildren = () => {
        return children.length > 0 ? (
            children.map((child: ChildType, index: number) => {
                return (
                    <ChildDetailCard
                        key={child._id}
                        name={`${child.firstName} ${child.lastName}`}
                        gender={child.gender}
                        picture={child.picture}
                        label={`Child ${index + 1}`}
                    />
                )
            })
        ) : (
            <Text>
                No child added yet &nbsp;
                <Button
                    rightIcon={<FiPlusCircle />}
                    as={NextLink}
                    p={2}
                    size="sm"
                    variant="outline"
                    href="/user/parent/register-child"
                >
                    Add Children Here
                </Button>
            </Text>
        )
    }

    useEffect(() => {
        findAllChildren()
    }, [children])

    if (loading) {
        return (
            <Stack padding={6}>
                <Spinner />
            </Stack>
        )
    }

    return (
        <Container maxW={'full'} my={12}>
            <Heading py="4" color={'gray.600'} fontSize="md">
                List of Children
            </Heading>
            <Flex flexWrap="wrap" gridGap={6} justify="left">
                {listChildren()}
            </Flex>
        </Container>
    )
}

export default DashboardChildrenSection
