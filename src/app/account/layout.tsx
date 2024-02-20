'use client'
import Image from 'next/image'
import { Flex, Stack } from '@chakra-ui/react'
import logo from '@/assets/TheLordHeritage_logo.png'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
            <Stack spacing={8} mx={'auto'} minW={['sm', 'md']} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Image src={logo} alt="church logo" />
                </Stack>

                {children}
            </Stack>
        </Flex>
    )
}
