import * as hapi from '@hapi/hapi'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import Config from '../config'
import { Client } from '../model/client'
import { Request } from '../model/request'
import { Response } from '../model/response'
import { User } from '../model/user'
import { UserCenterAdmin } from '../model/usercenteradmin'
export const Generate200Handler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    return {
        statusCode: '200'
    }
}
interface ChangeUserPermissionPayload {
    admin: boolean
}
export const ChangeUserPermissionHandler = async (req: Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <ChangeUserPermissionPayload> req.payload
    const uid = req.params.uid
    if(uid == req.auth.credentials.user.sub){
        return {
            statusCode: '400',
            error: 'CANNOT_CHANGE_YOURSELF'
        }
    }
    if(payload.admin){
        const admin = new UserCenterAdmin({accountId: uid})
        try{
            admin.save()
        }catch(err){
            return {
                statusCode: "400",
                error: "DUPLICATE_ADMIN"
            }
        }
    }else{
        const result = await UserCenterAdmin.findOneAndDelete({accountId: uid}).exec()
        if(result == null){
            return {
                statusCode: '400',
                error: 'ADMIN_NOT_EXIST'
            }
        }
    }
    return {
        statusCode: '200'
    }
}
export const GetUserPermissionHandler = async(req: hapi.Request,h: hapi.ResponseToolkit): Promise<Response> => {
    const uid = req.params.uid
    const result = await UserCenterAdmin.find({
        accountId: uid
    }).exec()
    return {
        statusCode: '200',
        data: {
            admin: !(result.length == 0)
        }
    }
}
export const UserDetailHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const uid = req.params.uid
    const result = await User.findById(uid)
    .select('-password -__v')
    .exec()
    if(result == null){
        return {
            statusCode: '400',
            error: 'USER_NOT_EXIST'
        }
    }
    return {
        statusCode: '200',
        data: result
    }
}
export const UserListHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const reg = new RegExp(req.query.search, 'i')
    let count = 0
    if(req.query.page == 1){
        count = await User.countDocuments({
            $or: [
                {email: {$regex: reg}},
                {name: {$regex: reg}}
            ]
        }).exec()
    }
    const result = await User.find({
        $or: [
            {email: {$regex: reg}},
            {name: {$regex: reg}}
        ]
    })
    .select('-password -__v')
    .limit(req.query.limit)
    .skip((req.query.page-1)*req.query.limit)
    .exec()
    return {
        statusCode: '200',
        data: result,
        length: count
    }
}
export const AdminListHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    let count = 0
    if(req.query.page == 1){
        count = await UserCenterAdmin.countDocuments().exec()
    }
    const result = await UserCenterAdmin.find()
    .select('-_id -__v')
    .limit(req.query.limit)
    .skip((req.query.page-1)*req.query.limit)
    .exec()
    return {
        statusCode: '200',
        data: result,
        length: count
    }
}
interface ForceChangePasswordPayload {
    password: string
}
export const ForceChangePasswordHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <ForceChangePasswordPayload>req.payload
    const uid = req.params.uid
    const user = await User.findById(uid).exec()
    if(user == null){
        return {
            statusCode: '400',
            error: 'USER_NOT_EXIST'
        }
    }
    const hashpassword = bcrypt.hashSync(payload.password, bcrypt.genSaltSync())
    user.set('password',hashpassword)
    user.save()
    return {
        statusCode: '200'
    }
}
interface ForceChangeEmailStatusPayload {
    verified: boolean
}
export const ForceChangeEmailStatusHandler = async (req: Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <ForceChangeEmailStatusPayload>req.payload
    const uid = req.params.uid
    if(uid == req.auth.credentials.user.sub){
        return {
            statusCode: '400',
            error: 'CANNOT_CHANGE_YOURSELF'
        }
    }
    const user = await User.findById(uid).exec()
    if(user == null){
        return {
            statusCode: '400',
            error: 'USER_NOT_EXIST'
        }
    }
    user.set('emailVerified', payload.verified)
    user.save()
    return {
        statusCode: '200'
    }
}
const generateSecret = () => {
    return crypto.randomBytes(16).toString('hex')
}
interface ClientInfoPayload {
    clientname: string,
    redirecturi: string
}
export const CreateClient = async (clientname: string, redirecturi: string): Promise<any> => {
    const clientId = generateSecret()
    const clientSecret = generateSecret()
    const client = new Client({
        _id: clientId,
        payload: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uris: [
                redirecturi
            ],
            response_types: ['code'],
            grant_types: ['authorization_code'],
            client_name: clientname,
            token_endpoint_auth: 'client_secret_basic'
        }
    })
    const result = await client.save()
    return result
}
export const CreateClientHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <ClientInfoPayload>req.payload
    const result = await CreateClient(payload.clientname,payload.redirecturi)
    return {
        statusCode: '200',
        data: result
    }
}
export const UpdateClientHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <ClientInfoPayload>req.payload
    const clientid = req.params.clientid
    let client = await Client.findById(clientid).exec()
    if(client == null){
        return {
            statusCode: '400',
            error: 'CLIENT_NOT_EXIST'
        }
    }
    let clientpayload = client.get('payload')
    clientpayload.client_name = payload.clientname
    clientpayload.redirect_uris = [payload.redirecturi]
    client.set('payload',clientpayload)
    client.markModified('payload')
    await client.save()
    return {
        statusCode: '200'
    }
}
export const DeleteClientHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const clientid = req.params.clientid
    if(clientid == Config.auth.client_id){
        return {
            statusCode: '400',
            error: 'CANNOT_DELETE_USERCENTER_CLIENT'
        }
    }
    const result = await Client.findByIdAndDelete(clientid)
    if(result == null){
        return {
            statusCode: '400',
            error: 'CLIENT_NOT_EXIST'
        }
    }
    return {
        statusCode: '200'
    }
}
export const GetClientHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const reg = new RegExp(req.query.search, 'i')
    let count = 0
    if(req.query.page == 1){
        count = await Client.countDocuments().exec()
    }
    const clients = await Client.find()
    .limit(req.query.limit)
    .skip((req.query.page-1)*req.query.limit)
    .exec()
    const result = clients.map(client => {
        let clientpayload = client.get('payload')
        clientpayload.client_secret = ''
        return clientpayload
    })
    return {
        statusCode: '200',
        data: result,
        length: count
    }
}