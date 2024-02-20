import {
    Card,
    CardBody,
    CardHeader,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Circle
} from '@chakra-ui/react'

export type DetailsCardProps = {
    stats: number
    label: string
    Icon: React.ReactNode
    text?: string
}

export const InfoCard = ({ stats, label, Icon, text }: DetailsCardProps) => (
    <Card bg={'brand.900'} maxW="md">
        <CardHeader
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Circle size="50px" bg="brand.100">
                {Icon}
            </Circle>
        </CardHeader>
        <CardBody>
            <Stat>
                <StatLabel color={'whiteAlpha.900'}>{label}</StatLabel>
                <StatNumber color={'whiteAlpha.900'}>{stats}</StatNumber>
                <StatHelpText color={'whiteAlpha.900'}>{text}</StatHelpText>
            </Stat>
        </CardBody>
    </Card>
)
