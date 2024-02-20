import { gql } from '@apollo/client'
/**
 * All graphql for teachers should live here
 */

export const CHILD_BY_QRCODE = gql`
    query getChild($qrCodeData: String!) {
        getChildByQRCode(qrCodeData: $qrCodeData) {
            _id
            firstName
            lastName
            gender
            picture
            parents {
                _id
                firstName
                lastName
                relationship
                picture
            }
            alternativeContacts {
                _id
                firstName
                lastName
                picture
            }
        }
    }
`

export const CHECKIN_CHILD = gql`
    mutation checkin($input: CheckinInput!) {
        checkin(input: $input) {
            _id
            checkedIn
            checkedOut
            checkedInDate
            checkedOutDate
        }
    }
`

export const CHECKOUT_CHILD = gql`
    mutation checkout($input: CheckoutInput!) {
        checkout(input: $input) {
            _id
            checkedIn
            checkedOut
            checkedInDate
            checkedOutDate
        }
    }
`
/**
 * Usage of FIND_ALL_CHECKINS query

    variables: {
        whereCondition: {
            checkedInDate_eq: today,
            checkedOutDate_eq: today
        },
        // if "whereCondition" is not used, "whereOperator" isn't needed
        whereOperator: {
            operator: "OR" || "AND"
        },
        pagination: {
            page: 1,
            limit: 10,
        },
        order: {
            direction: "ASC" || "DESC",
            field: 'checkedInDate'
        }
    },
 */

export const FIND_ALL_CHECKINS = gql`
    query findAllCheckins(
        $pagination: CheckinsPageInput
        $whereCondition: CheckinsWhereInput
        $whereOperator: CheckinsWhereOperator
        $order: CheckinsSortInput
    ) {
        findAllCheckins(
            pagination: $pagination
            whereCondition: $whereCondition
            whereOperator: $whereOperator
            order: $order
        ) {
            checkInAggregates {
                totalCheckedIn
                totalCheckedOut
            }
            checkInResults {
                _id
                checkedIn
                checkedOut
                checkedInDate
                checkedOutDate
                checkedInUserBy {
                    _id
                    firstName
                    lastName
                    auth0UserId
                    email
                }
                checkedOutUserBy {
                    _id
                    firstName
                    lastName
                    auth0UserId
                    email
                }
                checkedInParentBy {
                    _id
                    firstName
                    lastName
                    phoneNumber
                    relationship
                }
                checkedOutParentBy {
                    _id
                    firstName
                    lastName
                    phoneNumber
                    relationship
                }
                checkedInAlternativeContactBy {
                    _id
                    firstName
                    lastName
                }
                checkedOutAlternativeContactBy {
                    _id
                    firstName
                    lastName
                }
                child {
                    _id
                    firstName
                    lastName
                }
            }
        }
    }
`
