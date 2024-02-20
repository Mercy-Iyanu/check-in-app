'use client'
import { useRef } from 'react'
import { Box, Stack, Heading, Text } from '@chakra-ui/react'
import * as yup from 'yup'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'

import CustomLink from '@/components/CustomLink'
import FormBuilder from '@/builder/form/Builder'
import FormTemplate from '@/builder/form/Template'
import { useAlertService } from '@/services/useAlertService'
import { RESET_PASSWORD } from '../_graphql'

const RESET_MESSAGE = `Please note the reset email can 
take a few minutes.  Don't forget to check your spam folder 😊`

const signupSchema = yup.object({
    email: yup.string().required()
})

type ResetType = {
    forgotPassword: { success: boolean; message: string }
}

export default function PasswordReset() {
    const alertService = useAlertService()
    const router = useRouter()

    const [forgotPassword, { loading }] = useLazyQuery<ResetType>(RESET_PASSWORD, {
        onError: (error) => {
            alertService.error(error.message, error.name)
        },
        onCompleted: (data: ResetType) => {
            const { message, success } = data.forgotPassword
            if (success) {
                alertService.success(RESET_MESSAGE, 'Password reset successfully')
                router.push('/')
            } else {
                alertService.error(message, 'Error')
            }
        }
    })

    const signEmailUpForm = useRef(
        new FormBuilder()
            .addField('email', 'Email', 'email')
            .isRequired()
            .setSchema(signupSchema)
            .build((data: { email: string }) => {
                forgotPassword({
                    variables: {
                        email: data.email
                    }
                })
            })
    )

    return (
        <>
            <Stack textAlign={'center'}>
                <Heading fontSize={'2xl'}>Reset your password</Heading>
                <Text fontSize={{ base: 'sm', sm: 'md' }} color={'gray.600'}>
                    You&apos;ll get an email with a reset link
                </Text>
            </Stack>

            <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                <Stack spacing={4}>
                    <FormTemplate
                        submitText="Reset Password"
                        isSubmitting={loading}
                        {...signEmailUpForm.current}
                    />
                    <Stack pt={6}>
                        <Text align={'center'}>
                            <CustomLink href="/account/signup">Return to Home</CustomLink>
                        </Text>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}
