'use client'
import { Flex, Icon, FlexProps } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import CustomLink from './CustomLink'

interface NavItemProps extends FlexProps {
    icon: IconType
    href: string
    isActive?: boolean
    children: string | number
}

export default function NavItem({
    icon,
    href,
    isActive = false,
    children,
    ...rest
}: NavItemProps) {
    return (
        <CustomLink
            href={href}
            color="brand.400"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                my="1"
                borderRadius="md"
                role="group"
                cursor="pointer"
                bg={isActive ? 'gray.200' : 'transparent'}
                _hover={{
                    bg: 'brand.300',
                    color: 'white'
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white'
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </CustomLink>
    )
}
