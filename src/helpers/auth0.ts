'use client'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { envConfig } from './envConfig'

const auth0Domain = envConfig.auth0Domain
const auth0ClientId = envConfig.clientId
const auth0ClientSecret = envConfig.clientSecret

export function verifyToken(token: string) {
    const publicKey = envConfig.auth0PublicKey as string // Type assertion here

    try {
        const decoded = jwt.verify(token, publicKey)
        return decoded
    } catch (error) {
        throw new Error('Invalid token')
    }
}

export async function login(email: string, password: string) {
    const tokenUrl = `https://${auth0Domain}/oauth/token`

    const response = await axios.post(tokenUrl, {
        grant_type: 'password',
        username: email,
        password,
        audience: `https://${auth0Domain}/api/v2/`,
        scope: 'openid',
        client_id: auth0ClientId,
        client_secret: auth0ClientSecret
    })

    const { access_token, id_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem(' id_token', id_token)

    return access_token
}

export async function signUp(username: string, password: string) {
    const signUpUrl = `https://${auth0Domain}/dbconnections/signup`

    await axios.post(signUpUrl, {
        client_id: auth0ClientId,
        email: username,
        password,
        connection: 'Username-Password-Authentication' // Update with the name of your Auth0 connection
    })

    // Perform login after successful sign-up
    await login(username, password)

    // Retrieve and return the authentication token
    const token = localStorage.getItem('access_token')
    return token
}
