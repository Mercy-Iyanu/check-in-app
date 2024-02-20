'use client'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    HStack,
    Stack,
    Button,
    Heading,
    Text,
    Select,
    FormHelperText
} from '@chakra-ui/react'
import isEmpty from 'lodash.isempty'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useMutation } from '@apollo/client'
import ReactSelect from 'react-select'

import CustomLink from '@/components/CustomLink'
import { PHONE_NUMBER_REGEX } from '@/helpers/constants'
import { GET_BRANCH, SIGNUP_PARENT } from '../_graphql'
import { useAuth } from '@/services/AuthContext'
import {
    resizeFile,
    uploadToCloudinary,
    MAXIMUM_IMAGE_SIZE
} from '@/helpers/imageUploadUtility'
import { useAlertService } from '@/services/useAlertService'
import PasswordInput from '@/components/PasswordInput'
import {
    saveToLocalStorage,
    getFromLocalStorage,
    deleteFromLocalStorage
} from '@/helpers/localStorageHelper'

const SignUpSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required').min(6),
    relationship: yup.string().required('Relationship is required'),
    branch: yup
        .object({
            value: yup.string(),
            label: yup.string()
        })
        .required('Branch is required'),
    phoneNumber: yup
        .string()
        .matches(PHONE_NUMBER_REGEX, 'Phone number is not valid')
        .required('Phone Number is required'),
    picture: yup
        .mixed()
        .required()
        .test('noImage', 'Image is required', (value: any) => {
            return value && value[0]?.size
        })
        .test('fileSize', 'The file is too large', (value: any) => {
            return value && value[0]?.size <= MAXIMUM_IMAGE_SIZE
        })
})

type Option = {
    value: string
    label: string
}

export default function Home() {
    const { data: branchData } = useSuspenseQuery<Record<string, any>>(GET_BRANCH)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createParent] = useMutation(SIGNUP_PARENT)
    const router = useRouter()
    const { setAuthState, authState } = useAuth()
    const alertService = useAlertService()

    const branchOptions: Option[] =
        branchData &&
        branchData.branches.map((branch: any) => ({
            value: branch._id,
            label: branch.name
        }))

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(SignUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            picture: '',
            relationship: '',
            branch: {},
            phoneNumber: ''
        }
    })

    const onSubmit = async (formValue: any) => {
        setIsSubmitting(true)

        /* cache image incase of error on backend */
        let hasImageBeenUploaded = getFromLocalStorage('image-url')

        if (!hasImageBeenUploaded) {
            const imageBlob = formValue.picture[0]
            const dataUrl = await resizeFile(imageBlob)
            const imageUploadUrl = await uploadToCloudinary(dataUrl)

            hasImageBeenUploaded = imageUploadUrl.url
            saveToLocalStorage('image-url', imageUploadUrl.url)
        }

        const values = {
            ...formValue,
            picture: hasImageBeenUploaded,
            branch: formValue.branch.value
        }

        try {
            const { data: createParentData } = await createParent({
                variables: { data: values }
            })

            setAuthState({
                ...authState,
                token: createParentData?.createParent.user.accessToken,
                currentUser: createParentData?.createParent
            })

            setIsSubmitting(false)
            deleteFromLocalStorage('image-url')
            router.push('/user/parent')
            reset()
        } catch (error: any) {
            setIsSubmitting(false)
            alertService.error(error.message, error.name)
        }
    }

    useEffect(() => {
        if (!isEmpty(branchData)) {
            reset({ branch: branchData.branches[0]._id })
        }
    }, [branchData, reset])

    return (
        <>
            <Stack align={'center'}>
                <Heading fontSize={'2xl'} textAlign={'center'}>
                    Parent Sign up
                </Heading>
                <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.600'}>
                    to register and check-in your children ✌️
                </Text>
            </Stack>
            <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                <Stack spacing={4}>
                    <HStack>
                        <FormControl isInvalid={Boolean(errors.firstName)} isRequired>
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
                        <FormControl isInvalid={Boolean(errors.lastName)} isRequired>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" id="lastName" {...register('lastName')} />
                            <FormErrorMessage>
                                {errors.lastName && errors.lastName.message}
                            </FormErrorMessage>
                        </FormControl>
                    </HStack>
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
                        <FormHelperText>
                            Password must be minimum of 6 characters 🚨
                        </FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={Boolean(errors.phoneNumber)} isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input type="tel" id="phoneNumber" {...register('phoneNumber')} />

                        <FormErrorMessage>
                            {errors.phoneNumber && errors.phoneNumber.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={Boolean(errors.relationship)} isRequired>
                        <FormLabel>Relationship</FormLabel>
                        <Select id="relationship" {...register('relationship')}>
                            <option value="parent">Parent</option>
                            <option value="guardian">Guardian</option>
                        </Select>

                        <FormErrorMessage>
                            {errors.relationship && errors.relationship.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={Boolean(errors.branch)} isRequired>
                        <FormLabel>Your Branch</FormLabel>
                        <Controller
                            name="branch"
                            control={control}
                            render={({ field }) => (
                                <ReactSelect
                                    {...field}
                                    isSearchable
                                    placeholder="choose branch"
                                    options={branchOptions}
                                />
                            )}
                        />
                        <FormErrorMessage>
                            {errors.branch && errors.branch.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={Boolean(errors.picture)} isRequired>
                        <FormLabel>My Photo</FormLabel>
                        <Input
                            type="file"
                            id="picture"
                            accept="image/*"
                            {...register('picture')}
                        />
                        <FormErrorMessage>
                            {errors.picture && errors.picture.message}
                        </FormErrorMessage>
                        <FormHelperText>
                            Maximum image size allowed is 4MB 😉
                        </FormHelperText>
                    </FormControl>
                    <Stack spacing={10} pt={2}>
                        <Button
                            type="submit"
                            loadingText="Submitting"
                            size="lg"
                            isLoading={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Sign up
                        </Button>
                    </Stack>
                    <Stack pt={6}>
                        <Text align={'center'}>
                            Do you have parent account?{' '}
                            <CustomLink href="/">Login</CustomLink>
                        </Text>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}
