import { gql } from '@apollo/client'

export const ALL_PARENTS = gql`
    {
        parents {
            _id
            firstName
            lastName
            relationship
            gender
            phoneNumber
            user {
                email
            }
            branch {
                name
                leader {
                    firstName
                    lastName
                }
            }
        }
    }
`

export const ALL_USERS = gql`
    query ($data: UserWhereInput = {isTeacher_eq: true}){
        users(whereCondition: $data) {
            _id
            firstName
            lastName
            email
            isTeacher
            member {
                phoneNumber
                branch {
                    name
                    leader {
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`

export const ALL_CHILDREN = gql`
{
    findAllChildren{
      _id
      firstName
      lastName
      gender
      parents {
        _id
        firstName
        lastName
        email
        relationship
        phoneNumber
        user {
            email
        }
        gender
      }
    }
  }`