import { useState, useEffect } from 'react'
import { Alert, AlertIcon, CloseButton } from '@chakra-ui/react'

type AlertProps = {
    status: 'error' | 'success' | 'warning' | 'info'
    children: React.ReactNode
    autoClose?: boolean
    onClose?: () => void
    resetFunction?: () => void
}
const TIMEOUT_IN_MILLISECONDS = 10000

const CustomAlert = ({
    status,
    children,
    autoClose = true,
    onClose,
    resetFunction
}: AlertProps) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false)
                if (onClose) {
                    onClose()
                }
            }, TIMEOUT_IN_MILLISECONDS)

            return () => clearTimeout(timer)
        }
    }, [autoClose, onClose])

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) {
            onClose()
        }
    }

    const handleAlertClose = () => {
        setIsVisible(false)
        if (resetFunction) {
            resetFunction()
        }
    }

    return isVisible ? (
        <Alert status={status} display="flex" alignItems="center">
            <AlertIcon flex="0 0 auto" />
            {children}
            <CloseButton
                size="sm"
                ml="auto"
                onClick={handleAlertClose}
                _focus={{ outline: 'none' }}
            />
        </Alert>
    ) : null
}

export default CustomAlert
