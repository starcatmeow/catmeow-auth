import * as hapi from '@hapi/hapi'
import axios from 'axios'
import Joi from 'joi';
import Config from '../config'
import { JWTUser } from '../model/jwtuser';
import { Request } from '../model/request'
import { UserCenterAdmin } from '../model/usercenteradmin';
import { loginCallback, loginRedirect } from './handler'
import * as jwt from 'hapi-auth-jwt2'
import { exit } from 'process';
import { Client } from '../model/client';

export let authUrl: string;
export let tokenUrl: string;
export let userInfoUrl: string;
export let redirectUrl: string;

export const authInit = async (server: hapi.Server) => {
    axios.get(Config.auth.oidcurl + '/.well-known/openid-configuration')
    .then((res) => {
        authUrl = res.data.authorization_endpoint;
        tokenUrl = res.data.token_endpoint;
        userInfoUrl = res.data.userinfo_endpoint;
        redirectUrl = Config.frontendurl + '/auth/callback'
    })
    .catch(() => {
        console.error('OPENID COMPONENT OFFLINE!')
        exit(1)
    })
    const client = await Client.findById(Config.auth.client_id).exec()
    if(client == null){
        console.log('Cannot find usercenter openid client, create now...')
        await new Client({
            _id: Config.auth.client_id,
            payload: {
                client_id: Config.auth.client_id,
                client_secret: Config.auth.client_secret,
                redirect_uris: [
                    redirectUrl
                ],
                response_types: ['code'],
                grant_types: ['authorization_code'],
                client_name: Config.sitename,
                token_endpoint_auth: 'client_secret_basic'
            }
        }).save()
    }
    await server.register(jwt)
    server.auth.strategy('user', 'jwt', {
        key: Config.jwt.tokenkey,
        verify: {
            aud: false,
            iss: false
        },
        validate: (decoded: JWTUser, req: hapi.Request, h: hapi.ResponseToolkit) => {
            return {
                isValid: true,
                credentials: {
                    user: decoded
                }
            }
        }
    })
    server.auth.strategy('admin', 'jwt', {
        key: Config.jwt.tokenkey,
        verify: {
            aud: false,
            iss: false
        },
        validate: async (decoded: JWTUser, req: Request, h: hapi.ResponseToolkit) => {
            const result = await UserCenterAdmin.find({accountId: decoded.sub}).exec();
            if(result.length === 0){
                return {
                    isValid: false
                }
            }
            return {
                isValid: true,
                credentials: {
                    user: decoded
                }
            }
        }
    })
}

export const authRoute: hapi.ServerRoute[] = [
    {
        method: 'GET',
        path: '/auth/callback',
        handler: loginCallback,
        options: {
            validate: {
                query: Joi.object({
                    code: Joi.string().exist()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/auth/login',
        handler: loginRedirect
    }
]