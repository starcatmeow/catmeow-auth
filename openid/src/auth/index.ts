import * as hapi from '@hapi/hapi'
import { Account } from '../model/user'
import { KoaContextWithOIDC } from 'oidc-provider'
import { pageHandler } from './page'
import { loginHandler } from './login'
import { abortHandler, consentHandler } from './consent'
import { clientNameHandler } from './client'
import Joi from 'joi'
import Config from '../config'

export const interactionRoutes: hapi.ServerRoute[] = [
    {
        method: 'GET',
        path: '/interaction/{uid}',
        handler: pageHandler
    },
    {
        method: 'GET',
        path: '/interaction/{uid}/{any*}',
        handler: pageHandler
    },
    {
        method: 'POST',
        path: '/interaction/{uid}/login',
        handler: loginHandler
    },
    {
        method: 'POST',
        path: '/interaction/{uid}/confirm',
        handler: consentHandler
    },
    {
        method: 'GET',
        path: '/interaction/{uid}/abort',
        handler: abortHandler
    },
    {
        method: 'GET',
        path: '/client/{clientid}/name',
        handler: clientNameHandler,
        options: {
            cors: {
                origin: [
                    Config.usercenter.frontend
                ]
            },
            validate: {
                params: Joi.object({
                    clientid: Joi.string().min(3).max(50)
                })
            }
        }
    }
]

export const findAccount = 
(ctx: KoaContextWithOIDC, sub: string, token?: any) => {
    return new Account(sub);
}