'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/Datatable'
import { useQuery } from '@apollo/client'
import { ALL_CHILDREN, ALL_PARENTS, ALL_USERS } from './_graphql'
import { Box, Flex, Heading, Select, Spacer, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'

type Parent = {
    firstName: string
    lastName: string
    relationship: string | null
    gender: string | null
    phoneNumber: string
    user: { email: string }
    branch: {
        name: string
        leader: {
            firstName: string
            lastName: string
        }
    }
}
type Teacher = {
    firstName: string
    lastName: string
    email: string
    isTeacher: boolean
    member: {
        phoneNumber: string
        branch: {
            name: string
            leader: {
                firstName: string
                lastName: string
            }
        }
    }
}
type Children = {
    firstName: string
    lastName: string
    gender: string
    parents: {
        firstName: string
        lastName: string
        gender: string
        email: string
        relationship: string
        phoneNumber: string
        user: { email: string }
    }[]
}

const parentsColumnHelper = createColumnHelper<Parent>()
const parentsColumns = [
    parentsColumnHelper.accessor(
        (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`,
        {
            id: 'fullName',
            header: 'Name'
        }
    ),
    parentsColumnHelper.accessor('phoneNumber', { header: 'Phone Number' }),
    parentsColumnHelper.accessor('user.email', { header: 'Email' }),
    parentsColumnHelper.accessor('branch.name', { header: 'Branch' }),
    parentsColumnHelper.accessor(
        (row) =>
            `${row.branch.leader?.firstName ?? ''} ${row.branch.leader?.lastName ?? ''}`,
        {
            id: 'branchPastor',
            header: 'Branch Pastor'
        }
    )
]

const childrenColumnHelper = createColumnHelper<Children>()
const childrenColumns = [
    childrenColumnHelper.accessor(
        (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`,
        {
            id: 'fullName',
            header: 'Name'
        }
    ),
    childrenColumnHelper.accessor(
        (row) => `${row.parents[0]?.firstName ?? ''} ${row.parents[0]?.lastName ?? ''}`,
        {
            header: "Parent's Name",
            id: 'parentFullName'
        }
    ),
    childrenColumnHelper.accessor((row) => row.parents[0]?.email, {
        header: "Parent's Email",
        id: 'parentEmail'
    }),
    childrenColumnHelper.accessor((row) => row.parents[0]?.phoneNumber, {
        header: "Parent's Number",
        id: 'parentPhoneNumber'
    }),
    childrenColumnHelper.accessor((row) => row.parents[0]?.relationship, {
        header: '',
        id: 'parentRelationship'
    })
]

const teachersColumnHelper = createColumnHelper<Teacher>()
const teachersColumns = [
    teachersColumnHelper.accessor(
        (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`,
        {
            id: 'fullName',
            header: 'Name'
        }
    ),
    teachersColumnHelper.accessor('member.phoneNumber', { header: 'Phone Number' }),
    teachersColumnHelper.accessor('email', { header: 'Email' }),
    teachersColumnHelper.accessor('member.branch.name', { header: 'Branch' }),
    teachersColumnHelper.accessor(
        (row) =>
            `${row.member.branch.leader?.firstName ?? ''} ${
                row.member.branch.leader?.lastName ?? ''
            }`,
        {
            id: 'branchPastor',
            header: 'Branch Pastor'
        }
    )
]

enum Log {
    Parent,
    Teacher,
    Children
}
const Logs = () => {
    const { data: parentsData } = useQuery<{ parents: [] }>(ALL_PARENTS)
    const { data: usersData } = useQuery<{ users: [] }>(ALL_USERS)
    const { data: childrenData } = useQuery<{ findAllChildren: [] }>(ALL_CHILDREN)
    const [logType, setLogType] = useState<Log>(Log.Parent)

    const ParentsTable = () => (
        <DataTable data={parentsData?.parents ?? []} columns={parentsColumns} />
    )
    const TeachersTable = () => (
        <DataTable data={usersData?.users ?? []} columns={teachersColumns} />
    )
    const ChildrenTable = () => (
        <DataTable data={childrenData?.findAllChildren ?? []} columns={childrenColumns} />
    )

    return (
        <Box
            minH={['container.sm', 'container.md']}
            borderRadius={4}
            bg={'white'}
            mx={'auto'}
            py={5}
            px={{ base: 2, sm: 12, md: 17 }}
        >
            <Flex my={2} alignItems="center" gap="2" flexWrap="wrap">
                <Box p="2">
                    <Heading size="md" my={2}>
                        User Logs
                    </Heading>
                    <Text color={'gray.600'}>Here is a logs of users on the app.</Text>
                </Box>
                <Spacer />
                <VStack p="2" spacing={2} align="flex-start">
                    <Text>Choose Users</Text>
                    <Select
                        value={logType}
                        onChange={(e) => setLogType(parseInt(e.target.value))}
                        width="240px"
                        bgColor="#ffffff"
                        size="md"
                    >
                        <option value={Log.Parent}>Parents</option>
                        <option value={Log.Teacher}>Teachers</option>
                        <option value={Log.Children}>Children</option>
                    </Select>
                </VStack>
            </Flex>
            <Box p="2" bgColor="#ffffff">
                {logType === Log.Parent && <ParentsTable />}
                {logType === Log.Teacher && <TeachersTable />}
                {logType === Log.Children && <ChildrenTable />}
            </Box>
        </Box>
    )
}

export default Logs
