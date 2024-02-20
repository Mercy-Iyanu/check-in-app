'use client'
import {
    Box,
    Stack,
    Heading,
    Text,
    Card,
    Container,
    CardBody,
    StackDivider,
    Flex
} from '@chakra-ui/react'
import DashboardChildrenSection from './_components/DashboardChildrenSection'
import { useAuth } from '@/services/AuthContext'
import { redirect } from 'next/navigation'
import { FiAlertOctagon } from 'react-icons/fi'

export default function ParentHome() {
    const { authState } = useAuth()
    const data = authState && authState?.currentUser
    const subData = data?.parent ? data.parent : data
    const parentData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        ...subData
    }

    if (parentData?.parent === null) redirect('/user/teacher')

    return (
        <Box
            minH={['container.sm', 'container.md']}
            borderRadius={4}
            bg={'white'}
            mx={'auto'}
            pt={5}
            px={{ base: 2, sm: 12, md: 17 }}
        >
            <Box p={4}>
                <Stack spacing={4} as={Container} maxW={'full'}>
                    <Heading fontSize={{ base: '3xl', sm: '3xl' }} fontWeight={'bold'}>
                        Parent Dashboard
                    </Heading>
                    <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
                        Welcome dear parent, we log your check-in and check-out
                        information on this page
                    </Text>
                    <Card
                        mt={4}
                        variant={'outline'}
                        width="fit-content"
                        direction={{ base: 'column', sm: 'row' }}
                    >
                        <CardBody>
                            <Stack
                                direction={['column', 'row']}
                                divider={<StackDivider />}
                                spacing="4"
                            >
                                <Box>
                                    <Text
                                        py="2"
                                        color={'gray.600'}
                                        fontSize="xs"
                                        textTransform="uppercase"
                                    >
                                        Name
                                    </Text>
                                    <Heading size="xs">
                                        {parentData?.firstName} {parentData?.lastName}
                                    </Heading>
                                </Box>
                                <Box>
                                    <Text
                                        py="2"
                                        color={'gray.600'}
                                        fontSize="xs"
                                        textTransform="uppercase"
                                    >
                                        Relationship
                                    </Text>
                                    <Heading size="xs">
                                        {parentData?.relationship}
                                    </Heading>
                                </Box>
                                <Box>
                                    <Text
                                        py="2"
                                        color={'gray.600'}
                                        fontSize="xs"
                                        textTransform="uppercase"
                                    >
                                        Email
                                    </Text>
                                    <Heading size="xs">{parentData?.email}</Heading>
                                </Box>
                                <Box>
                                    <Text
                                        py="2"
                                        color={'gray.600'}
                                        fontSize="xs"
                                        textTransform="uppercase"
                                    >
                                        Phone Number
                                    </Text>
                                    <Heading size="xs">{parentData?.phoneNumber}</Heading>
                                </Box>
                                <Box>
                                    <Text
                                        py="2"
                                        color={'gray.600'}
                                        fontSize="xs"
                                        textTransform="uppercase"
                                    >
                                        Church Branch
                                    </Text>
                                    <Heading size="xs">
                                        {parentData?.branch?.name}
                                    </Heading>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </Stack>

                <DashboardChildrenSection />
                {/* table section */}
                <Stack spacing={4} as={Container} maxW={'full'}>
                    <Heading fontSize={{ base: '2xl', sm: '2xl' }} fontWeight={'bold'}>
                        History
                    </Heading>
                    <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
                        Logs of your children check-in and check-out
                    </Text>
                </Stack>
                <Container maxW={'full'} my={12}>
                    <Box textAlign="center" py={10} px={6}>
                        <Box display="inline-block">
                            <Flex
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                bg={'brand.50'}
                                rounded={'50px'}
                                w={'55px'}
                                h={'55px'}
                                textAlign="center"
                            >
                                <FiAlertOctagon size={'30px'} color={'brand'} />
                            </Flex>
                        </Box>
                        <Heading as="h2" size="md" mt={6} mb={2}>
                            Data coming soon
                        </Heading>
                        <Text color={'gray.500'}>
                            No data available at the moment. The team is working on this.
                        </Text>
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}
