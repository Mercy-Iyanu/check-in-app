'use client'
import { useState } from 'react'
import {
    Box,
    Stack,
    Heading,
    Text,
    Container,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Input
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { ALTERNATIVE_CONTACT, GET_ALL_CHILDREN } from '../_grapql'
import { useRouter } from 'next/navigation'
import { useAlertService } from '@/services/useAlertService'
import {
    resizeFile,
    uploadToCloudinary,
    MAXIMUM_IMAGE_SIZE
} from '@/helpers/imageUploadUtility'
import { PHONE_NUMBER_REGEX } from '@/helpers/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import {
    getFromLocalStorage,
    saveToLocalStorage,
    deleteFromLocalStorage
} from '@/helpers/localStorageHelper'

type DataArray = {
    value: string
    label: string
}

function extractValues(dataArray: DataArray[]) {
    return dataArray.map((item) => item.value)
}

const emergencyContactSchema = yup
    .object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        phoneNumber: yup
            .string()
            .matches(PHONE_NUMBER_REGEX, 'Phone number is not valid')
            .required('Phone Number is required'),
        address: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        country: yup.string().required(),
        children: yup.array().min(1, 'At least one child is required').required(),
        picture: yup
            .mixed()
            .required()
            .test('noImage', 'Image is required', (value: any) => {
                return value && value[0]?.size
            })
            .test(
                'fileSize',
                'The file is too large. Maximum allowed is 4MB',
                (value: any) => {
                    return value && value[0]?.size <= MAXIMUM_IMAGE_SIZE
                }
            )
    })
    .required()

export default function EmergencyContact() {
    const router = useRouter()
    const alertService = useAlertService()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createAlternativeContact] = useMutation(ALTERNATIVE_CONTACT, {
        onError: (error) => {
            alertService.error(error.message, error.name)
        },
        onCompleted: () => {
            alertService.success('Alternative contact added successfully', 'Congrats')
            router.push('/user/parent')
        }
    })
    const { data: childrenData } = useSuspenseQuery<Record<string, any>>(GET_ALL_CHILDREN)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(emergencyContactSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            country: '',
            children: [],
            picture: ''
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
            picture: hasImageBeenUploaded
        }

        try {
            await createAlternativeContact({
                variables: {
                    input: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        address: values.address,
                        city: values.city,
                        state: values.state,
                        country: values.country,
                        picture: values.picture,
                        children: extractValues(values.children)
                    }
                }
            })
            deleteFromLocalStorage('image-url')
        } catch (error: any) {
            alertService.error(error.message, error.name)
        }
        setIsSubmitting(false)
    }

    const options: DataArray[] =
        childrenData &&
        childrenData.findMyProfileAsParent.children.map((child: any) => ({
            value: child._id,
            label: child.firstName
        }))

    return (
        <>
            <Container>
                <Stack textAlign={'center'} mb="4">
                    <Heading fontSize={'2xl'}>Alternative Contact</Heading>
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.600'}>
                        Provide details of the person that can stand-in for you when you
                        are not available 🙅‍♀️
                    </Text>
                </Stack>

                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <Stack spacing={4}>
                            <HStack>
                                <FormControl
                                    isInvalid={Boolean(errors.firstName)}
                                    isRequired
                                >
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
                                <FormControl
                                    isInvalid={Boolean(errors.lastName)}
                                    isRequired
                                >
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
                            </HStack>
                            <FormControl
                                isInvalid={Boolean(errors.phoneNumber)}
                                isRequired
                            >
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
                            <HStack>
                                <FormControl
                                    isInvalid={Boolean(errors.address)}
                                    isRequired
                                >
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
                                <FormControl isInvalid={Boolean(errors.state)} isRequired>
                                    <FormLabel>State</FormLabel>
                                    <Input
                                        type="text"
                                        id="state"
                                        {...register('state')}
                                    />
                                    <FormErrorMessage>
                                        {errors.state && errors.state.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </HStack>
                            <HStack>
                                <FormControl isInvalid={Boolean(errors.city)} isRequired>
                                    <FormLabel>City</FormLabel>
                                    <Input type="text" id="city" {...register('city')} />

                                    <FormErrorMessage>
                                        {errors.city && errors.city.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl
                                    isInvalid={Boolean(errors.country)}
                                    isRequired
                                >
                                    <FormLabel>Country</FormLabel>
                                    <Input
                                        type="text"
                                        id="country"
                                        {...register('country')}
                                    />

                                    <FormErrorMessage>
                                        {errors.country && errors.country.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </HStack>
                            <FormControl isInvalid={Boolean(errors.picture)} isRequired>
                                <FormLabel>Person&apos;s Photo</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    id="picture"
                                    {...register('picture')}
                                />

                                <FormErrorMessage>
                                    {errors.picture && errors.picture.message}
                                </FormErrorMessage>
                                <FormHelperText>
                                    Maximum image size allowed is 4MB 😉
                                </FormHelperText>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.children)} isRequired>
                                <FormLabel>Your Children</FormLabel>
                                <Controller
                                    name="children"
                                    control={control}
                                    render={({ field }) => (
                                        <Select isMulti {...field} options={options} />
                                    )}
                                />
                                <FormErrorMessage>
                                    {errors.children && errors.children.message}
                                </FormErrorMessage>
                                <FormHelperText>
                                    Children you want this person to checkin or checkout
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
                                    Submit
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </>
    )
}
