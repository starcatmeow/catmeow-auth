import * as hapi from '@hapi/hapi'
import Joi from 'joi'
import { AdminListHandler, ForceChangeEmailStatusHandler, ForceChangePasswordHandler, Generate200Handler, UserDetailHandler, UserListHandler, ChangeUserPermissionHandler, GetUserPermissionHandler, CreateClientHandler, UpdateClientHandler, DeleteClientHandler, GetClientHandler } from './handler'
export const adminRoute: hapi.ServerRoute[] = [
    {
        method: 'GET',
        path: '/admin/check',
        options: {
            auth: 'admin'
        },
        handler: Generate200Handler
    },
    {
        method: 'PUT',
        path: '/user/{uid}/permission',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    uid: Joi.string().min(24).max(24)
                }),
                payload: Joi.object({
                    admin: Joi.boolean().exist()
                })
            }
        },
        handler: ChangeUserPermissionHandler
    },
    {
        method: 'GET',
        path: '/user/{uid}/permission',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    uid: Joi.string().min(24).max(24)
                })
            }
        },
        handler: GetUserPermissionHandler
    },
    {
        method: 'GET',
        path: '/user/{uid}/profile',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    uid: Joi.string().min(24).max(24)
                })
            }
        },
        handler: UserDetailHandler
    },
    {
        method: 'GET',
        path: '/user',
        options: {
            auth: 'admin',
            validate: {
                query: Joi.object({
                    limit: Joi.number().min(1).max(50).default(10),
                    page: Joi.number().min(1).default(1),
                    search: Joi.string().min(0).max(20).default('')
                })
            }
        },
        handler: UserListHandler
    },
    {
        method: 'GET',
        path: '/admin',
        options: {
            auth: 'admin',
            validate: {
                query: Joi.object({
                    limit: Joi.number().min(1).max(50).default(10),
                    page: Joi.number().min(1).default(1)
                })
            }
        },
        handler: AdminListHandler
    },
    {
        method: 'PUT',
        path: '/user/{uid}/password',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    uid: Joi.string().min(24).max(24)
                }),
                payload: Joi.object({
                    password: Joi.string().min(8).max(20)
                })
            }
        },
        handler: ForceChangePasswordHandler
    },
    {
        method: 'PUT',
        path: '/user/{uid}/emailstatus',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    uid: Joi.string().min(24).max(24)
                }),
                payload: Joi.object({
                    verified: Joi.boolean().exist()
                })
            }
        },
        handler: ForceChangeEmailStatusHandler
    },
    {
        method: 'POST',
        path: '/client',
        options: {
            auth: 'admin',
            validate: {
                payload: Joi.object({
                    clientname: Joi.string().exist(),
                    redirecturi: Joi.string().exist()
                })
            }
        },
        handler: CreateClientHandler
    },
    {
        method: 'PUT',
        path: '/client/{clientid}',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    clientid: Joi.string().min(32).max(32)
                }),
                payload: Joi.object({
                    clientname: Joi.string().exist(),
                    redirecturi: Joi.string().exist()
                })
            }
        },
        handler: UpdateClientHandler
    },
    {
        method: 'DELETE',
        path: '/client/{clientid}',
        options: {
            auth: 'admin',
            validate: {
                params: Joi.object({
                    clientid: Joi.string().min(32).max(32)
                })
            }
        },
        handler: DeleteClientHandler
    },
    {
        method: 'GET',
        path: '/client',
        options: {
            auth: 'admin',
            validate: {
                query: Joi.object({
                    limit: Joi.number().min(1).max(50).default(10),
                    page: Joi.number().min(1).default(1)
                })
            }
        },
        handler: GetClientHandler
    }
]