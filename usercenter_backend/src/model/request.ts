import * as hapi from '@hapi/hapi'
import { JWTUser } from './jwtuser'
export interface RequestAuth extends hapi.RequestAuth {
    credentials: {
        user: JWTUser
    }
}
export interface Request extends hapi.Request {
    auth: RequestAuth
}