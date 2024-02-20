import { useToast } from '@chakra-ui/react'

export type AlertService = {
    success: (message: string, title?: string) => void
    error: (message?: string, title?: string) => void
    info: (message: string, title?: string) => void
}

/**
 * For showing the toast badge when the user needs to be alerted about
 * their actions on the app. It is built around chakra Ui toast hooks
 * It has 3 states; success, error, info
 * @returns AlertService
 */
function useAlertService(): AlertService {
    const toast = useToast()
    return {
        success: (message: string, title?: string) => {
            return toast({
                title: title || 'Success',
                description: message,
                status: 'success',
                duration: 8000,
                isClosable: true,
                position: 'top-right'
            })
        },
        error: (message?: string, title?: string) => {
            return toast({
                title: title || 'Error',
                description: message || 'An error occurred',
                status: 'error',
                duration: 8000,
                isClosable: true,
                position: 'top-right'
            })
        },
        info: (message: string, title?: string) => {
            return toast({
                title: title || 'Info',
                description: message,
                status: 'info',
                duration: 8000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }
}

export { useAlertService }
