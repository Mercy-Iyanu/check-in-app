import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'

type Data = {
    id: string
    name: string
    code: string
    checkinTime: string
    checkOutTime: string
    checkinBy: string
    checkOutBy: string
    teacher: string
}

type Props = {
    heading: string[]
    data: Data[]
}

const CustomTable = ({ heading, data }: Props) => {
    return (
        <TableContainer>
            <Table variant="striped" colorScheme="gray">
                <Thead>
                    <Tr>
                        {heading.map((title) => (
                            <Th key={title}>{title}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((child) => (
                        <Tr key={child.id}>
                            <Td>{child.name}</Td>
                            <Td>{child.code}</Td>
                            <Td>{child.checkinTime}</Td>
                            <Td>{child.checkinBy}</Td>
                            <Td>{child.checkOutTime}</Td>
                            <Td>{child.checkOutBy}</Td>
                            <Td>{child.teacher}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default CustomTable
