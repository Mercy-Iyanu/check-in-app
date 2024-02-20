import { useLazyQuery, ApolloError } from '@apollo/client'
import { useRouter } from 'next/navigation'

import { deleteFromLocalStorage, saveToLocalStorage } from '@/helpers/localStorageHelper'
import { LOGIN_USER, MY_PROFILE } from '@/app/account/_graphql'
import { useAlertService } from './useAlertService'

export type UserService = {
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

/**
 * useUserService - The user service is a React hook that encapsulates
 * client-side logic and handles HTTP communication between the React
 * front-end and the Apollo client for everything related to users
 * @returns { login, logout }
 */
function useUserService(): UserService {
    const router = useRouter()
    const alertService = useAlertService()
    const TOKEN_KEY = 'children-church-auth-token'

    const [loginUser] = useLazyQuery(LOGIN_USER, {
        onError: (error) => {
            alertService.error(error.message, error.name)
        },
        onCompleted: (data) => {
            saveToLocalStorage(TOKEN_KEY, data.loginUser.accessToken)
            saveToLocalStorage('current-user', data.loginUser)

            if (data.loginUser?.isTeacher) {
                router.push('/user/teacher')
            } else {
                router.push('/user/parent')
            }
        }
    })

    const [myProfile] = useLazyQuery(MY_PROFILE, {
        onError: ({ graphQLErrors, networkError }: ApolloError) => {
            if (graphQLErrors) {
                for (let err of graphQLErrors) {
                    switch (err.extensions.code) {
                        case 'UNAUTHENTICATED':
                            alertService.error('Current User Not Found', err.message)
                            break
                        default:
                            return null
                    }
                }
            }
            if (networkError) {
                alertService.error(networkError.message, networkError.stack)
            }
        }
    })

    return {
        login: async (email: string, password: string) => {
            try {
                loginUser({
                    variables: {
                        data: {
                            email,
                            password
                        }
                    }
                })
            } catch (error: any) {
                alertService.error(error.message, error.statusCode)
            }
        },

        logout: () => {
            deleteFromLocalStorage(TOKEN_KEY)
            deleteFromLocalStorage('current-user')
            router.push('/')
            router.refresh()
        }
    }
}

export { useUserService }
