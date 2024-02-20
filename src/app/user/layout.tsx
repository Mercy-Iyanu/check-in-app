'use client'
import { AuthContext } from '@/services/AuthContext'
import { useContext, useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { useQuery } from '@apollo/client'
import { MY_PROFILE } from '../account/_graphql'
import { usePathname, useRouter } from 'next/navigation'

/** `ProfileWrapper` is a full screen loading page,
 * only rendered when user is authenticated and profile has not been fetched.
 * On render, a query is made to fetch the profile which updates the app state (`profileFetched` and `isTeacher`) */
const ProfileWrappper = () => {
    const { setAuthState, authState } = useContext(AuthContext)
    const router = useRouter()
    useQuery<{ myProfile: { isTeacher: boolean; parent: Record<string, any> } }>(
        MY_PROFILE,
        {
            onCompleted(data) {
                setAuthState({
                    ...authState,
                    isTeacher: data.myProfile.isTeacher,
                    parent: data.myProfile.parent,
                    profileFetched: true
                })
            },
            onError: () => {
                router.push('/')
            },
            fetchPolicy: 'no-cache'
        }
    )
    return (
        <Flex
            position="fixed"
            zIndex={100000}
            align="center"
            justify="center"
            w="100vw"
            minH="100vh"
            backgroundColor="#ffffff"
        >
            <Spinner />
        </Flex>
    )
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, authState } = useContext(AuthContext)
    const pathname = usePathname()
    const router = useRouter()
    const isParentRoute = pathname.startsWith('/user/parent')
    const isTeacherRoute = pathname.startsWith('/user/teacher')

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/')
        }

        if (authState.profileFetched && authState.isTeacher && !isTeacherRoute) {
            router.push('/user/teacher')
        }

        if (authState.profileFetched && !authState.isTeacher && !isParentRoute) {
            router.push('/user/parent')
        }
    }, [authState])

    return !authState.profileFetched ? (
        <ProfileWrappper />
    ) : isParentRoute || isTeacherRoute ? (
        <>{children}</>
    ) : (
        <></>
    )
}
