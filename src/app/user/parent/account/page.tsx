'use client'
import { useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    Container,
    Avatar,
    Center
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import ReactSelect from 'react-select'
import { FiEdit } from 'react-icons/fi'

import { PHONE_NUMBER_REGEX } from '@/helpers/constants'
import { AuthContext } from '@/services/AuthContext'
import { useAlertService } from '@/services/useAlertService'
import { GET_BRANCH, UPDATE_PARENT, PARENT_PROFILE_DATA } from '../_grapql'
import Countries from '@/helpers/listOfCountries.json'
import { MY_PROFILE } from '@/app/account/_graphql'

const UpdateProfileSchema = yup.object().shape({
    firstName: yup.string().max(50),
    lastName: yup.string().max(50),
    branch: yup
        .object({
            value: yup.string(),
            label: yup.string()
        })
        .nullable(),
    phoneNumber: yup.string().matches(PHONE_NUMBER_REGEX, 'Phone number is not valid'),
    address: yup.string().max(70),
    city: yup.string().max(50),
    state: yup.string().max(50),
    country: yup
        .object({
            value: yup.string(),
            label: yup.string()
        })
        .nullable()
})

type Option = {
    value: string
    label: string
}

// build country options
const countryOptions: Option[] = Countries.map((item) => ({
    value: item.name,
    label: item.name
}))

export default function UpdateMyProfile() {
    const { data: branchData, loading: isLoading } =
        useQuery<Record<string, any>>(GET_BRANCH)
    const { data: profileData } =
        useSuspenseQuery<Record<string, any>>(PARENT_PROFILE_DATA)

    const [updateMyProfileAsParent, { loading }] = useMutation(UPDATE_PARENT)
    const router = useRouter()
    const alertService = useAlertService()
    const { setAuthState, authState } = useContext(AuthContext)

    // build branch options
    const branchOptions: Option[] =
        branchData &&
        branchData.branches.map((branch: any) => ({
            value: branch._id,
            label: branch.name
        }))

    // refetch profile query
    const [myProfile] = useLazyQuery(MY_PROFILE, {
        onCompleted(data) {
            setAuthState({
                ...authState,
                currentUser: {
                    ...authState.currentUser,
                    ...data.myProfile
                }
            })
            router.push('/user/parent')
            alertService.success('Profile information successfully updated')
        },
        onError: () => {
            alertService.error('Unable to update profile')
        },
        fetchPolicy: 'no-cache'
    })

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(UpdateProfileSchema),
        defaultValues: {
            firstName: profileData?.findMyProfileAsParent.firstName,
            lastName: profileData?.findMyProfileAsParent.lastName,
            branch: {
                label: profileData?.findMyProfileAsParent?.branch.name,
                value: profileData?.findMyProfileAsParent?.branch._id
            },
            phoneNumber: profileData?.findMyProfileAsParent.phoneNumber,
            address: profileData?.findMyProfileAsParent.address,
            city: profileData?.findMyProfileAsParent.city,
            state: profileData?.findMyProfileAsParent.state,
            country: {
                label: profileData?.findMyProfileAsParent?.country,
                value: profileData?.findMyProfileAsParent?.country
            }
        }
    })

    const onSubmit = async (formValue: any) => {
        const values = {
            ...formValue,
            branch: formValue.branch.value,
            country: formValue.country.value
        }

        try {
            await updateMyProfileAsParent({
                variables: { data: values }
            })
            reset({
                firstName: '',
                lastName: '',
                branch: {
                    label: '',
                    value: ''
                },
                phoneNumber: '',
                address: '',
                city: '',
                state: '',
                country: {
                    label: '',
                    value: ''
                }
            })
            await myProfile()
        } catch (error: any) {
            alertService.error(error.message, error.name)
        }
    }

    useEffect(() => { }, [branchData, profileData])

    return (
        <Container>
            <Stack spacing={8} mx={'auto'} maxW={'xl'}>
                <Stack align={'center'}>
                    <Heading fontSize={'2xl'} textAlign={'center'}>
                        Account Details
                    </Heading>
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.600'}>
                        Update your profile information below ✌️
                    </Text>
                </Stack>

                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <Stack
                        direction={['column', 'row']}
                        mb={9}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Center gap="4">
                            <Avatar
                                size="xl"
                                src={profileData?.findMyProfileAsParent.picture}
                            />
                            <Stack gap={1}>
                                <Heading size="sm" textColor={'brand.400'}>
                                    {`${profileData?.findMyProfileAsParent.firstName} 
                                    ${profileData?.findMyProfileAsParent.lastName}`}
                                </Heading>
                                <Text textColor={'gray'}>
                                    {profileData?.findMyProfileAsParent.email}{' '}
                                </Text>
                            </Stack>
                        </Center>
                        <Box ml={8}>
                            {/* <Button
                                leftIcon={<FiEdit />}
                                colorScheme="gray"
                                variant="solid"
                                size="sm"
                            >
                                Edit image
                            </Button> */}
                        </Box>
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    console.log(file.name);
                                }
                            }}
                        />
                        <label htmlFor="file-upload" style={{ display: 'inline-block', cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '3px', border: '1px solid #ccc', borderRadius: '4px', transition: 'background-color 0.3s ease' }}>
                            Edit Image
                        </label>
                    </Stack>
                    <Stack spacing={4}>
                        <Stack direction={['column', 'row']}>
                            <FormControl isInvalid={Boolean(errors.firstName)}>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    type="text"
                                    id="firstName"
                                    {...register('firstName')}
                                />
                                <FormErrorMessage>
                                    {errors.firstName && errors.firstName.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.lastName)}>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type="text"
                                    id="lastName"
                                    {...register('lastName')}
                                />
                                <FormErrorMessage>
                                    {errors.lastName && errors.lastName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>

                        <FormControl isInvalid={Boolean(errors.phoneNumber)}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                type="tel"
                                id="phoneNumber"
                                {...register('phoneNumber')}
                            />
                            <FormErrorMessage>
                                {errors.phoneNumber && errors.phoneNumber.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={Boolean(errors.branch)}>
                            <FormLabel>Your Branch</FormLabel>
                            <Controller
                                name="branch"
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({ field }) => {
                                    return (
                                        <ReactSelect
                                            key={'branch'}
                                            {...field}
                                            isLoading={isLoading}
                                            isSearchable
                                            placeholder={'Choose branch'}
                                            options={branchOptions}
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>
                                {errors.branch && errors.branch.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Stack direction={['column', 'row']}>
                            <FormControl isInvalid={Boolean(errors.address)}>
                                <FormLabel>Address</FormLabel>
                                <Input
                                    type="text"
                                    id="address"
                                    {...register('address')}
                                />
                                <FormErrorMessage>
                                    {errors.address && errors.address.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.city)}>
                                <FormLabel>City</FormLabel>
                                <Input type="text" id="city" {...register('city')} />
                                <FormErrorMessage>
                                    {errors.city && errors.city.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>
                        <Stack direction={['column', 'row']}>
                            <FormControl isInvalid={Boolean(errors.state)}>
                                <FormLabel>State</FormLabel>
                                <Input
                                    type="text"
                                    id="state"
                                    {...register('state')}
                                    defaultValue={
                                        profileData?.findMyProfileAsParent.state
                                    }
                                />
                                <FormErrorMessage>
                                    {errors.state && errors.state.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.country)}>
                                <FormLabel>Country</FormLabel>
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <ReactSelect
                                                key={'country'}
                                                {...field}
                                                isSearchable
                                                placeholder={'Country'}
                                                options={countryOptions}
                                            />
                                        )
                                    }}
                                />
                                <FormErrorMessage>
                                    {errors.country && errors.country.message}
                                </FormErrorMessage>
                            </FormControl>
                        </Stack>
                        <Stack spacing={10} pt={2}>
                            <Button
                                type="submit"
                                loadingText="Submitting"
                                size="lg"
                                isLoading={loading}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Update Account
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    )
}