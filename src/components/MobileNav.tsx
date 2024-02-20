import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import {
    IconButton,
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    FlexProps,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Avatar
} from '@chakra-ui/react'

import { FiMenu, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '@/services/AuthContext'

export interface MobileProps extends FlexProps {
    onOpen: () => void
}

export default function MobileNav({ onOpen, ...rest }: MobileProps) {
    const { authState, logout } = useAuth()
    const user = authState.currentUser!

    return (
        user && (
            <Flex
                ml={{ base: 0, md: 60 }}
                px={{ base: 4, md: 4 }}
                height="20"
                alignItems="center"
                justifyContent={{ base: 'space-between', md: 'flex-end' }}
                {...rest}
            >
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiMenu />}
                />
                <HStack spacing={{ base: '0', md: '6' }}>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                py={2}
                                transition="all 0.3s"
                                _focus={{ boxShadow: 'none' }}
                            >
                                <HStack>
                                    <Avatar
                                        name={`${user.firstName} ${user.lastName}`}
                                        src={user?.picture}
                                    />
                                    <VStack
                                        display={{ base: 'none', md: 'flex' }}
                                        alignItems="flex-start"
                                        spacing="1px"
                                        ml="2"
                                    >
                                        <Text fontSize="sm">{`${user.firstName} ${user.lastName}`}</Text>
                                        <Text fontSize="xs" color="gray.600">
                                            {user.email}
                                        </Text>
                                    </VStack>
                                    <Box display={{ base: 'none', md: 'flex' }}>
                                        <FiChevronDown />
                                    </Box>
                                </HStack>
                            </MenuButton>
                            <MenuList>
                                {user.parent && !user.isTeacher ? (
                                    <MenuItem>
                                        <Link
                                            style={{ textDecoration: 'none' }}
                                            as={NextLink}
                                            href="/user/parent/account"
                                        >
                                            Account
                                        </Link>
                                    </MenuItem>
                                ) : null}
                                <MenuItem onClick={logout}>Sign out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </HStack>
            </Flex>
        )
    )
}
