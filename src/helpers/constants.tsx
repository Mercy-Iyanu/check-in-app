enum User {
    Parent,
    Admin,
    Teacher
}
/**
 * Phone Number Regex validates the following:
(123) 456-7890
+(123) 456-7890
+(123)-456-7890
+(123) - 456-7890
+(123) - 456-78-90
123-456-7890
123.456.7890
1234567890
+31636363634
075-63546725
Reference: https://stackoverflow.com/a/33561517/5197022
 */
const PHONE_NUMBER_REGEX = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g

const TOKEN_KEY = 'children-church-auth-token'

export { User, PHONE_NUMBER_REGEX, TOKEN_KEY }
