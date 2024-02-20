'use client'
import {
    Box,
    Stack,
    Heading,
    Text,
    Divider,
    Input,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Button,
    Flex
} from '@chakra-ui/react'
import Image from 'next/image'
import * as yup from 'yup'
import CustomLink from '@/components/CustomLink'
import { useRouter } from 'next/navigation'
import { useLazyQuery } from '@apollo/client'
import { useForm, Controller } from 'react-hook-form'
import { useMetrics } from '@cabify/prom-react'
import { useEffect } from 'react'

import { LOGIN_USER } from './account/_graphql'
import { useAlertService } from '@/services/useAlertService'
import { useAuth } from '@/services/AuthContext'
import PasswordInput from '@/components/PasswordInput'
import { yupResolver } from '@hookform/resolvers/yup'
import logo from '@/assets/TheLordHeritage_logo.png'

const loginSchema = yup
    .object({
        email: yup.string().required(),
        password: yup.string().required().min(6)
    })
    .required()

export interface NavigatorInterface extends Navigator {
    mozConnection?: Record<string, any>
    webkitConnection?: Record<string, any>
}

export default function ParentLogin() {
    const router = useRouter()
    const alertService = useAlertService()
    const auth = useAuth()
    const { observe } = useMetrics()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const [login, { loading }] = useLazyQuery(LOGIN_USER, {
        onError: (error) => {
            alertService.error(error.message, error.name)
        },
        onCompleted: (data) => {
            auth.setAuthState({
                ...auth.authState,
                token: data.login.accessToken,
                currentUser: data.login
            })
            router.push('/user') // default to parent page
            reset()
        }
    })

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            await login({
                variables: {
                    data: {
                        email: data.email,
                        password: data.password
                    }
                }
            })
        } catch (error: any) {
            alertService.error(error.message, error.name)
        }
    }

    function trackDeviceInfo() {
        const { userAgent, vendor } = window.navigator
        const connection = navigator.connection!

        observe('user_device_agent', { custom_tag: userAgent }, 1)
        observe('user_device_connection', { custom_tag: connection.type || 'unknown' }, 1)
        observe('user_device_vendor', { custom_tag: vendor }, 1)
    }

    useEffect(() => {
        trackDeviceInfo()
    }, [])

    return (
        <Flex
            minH={'100vh'}
            h={'100%'}
            align={'center'}
            justify={'center'}
            bg={'gray.50'}
        >
            <Stack spacing={8} mx={'auto'} minW={['sm', 'md']} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Image src={logo} alt="church logo" />
                    <Heading fontSize={'2xl'}>Account Login</Heading>
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.600'}>
                        Welcome, login to your account 🔐
                    </Text>
                </Stack>

                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl isInvalid={Boolean(errors.email)} isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" id="email" {...register('email')} />

                            <FormErrorMessage>
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={Boolean(errors.password)} isRequired>
                            <FormLabel>Password</FormLabel>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => <PasswordInput {...field} />}
                            />
                            <FormErrorMessage>
                                {errors.password && errors.password.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Stack spacing={4} pt={2}>
                            <Button
                                type="submit"
                                loadingText="Submitting"
                                size="lg"
                                isLoading={loading}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Login
                            </Button>
                            <Text align={'center'}>
                                Forgot Password?{' '}
                                <CustomLink href="/account/reset">Reset here</CustomLink>
                            </Text>
                        </Stack>
                        <Stack>
                            <Divider />
                            <Text align={'center'}>
                                If you are a <strong>new parent</strong>, register below
                                👇
                            </Text>
                            <CustomLink
                                borderColor={'brand.400'}
                                color={'brand.400'}
                                px={2}
                                py={2}
                                align={'center'}
                                border={'1px solid'}
                                borderRadius="6px"
                                _hover={{
                                    textDecoration: 'none',
                                    backgroundColor: 'brand.50',
                                    color: 'brand.900'
                                }}
                                _focus={{ outline: 'none', boxShadow: 'none' }}
                                href="/account/signup"
                            >
                                Create parent account
                            </CustomLink>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
