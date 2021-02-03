import * as hapi from '@hapi/hapi'
export interface JWTUser extends hapi.AuthCredentials {
    sub: string,
    name: string,
    email: string,
    email_verified: boolean
}