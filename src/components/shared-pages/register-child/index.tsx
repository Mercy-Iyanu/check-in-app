'use client'
import {
    Box,
    Stack,
    Heading,
    Text,
    Container,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    FormErrorMessage,
    FormHelperText
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@apollo/client'

import { CREATE_CHILDREN } from '../../../app/user/parent/_grapql'
import { useAlertService } from '@/services/useAlertService'
import { useAuth } from '@/services/AuthContext'
import {
    resizeFile,
    uploadToCloudinary,
    MAXIMUM_IMAGE_SIZE
} from '@/helpers/imageUploadUtility'
import {
    getFromLocalStorage,
    saveToLocalStorage,
    deleteFromLocalStorage
} from '@/helpers/localStorageHelper'

const createChildrenSchema = yup.object().shape({
    firstName: yup.string().min(2).required(),
    lastName: yup.string().min(2).required(),
    dateOfBirth: yup.date().required(),
    picture: yup
        .mixed()
        .required()
        .test('noImage', 'Image is required', (value: any) => {
            return value && value[0]?.size
        })
        .test('fileSize', 'The file is too large', (value: any) => {
            return value && value[0].size <= MAXIMUM_IMAGE_SIZE
        }),
    gender: yup.string().required(),
    allergies: yup.string().required(),
    bloodGroup: yup.string()
})

export default function RegisterChild() {
    const alertService = useAlertService()

    const { authState } = useAuth()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(createChildrenSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: new Date(),
            picture: '',
            allergies: '',
            gender: '',
            bloodGroup: ''
        }
    })

    const [createChildren] = useMutation(CREATE_CHILDREN, {
        onCompleted: () => {
            alertService.success('Child registered successfully')
            reset()
        },
        onError: (error: any) => {
            alertService.error(error.message, error.name)
        }
    })

    const onSubmit = async (formValue: any) => {
        /* cache image incase of error on backend */
        let hasImageBeenUploaded = getFromLocalStorage('image-url')

        if (!hasImageBeenUploaded) {
            const imageBlob = formValue.picture[0]
            const dataUrl = await resizeFile(imageBlob)
            const imageUploadUrl = await uploadToCloudinary(dataUrl)

            hasImageBeenUploaded = imageUploadUrl.url
            saveToLocalStorage('image-url', imageUploadUrl.url)
        }

        const parentId =
            (authState && authState?.currentUser?.parent?._id) ||
            (authState && authState.parent?._id)

        const value = {
            ...formValue,
            picture: hasImageBeenUploaded,
            parents: parentId
        }
        try {
            await createChildren({
                variables: {
                    input: {
                        ...value
                    }
                }
            })
            deleteFromLocalStorage('image-url')
        } catch (error: any) {
            alertService.error(error.message, error.name)
        }
    }

    return (
        <>
            <Container>
                <Stack textAlign={'center'} mb="4">
                    <Heading fontSize={'2xl'}>Register your child</Heading>
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.600'}>
                        Provide your child information
                    </Text>
                </Stack>

                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
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
                                <Input
                                    type="text"
                                    id="lastName"
                                    {...register('lastName')}
                                />
                                <FormErrorMessage>
                                    {errors.lastName && errors.lastName.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl
                                isInvalid={Boolean(errors.dateOfBirth)}
                                isRequired
                            >
                                <FormLabel>Date of Birth</FormLabel>
                                <Input
                                    type="date"
                                    id="dateOfBirth"
                                    {...register('dateOfBirth')}
                                />
                                <FormErrorMessage>
                                    {errors.dateOfBirth && errors.dateOfBirth.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.picture)} isRequired>
                                <FormLabel>Child&apos;s Photo</FormLabel>
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
                            <FormControl isInvalid={Boolean(errors.gender)} isRequired>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    id="gender"
                                    placeholder="Select Gender"
                                    {...register('gender')}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.gender && errors.gender.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={Boolean(errors.bloodGroup)}>
                                <FormLabel>Blood Group</FormLabel>
                                <Select
                                    id="bloodGroup"
                                    placeholder="Select Blood Group"
                                    {...register('bloodGroup')}
                                >
                                    <option value="A +">A+</option>
                                    <option value="A -">A-</option>
                                    <option value="B +">B+</option>
                                    <option value="B -">B-</option>
                                    <option value="O +">O+</option>
                                    <option value="O -">O-</option>
                                    <option value="AB +">AB+</option>
                                    <option value="AB -">AB-</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.bloodGroup && errors.bloodGroup.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={Boolean(errors.allergies)} isRequired>
                                <FormLabel>Allergies</FormLabel>
                                <Input
                                    type="text"
                                    id="allergies"
                                    {...register('allergies')}
                                />
                                <FormErrorMessage>
                                    {errors.allergies && errors.allergies.message}
                                </FormErrorMessage>
                            </FormControl>
                            <Button
                                mt={4}
                                type="submit"
                                size="lg"
                                isLoading={isSubmitting}
                                loadingText="Submitting"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Container>
        </>
    )
}
