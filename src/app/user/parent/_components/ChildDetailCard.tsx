import { Box, Stack, Heading, Text, Avatar, Flex } from '@chakra-ui/react'

type Props = {
    name: string
    label: string
    gender: string
    picture: string
}

const ChildDetailCard = ({ name, label, picture, gender }: Props) => {
    return (
        <Box maxW={{ base: 'full', md: '275px' }} w={'full'} overflow="hidden">
            <Stack align={'start'} spacing={2} py={4}>
                <Text color={'gray'} fontSize="sm">
                    {label}
                </Text>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar
                        borderWidth="1px"
                        borderColor="gray.100"
                        name={name}
                        src={picture}
                    />
                    <Box>
                        <Heading size="sm">{name}</Heading>
                        <Text fontSize="xs">Gender: {gender || '-'} </Text>
                    </Box>
                </Flex>
            </Stack>
        </Box>
    )
}

export default ChildDetailCard
