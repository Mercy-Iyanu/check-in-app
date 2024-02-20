'use client'
import {
    Heading,
    Text,
    Container,
    SimpleGrid,
    Box,
    Flex,
    Spacer,
    HStack,
    Circle,
    Spinner
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FiUserCheck, FiUserX, FiCalendar, FiCheckCircle } from 'react-icons/fi'
import { useQuery } from '@apollo/client'
import { usePerformanceMark, Stage } from '@cabify/prom-react'

import { InfoCard } from './components/InfoCard'
import { useAuth } from '@/services/AuthContext'
import { FIND_ALL_CHECKINS } from './_graphql'
import { useAlertService } from '@/services/useAlertService'
import { DataTable } from '@/components/Datatable'
import { createColumnHelper } from '@tanstack/react-table'
import { formatDate, getFullName } from '@/helpers/helpers'

const today = new Date()

const columnHelper = createColumnHelper<Record<string, any>>()
const columns = [
    columnHelper.accessor((row) => getFullName(row.child), {
        cell: (info) => {
            return info.getValue()
        },
        id: 'fullName',
        header: 'Child’s Name'
    }),
    columnHelper.accessor('checkedInDate', {
        cell: (info) => formatDate(info.getValue()),
        header: 'Check In Time'
    }),
    columnHelper.accessor('checkedIn', {
        cell: (info) => info.getValue() && <FiCheckCircle color="green" />,
        header: 'Check In Status',
        enableSorting: false
    }),
    columnHelper.accessor('checkedOutDate', {
        cell: (info) => formatDate(info.getValue()),
        header: 'Check Out Time'
    }),
    columnHelper.accessor('checkedOut', {
        cell: (info) => info.getValue() && <FiCheckCircle color="red" />,
        header: 'Check Out Status',
        enableSorting: false
    }),
    columnHelper.accessor(
        (row) => {
            return (
                getFullName(row.checkedInParentBy) ||
                getFullName(row.checkedInAlternativeContactBy)
            )
        },
        {
            cell: (info) => info.getValue(),
            header: 'Checked In by'
        }
    ),
    columnHelper.accessor(
        (row) => {
            return (
                getFullName(row.checkedOutParentBy) ||
                getFullName(row.checkedOutAlternativeContactBy)
            )
        },
        {
            cell: (info) => info.getValue(),
            header: 'Checked out by'
        }
    )
]

type Data = {
    checkInResults: Record<string, any>[]
    checkInAggregates: {
        totalCheckedIn: number
        totalCheckedOut: number
    }
}

const Teacher = ({}) => {
    const [data, setData] = useState<Data>({
        checkInResults: [],
        checkInAggregates: { totalCheckedIn: 0, totalCheckedOut: 0 }
    })
    const { authState } = useAuth()
    const alertService = useAlertService()
    const user = authState.currentUser!

    const { loading } = useQuery(FIND_ALL_CHECKINS, {
        variables: {
            whereCondition: {
                checkedInDate_eq: today
            },
            order: {
                direction: 'DESC',
                field: 'checkedInDate'
            }
        },
        onCompleted: (data: any) => {
            setData(data.findAllCheckins)
        },
        onError: (error: any) => {
            alertService.error(error.message, error.name)
        }
    })

    usePerformanceMark(loading ? Stage.Usable : Stage.Complete, 'teachers-dashboard')
    
    useEffect(() => {}, [data])

    return (
        <Box
            minH={['container.sm', 'container.md']}
            borderRadius={4}
            bg={'white'}
            mx={'auto'}
            py={5}
            px={{ base: 2, sm: 12, md: 17 }}
        >
            <Flex alignItems="center" gap="2" flexWrap="wrap">
                <Box p="2">
                    <Heading size="md" my={2}>
                        Welcome {user.firstName} {user.lastName}
                    </Heading>
                    <Text color={'gray.600'}>
                        Dear teacher, we log your check-in and check-out information on
                        this page
                    </Text>
                </Box>
                <Spacer />
                <HStack p="2">
                    <Circle size="40px" bg="gray.50">
                        <FiCalendar color="black" size={'20px'} />
                    </Circle>
                    <Text
                        textTransform={'uppercase'}
                        fontSize={'sm'}
                        p={2}
                        alignSelf={'flex-start'}
                        rounded={'md'}
                    >
                        {today.toDateString()}
                    </Text>
                </HStack>
            </Flex>
            <SimpleGrid
                p="2"
                spacing="40px"
                my={8}
                templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
            >
                <InfoCard
                    stats={data.checkInAggregates.totalCheckedIn}
                    text="Children"
                    Icon={<FiUserCheck color="black" size={'20px'} />}
                    label="Total Check-in"
                />
                <InfoCard
                    stats={data.checkInAggregates.totalCheckedOut}
                    text="Children"
                    Icon={<FiUserX color="black" size={'20px'} />}
                    label="Total Check-out"
                />
            </SimpleGrid>
            <Container maxW={'full'} my={12}>
                <Heading py="4" color={'#414195'} fontSize="md">
                    Children Checked-in Today
                </Heading>
                {loading ? (
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="brand.200"
                        color="brand.500"
                        size="xl"
                    />
                ) : (
                    <DataTable columns={columns} data={data.checkInResults} />
                )}
            </Container>
        </Box>
    )
}

export default Teacher
