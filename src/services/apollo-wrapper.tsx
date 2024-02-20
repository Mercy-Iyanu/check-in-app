'use client'
// REFERENCE: https://www.apollographql.com/blog/announcement/frontend/using-apollo-client-with-next-js-13-releasing-an-official-library-to-support-the-app-router/
import { ApolloLink, HttpLink } from '@apollo/client'
import {
    ApolloNextAppProvider,
    NextSSRApolloClient,
    NextSSRInMemoryCache,
    SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr'
import { envConfig } from '@/helpers/envConfig'
import { getFromLocalStorage } from '@/helpers/localStorageHelper'
import { TOKEN_KEY } from '@/helpers/constants'

const GRAPHQL_ENDPOINT = envConfig.graphQLEndpoint

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = getFromLocalStorage(TOKEN_KEY)
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }))

    return forward(operation)
})

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT })

function makeClient() {
    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === 'undefined'
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true
                      }),
                      httpLink
                  ])
                : ApolloLink.from([authMiddleware, httpLink])
    })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
    )
}
