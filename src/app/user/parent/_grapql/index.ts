import { gql } from '@apollo/client'

// the backend does not have dedicated query for fetching all the
// children belonging to a parent, hence why we are making use of
// myProfile query
export const FIND_ALL_CHILDREN = gql`
    {
        myProfile {
            _id
            parent {
                _id
                children {
                    _id
                    firstName
                    lastName
                    dateOfBirth
                    bloodGroup
                    gender
                    allergies
                    picture
                    qrCode
                    qrCodeData
                }
            }
        }
    }
`

export const ALTERNATIVE_CONTACT = gql`
    mutation createAlternativeContact($input: AlternativeContactInput!) {
        createAlternativeContact(input: $input) {
            _id
            title
            firstName
            middleName
            lastName
            phoneNumber
            address
            city
            state
            country
            picture
        }
    }
`

export const CREATE_CHILDREN = gql`
    mutation createChildren($input: ChildrenInput!) {
        createChildren(input: $input) {
            _id
            firstName
            lastName
        }
    }
`

export const DELETE_CHILD = gql`
    mutation deleteChild($id: String!) {
        deleteChild(id: $id) {
            _id
            firstName
            lastName
        }
    }
`

export const GET_BRANCH = gql`
    {
        branches {
            _id
            name
        }
    }
`

export const GET_ALL_CHILDREN = gql`
    {
        findMyProfileAsParent {
            _id
            children {
                _id
                firstName
                lastName
            }
        }
    }
`

export const UPDATE_PARENT = gql`
    mutation updateMyProfileAsParent($data: ParentUpdateInput!) {
        updateMyProfileAsParent(input: $data) {
            _id
            firstName
            middleName
            lastName
            relationship
            accessToken
            gender
            picture
            phoneNumber
            address
            city
            state
            country
            branch {
                _id
                name
            }
        }
    }
`

export const PARENT_PROFILE_DATA = gql`
    {
        findMyProfileAsParent {
            _id
            firstName
            middleName
            lastName
            email
            relationship
            gender
            picture
            phoneNumber
            address
            city
            state
            country
            children {
                _id
                firstName
                lastName
            }
            branch {
                _id
                name
            }
        }
    }
`
