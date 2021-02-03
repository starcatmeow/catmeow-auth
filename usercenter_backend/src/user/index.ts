import * as hapi from '@hapi/hapi'
import Joi from 'joi'
import { changePasswordHandler, emailChallengeHandler, emailVerifyHandler, getClientNameHandler, logHandler, registerHandler } from './handler'
export const userRoute: hapi.ServerRoute[] = [
    {
        method: 'GET',
        path: '/user/accesslog',
        options: {
            auth: 'user',
            validate: {
                query: Joi.object({
                    limit: Joi.number().min(1).max(50).default(10),
                    page: Joi.number().min(1).default(1)
                })
            }
        },
        handler: logHandler
    },
    {
        method: 'PUT',
        path: '/user/password',
        options: {
            auth: 'user',
            validate: {
                payload: Joi.object({
                    oldpassword: Joi.string().min(8).max(20),
                    newpassword: Joi.string().min(8).max(20)
                })
            }
        },
        handler: changePasswordHandler
    },
    {
        method: 'POST',
        path: '/user/register',
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email(),
                    name: Joi.string().alphanum().min(4).max(20),
                    password: Joi.string().min(8).max(20)
                })
            }
        },
        handler: registerHandler
    },
    {
        method: 'GET',
        path: '/user/emailverify',
        options: {
            validate: {
                query: Joi.object({
                    uid: Joi.string().exist()
                })
            }
        },
        handler: emailVerifyHandler
    },
    {
        method: 'GET',
        path: '/user/emailchallenge',
        options: {
            validate: {
                query: Joi.object({
                    token: Joi.string().exist()
                })
            }
        },
        handler: emailChallengeHandler
    },
    {
        method: 'GET',
        path: '/client/{clientid}/name',
        options: {
            validate: {
                params: Joi.object({
                    clientid: Joi.string().min(32).max(32)
                })
            }
        },
        handler: getClientNameHandler
    }
]