'use client'

import React, { ReactNode } from 'react'
import {
    Box,
    CloseButton,
    Flex,
    BoxProps,
    Drawer,
    DrawerContent,
    useDisclosure
} from '@chakra-ui/react'
import {
    FiSettings,
    FiUsers,
    FiCheckCircle,
    FiLogOut,
    FiList,
    FiHome,
    FiUserPlus,
    FiFileText,
    FiUserCheck
} from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons'
import Image from 'next/image'

import { User } from '@/helpers/constants'
import logo from '../assets/TheLordHeritage_logo.png'
import NavItem from './NavItem'
import MobileNav from './MobileNav'
import { useAuth } from '@/services/AuthContext'

type LinkItemProps = {
    name: string
    icon: IconType
    href: string
    isActive?: boolean
}

const TeacherLinkItems: Array<LinkItemProps> = [
    { name: 'Dashboard', icon: FiHome, href: '/user/teacher' },
    { name: 'Check In/Out', icon: FiCheckCircle, href: '/user/teacher/check-in-out' },
    { name: 'Check In History', icon: FiList, href: '/user/teacher/teacher-report' },
    { name: 'User Logs', icon: FiFileText, href: '/user/teacher/logs' }
    // {
    //     name: 'Children List',
    //     icon: FiUsers,
    //     href: '/user/teacher/children-list'
    // },
    // {
    //     name: 'Register Child',
    //     icon: FiUserCheck,
    //     href: '/user/teacher/register-child'
    // }
]

const ParentLinkItems: Array<LinkItemProps> = [
    { name: 'Dashboard', icon: FiHome, href: '/user/parent' },
    {
        name: 'Register Child',
        icon: FiUserCheck,
        href: '/user/parent/register-child'
    },
    {
        name: 'Children List',
        icon: FiUsers,
        href: '/user/parent/children-list'
    },
    {
        name: 'Alternative Contact',
        icon: FiUserPlus,
        href: '/user/parent/alternative-contact'
    },
    { name: 'Account', icon: FiSettings, href: '/user/parent/account' }
]

type Props = {
    user: User
    children: ReactNode
}

export default function SideNav({ children, user }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box minH="100vh" bg={'gray.100'}>
            <SidebarContent
                user={user}
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <DrawerContent>
                    <SidebarContent user={user} onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    )
}

export interface SidebarProps extends BoxProps {
    user: User
    onClose: () => void
}

const SidebarContent = ({ user, onClose, ...rest }: SidebarProps) => {
    const { logout } = useAuth()
    const pathname = usePathname()

    return (
        <Box
            transition="3s ease"
            bg={'white'}
            borderRight="1px"
            borderRightColor={'gray.100'}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="48"
                pt="4"
                alignItems="center"
                mx="8"
                mb="4"
                justifyContent="space-between"
            >
                <Image src={logo} alt="app logo" height={120} />
                <CloseButton
                    bg="brand.50"
                    size="md"
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            {(user === User.Parent
                ? ParentLinkItems
                : user === User.Teacher
                ? TeacherLinkItems
                : ParentLinkItems
            ).map((link: LinkItemProps) => (
                <NavItem
                    isActive={pathname === link.href}
                    key={link.name}
                    icon={link.icon}
                    href={link.href}
                    aria-current={pathname === link.href}
                    onClick={onClose}
                >
                    {link.name}
                </NavItem>
            ))}
            <NavItem href="" mt="8" color="red" icon={FiLogOut} onClick={logout}>
                Logout
            </NavItem>
        </Box>
    )
}
