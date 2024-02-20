'use client'

import '@fontsource/roboto'
import '@fontsource/poppins'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {
    MetricsProvider,
    MetricsDebugOverlay,
    MetricDefinition
} from '@cabify/prom-react'

import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system'
import { AuthProvider } from '@/services/AuthContext'
import { ApolloWrapper } from '@/services/apollo-wrapper'
import { envConfig } from '@/helpers/envConfig'

const fonts = {
    body: "'Roboto', sans-serif",
    heading: "'Poppins', san-serif"
}

/**
 * The color from figma is '#28275E'
 * which is 400, the rest is tinted & saturated
 * using HSB
 */
const colors = {
    brand: {
        50: '#CFCFFF',
        100: '#bbb9e7',
        200: '#6D6AFF',
        300: '#5451C4',
        400: '#28275E',
        500: '#28275E',
        600: '#3b3989',
        700: '#323176',
        800: '#181738',
        900: '#242355'
    }
}

const buttonBaseStyle = defineStyle({
    fontWeight: 'normal', // change the font weight to normal
    fontFamily: 'Roboto' // change the font family to monospaced
})

const buttonTheme = defineStyleConfig({
    baseStyle: buttonBaseStyle,
    defaultProps: {
        colorScheme: 'brand'
    }
})

const styles = {
    global: {
        'html, body': {
            // color: 'gray.600',
        },
        a: {
            color: '#5451C4'
        }
    }
}

const theme = extendTheme({
    fonts,
    colors,
    styles,
    components: { Button: buttonTheme }
})

const gatewayFetchOptions = {
    headers: {
        Authorization: envConfig.prometheusAuthHeader as string
    }
}

const normalizePath = (path: string) => {
    const match = path.match(/\/user\/(\d+)/)
    if (match) {
        return `/user/`
    }
    return path
}

const customMetrics: MetricDefinition[] = [
    {
        type: 'counter',
        name: 'user_device_agent',
        description:
            'user device such as screen resolution, device type, & browser details.'
    },
    {
        type: 'counter',
        name: 'user_device_connection',
        description:
            'user device such as screen resolution, device type, & browser details.'
    },
    {
        type: 'counter',
        name: 'user_device_vendor',
        description:
            'user device such as screen resolution, device type, & browser details.'
    }
]

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MetricsProvider
            appName="children-church-check-in-app"
            customMetrics={customMetrics}
            fetchOptions={gatewayFetchOptions}
            getNormalizedPath={normalizePath}
            metricsAggregatorUrl={envConfig.prometheusMetricsAggregatorUrl}
        >
            <ApolloWrapper>
                <AuthProvider>
                    <CacheProvider>
                        <ChakraProvider theme={theme}>
                            {process.env.NODE_ENV !== 'production' && (
                                <MetricsDebugOverlay withLogger onClose={() => {}} />
                            )}
                            {children}
                        </ChakraProvider>
                    </CacheProvider>
                </AuthProvider>
            </ApolloWrapper>
        </MetricsProvider>
    )
}
