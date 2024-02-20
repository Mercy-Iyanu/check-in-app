'use client'
import {
    Heading,
    Text,
    Container,
    Box,
    Flex,
    Spacer,
    HStack,
    Spinner,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FiCalendar, FiCheckCircle } from 'react-icons/fi'
import { useLazyQuery } from '@apollo/client'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FIND_ALL_CHECKINS } from '../_graphql'
import { useAlertService } from '@/services/useAlertService'
import { DataTable } from '@/components/Datatable'
import { createColumnHelper } from '@tanstack/react-table'
import { formatDate, getFullName } from '@/helpers/helpers'

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
    ),
    columnHelper.accessor(
        (row) => {
            return getFullName(row.checkedInUserBy)
        },
        {
            cell: (info) => info.getValue(),
            header: 'Checked In Teacher'
        }
    ),
    columnHelper.accessor(
        (row) => {
            return getFullName(row.checkedOutUserBy)
        },
        {
            cell: (info) => info.getValue(),
            header: 'Checked Out Teacher'
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

export default function TeacherReport() {
    const [data, setData] = useState<Data>({
        checkInResults: [],
        checkInAggregates: { totalCheckedIn: 0, totalCheckedOut: 0 }
    })
    const alertService = useAlertService()
    const [startDate, setStartDate] = useState(new Date())

    const [findAllCheckins, { loading }] = useLazyQuery(FIND_ALL_CHECKINS, {
        variables: {
            whereCondition: {
                checkedInDate_eq: startDate
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

    useEffect(() => {
        findAllCheckins()
    }, [data, findAllCheckins])

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
                        Report Check in
                    </Heading>
                    <Text color={'gray.600'}>
                        Here is a report of check-ins and check-outs for today.
                    </Text>
                </Box>
                <Spacer />
                <Box p="2">
                    <Text py="2" fontSize="small" color={'gray.600'}>
                        Calendar
                    </Text>
                    <HStack p="2" borderWidth="1px" borderRadius="lg">
                        <FiCalendar color="brand.500" />
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            dateFormat="d MMMM, yyyy"
                            customInput={
                                <input
                                    style={{
                                        border: 'none',
                                        outline: 'none'
                                    }}
                                />
                            }
                        />
                    </HStack>
                </Box>
            </Flex>

            <Container maxW={'full'} my={12}>
                <HStack p="6" mb={6} borderWidth="1px" borderRadius="lg">
                    <Stat>
                        <StatLabel>Total CheckIn</StatLabel>
                        <StatNumber>{data.checkInAggregates.totalCheckedIn}</StatNumber>
                        <StatHelpText>
                            Date: {`${new Date(startDate).toLocaleDateString('en-GB')}`}
                        </StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Total CheckOut</StatLabel>
                        <StatNumber>{data.checkInAggregates.totalCheckedOut}</StatNumber>
                        <StatHelpText>
                            Date: {`${new Date(startDate).toLocaleDateString('en-GB')}`}
                        </StatHelpText>
                    </Stat>
                </HStack>
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
