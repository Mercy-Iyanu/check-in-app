import {
    Box,
    Card,
    CardBody,
    Text,
    useRadio,
    UseRadioProps,
    CardHeader,
    Circle
} from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'

const RadioCard = (
    props: UseRadioProps & {
        children: React.ReactNode
    }
) => {
    const { getInputProps, getRadioProps } = useRadio(props)
    const input = getInputProps()
    const checkbox = getRadioProps()

    return (
        <Box as="label">
            <input {...input} />
            <Card
                {...checkbox}
                cursor="pointer"
                borderColor="gray.100"
                borderWidth="1px"
                _checked={{
                    bg: 'brand.50',
                    color: 'brand.400',
                    borderColor: 'brand.600'
                }}
                _focus={{
                    boxShadow: 'outline'
                }}
                maxW="350px"
                variant="elevated"
                backgroundColor="white"
            >
                <CardHeader>

                    <Circle size="50px" bg="gray.50" borderColor="gray.100" borderWidth="1px">
                        {props.children === 'Check Out' ? (
                            <FiCheckCircle color="red" size={'22px'} />
                        ) : (
                            <FiCheckCircle color="green" size={'22px'} />
                        )}
                    </Circle>
                </CardHeader>
                <CardBody>
                    <Text>{props.children}</Text>
                </CardBody>
            </Card>
        </Box>
    )
}

export default RadioCard
