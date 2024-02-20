'use client'
import React, { ReactNode, createContext, useState, useContext } from 'react'
import {
    deleteFromLocalStorage,
    getFromLocalStorage,
    saveToLocalStorage
} from '@/helpers/localStorageHelper'
import { TOKEN_KEY } from '@/helpers/constants'
import { useRouter } from 'next/navigation'

type AuthContextType = {
    authState: AuthInfoType
    // eslint-disable-next-line
    setAuthState: (arg0: AuthInfoType) => void
    isAuthenticated: () => boolean
    logout: () => void
}

type AuthInfoType = {
    token: string | null
    currentUser: Record<string, any> | null
    parent: Record<string, any> | null
    isTeacher: boolean
    profileFetched: boolean
}

const initialAuthContextValue: AuthContextType = {
    authState: {
        token: null,
        currentUser: null,
        parent: null,
        isTeacher: false,
        profileFetched: false
    },
    setAuthState: () => {},
    isAuthenticated: () => false,
    logout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialAuthContextValue)

function AuthProvider({ children }: { children: ReactNode }) {
    const token: string | null = getFromLocalStorage(TOKEN_KEY)
    const currentUser: Record<string, any> | null = getFromLocalStorage('current-user')
    const router = useRouter()

    const [authState, setAuthState] = useState<AuthInfoType>({
        token,
        parent: null,
        currentUser,
        isTeacher: false,
        profileFetched: false
    })

    const setAuthInfo = ({
        token,
        currentUser,
        parent,
        isTeacher,
        profileFetched
    }: AuthInfoType) => {
        saveToLocalStorage(TOKEN_KEY, token)
        saveToLocalStorage('current-user', currentUser)

        setAuthState({
            token,
            parent,
            currentUser,
            isTeacher,
            profileFetched
        })
    }

    const isAuthenticated = () => {
        if (authState.token && authState.currentUser) {
            return true
        } else {
            return false
        }
    }

    const logout = () => {
        setAuthState({
            token: null,
            parent: null,
            currentUser: null,
            isTeacher: false,
            profileFetched: false
        })
        deleteFromLocalStorage(TOKEN_KEY)
        deleteFromLocalStorage('current-user')
        router.push('/')
        router.refresh()
    }

    return (
        <AuthContext.Provider
            value={{
                authState,
                setAuthState: (arg) => setAuthInfo(arg),
                isAuthenticated,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export { AuthContext, AuthProvider, useAuth }
