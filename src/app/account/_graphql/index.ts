import { gql } from '@apollo/client'

export const GET_BRANCH = gql`
    {
        branches {
            _id
            name
        }
    }
`

export const SIGNUP_PARENT = gql`
    mutation createParent($data: ParentInput!) {
        createParent(input: $data) {
            _id
            firstName
            middleName
            lastName
            relationship
            accessToken
            email
            picture
            phoneNumber
            branch {
                _id
                name
            }
            user {
                _id
                firstName
                lastName
                auth0UserId
                email
                url
                accessToken
            }
        }
    }
`
export const LOGIN_USER = gql`
    query login($data: UserLoginInput!) {
        login(input: $data) {
            _id
            firstName
            lastName
            auth0UserId
            email
            url
            accessToken
            roles {
                _id
                language
                name
                permissions {
                    _id
                    name
                }
            }
            parent {
                _id
                email
                phoneNumber
                relationship
                branch {
                    _id
                    name
                }
            }
            imageUrl
            source
            isTeacher
        }
    }
`

export const RESET_PASSWORD = gql`
    query forgotPassword($email: String!) {
        forgotPassword(email: $email) {
            success
            message
        }
    }
`

export const MY_PROFILE = gql`
    {
        myProfile {
            _id
            firstName
            lastName
            auth0UserId
            email
            isTeacher
            parent {
                _id
                phoneNumber
                relationship
                branch {
                    _id
                    name
                }
            }
        }
    }
`

export const LOGIN_USER_LEGACY = gql`
    query loginUser($data: UserLoginInput!) {
        loginUser(input: $data) {
            _id
            firstName
            lastName
            auth0UserId
            email
            url
            accessToken
            member {
                _id
                language
                firstName
                middleName
                lastName
                gender
                email
                phoneNumber
                membershipLevel
                maritalStatus
                photo {
                    fileUrl
                }
                occupation
                address
                city
                state
                country
                verified
                branch {
                    _id
                    name
                }
                user {
                    _id
                }
            }
            roles {
                _id
                language
                name
                permissions {
                    _id
                    name
                }
            }
            imageUrl
            source
            parent {
                _id
                firstName
                middleName
                lastName
                relationship
                gender
                phoneNumber
                email
                password
                picture
                address
                city
                state
                country
                qrCode
                branch {
                    _id
                }
                children {
                    _id
                    lastName
                    firstName
                    middleName
                }
                user {
                    _id
                }
            }
        }
    }
`

export const UPDATE_USER = gql`
    mutation updateUser($data: UserUpdateInput!, $id: String!) {
        updateUser(input: $data, id: $id) {
            _id
            firstName
            lastName
            auth0UserId
            email
            url
            accessToken
            member {
                _id
                language
                firstName
                middleName
                lastName
                gender
                email
                phoneNumber
                membershipLevel
                maritalStatus
                photo {
                    fileUrl
                }
                occupation
                address
                city
                state
                country
                verified
                branch {
                    _id
                    name
                }
                user {
                    _id
                }
            }
            roles {
                _id
                language
                name
                permissions {
                    _id
                    name
                }
            }
            imageUrl
            source
            parent {
                _id
                firstName
                middleName
                lastName
                relationship
                gender
                phoneNumber
                email
                password
                picture
                address
                city
                state
                country
                qrCode
                branch {
                    _id
                }
                children {
                    _id
                    lastName
                    firstName
                    middleName
                }
                user {
                    _id
                }
            }
        }
    }
`
