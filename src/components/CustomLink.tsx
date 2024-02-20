import { Link, LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'

type CustomLinkProps = {
    children: React.ReactNode
    href: string
    [rest: string]: any
} & LinkProps

const CustomLink = ({ href, children, ...rest }: CustomLinkProps) => {
    return (
        <Link color={'brand.200'} as={NextLink} href={href} {...rest}>
            {children}
        </Link>
    )
}

export default CustomLink
