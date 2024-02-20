import { useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra,
    Icon,
    Flex,
    TableContainer
} from '@chakra-ui/react'
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs'
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    ColumnDef,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'

export type DataTableProps<Data extends object> = {
    data: Data[]
    columns: ColumnDef<Data, any>[]
}

export function DataTable<Data extends object>({ data, columns }: DataTableProps<Data>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        }
    })

    return (
        <TableContainer>
            <Table variant="striped" colorScheme="gray">
                <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                                const meta: any = header.column.columnDef.meta
                                return (
                                    <Th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        isNumeric={meta?.isNumeric}
                                    >
                                        <Flex alignItems={'center'}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            <chakra.span px={1}>
                                                {header.column.getIsSorted() ? (
                                                    header.column.getIsSorted() ===
                                                    'desc' ? (
                                                        <Icon
                                                            as={BsCaretDownFill}
                                                            boxSize={4}
                                                        />
                                                    ) : (
                                                        <Icon
                                                            as={BsCaretUpFill}
                                                            boxSize={4}
                                                            aria-label="sorted ascending"
                                                        />
                                                    )
                                                ) : null}
                                            </chakra.span>
                                        </Flex>
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                                const meta: any = cell.column.columnDef.meta
                                return (
                                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>
                                )
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
}
