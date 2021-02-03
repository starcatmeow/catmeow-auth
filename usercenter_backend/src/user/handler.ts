import * as hapi from '@hapi/hapi'
import { AccessLog } from '../model/accesslog'
import { Request } from '../model/request'
import { Response } from '../model/response'
import { User } from '../model/user'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as nodemailer from 'nodemailer'
import Config from '../config'
import { Client } from '../model/client'
export const logHandler = async (req: Request, h: hapi.ResponseToolkit): Promise<Response> => {
    let count = 0
    if(req.query.page == 1){
        count = await AccessLog.countDocuments({
            accountId: req.auth.credentials.user.sub
        }).exec()
    }
    const result = await AccessLog.find({
        accountId: req.auth.credentials.user.sub
    })
    .sort({authTime: 'desc'})
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
enum AuthenticateResult {
    OK, PASSWORD_INCORRECT, USER_NOT_EXIST
}
const authenticate = async (uid: string, oldpassword: string): Promise<AuthenticateResult> => {
    const user = await User.findById(uid).exec()
    if(!user) return AuthenticateResult.USER_NOT_EXIST
    if(bcrypt.compareSync(oldpassword,user.get("password")))
        return AuthenticateResult.OK
    else return AuthenticateResult.PASSWORD_INCORRECT
}
interface ChangePasswordPayload {
    oldpassword: string,
    newpassword: string
}
export const changePasswordHandler = async (req: Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <ChangePasswordPayload>req.payload
    const authenticateResult = await authenticate(req.auth.credentials.user.sub, payload.oldpassword);
    if(authenticateResult != AuthenticateResult.OK){
        return {statusCode: "403",error: AuthenticateResult[authenticateResult]}
    }
    const user = await User.findById(req.auth.credentials.user.sub).exec()
    if(user === null){
        return {statusCode: "403",error: AuthenticateResult[AuthenticateResult.USER_NOT_EXIST]}
    }
    user.set("password",bcrypt.hashSync(payload.newpassword,bcrypt.genSaltSync()))
    user.save()
    return {statusCode: "200"}
}
interface RegisterPayload {
    email: string,
    name: string,
    password: string
}
export const registerHandler = async (req: Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const payload = <RegisterPayload>req.payload
    let user = new User({
        email: payload.email,
        name: payload.name,
        password: bcrypt.hashSync(payload.password, bcrypt.genSaltSync()),
        emailVerified: false
    })
    try{
        user = await user.save()
    }catch{
        return {
            statusCode: "400",
            error: "DUPLICATE_USER"
        }
    }
    const challengeToken = jwt.sign({
        uid: user.id,
        iat: Date.now()
    },Config.jwt.challengekey)
    emailTransporter.sendMail({
        from: Config.sitename+' <'+Config.email.auth.user+'>',
        to: user.get("name")+' <'+user.get("email")+'>',
        subject: '验证电子邮件地址',
        text: '请点击下方链接完成电子邮件地址验证：<br><br>'+Config.frontendurl+'/user/emailchallenge?token='+challengeToken
    })
    console.log(Config.frontendurl+'/user/emailchallenge?token='+challengeToken)
    return {
        statusCode: "200"
    }
}
const emailTransporter = nodemailer.createTransport(Config.email)
interface ChallengePayload {
    uid: string, 
    iat: number
}
export const emailVerifyHandler = async (req: Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const uid = req.query.uid
    const user = await User.findById(uid).exec()
    if(user === null){
        return {
            statusCode: "403",
            error: "USER_NOT_EXIST"
        }
    }
    if(user.get("emailVerified") === true){
        return {
            statusCode: "400",
            error: "EMAIL_ALREADY_VERIFIED"
        }
    }
    const challengeToken = jwt.sign({
        uid: uid,
        iat: Date.now()
    },Config.jwt.challengekey)
    emailTransporter.sendMail({
        from: Config.sitename+' <'+Config.email.auth.user+'>',
        to: user.get("name")+' <'+user.get("email")+'>',
        subject: '验证电子邮件地址',
        text: '请点击下方链接完成电子邮件地址验证：\n\n'+Config.frontendurl+'/user/emailchallenge?token='+challengeToken
    })
    return {
        statusCode: "200"
    }
}
export const emailChallengeHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    let payload: ChallengePayload
    try {
        payload = <ChallengePayload>jwt.verify(req.query.token, Config.jwt.challengekey)
    }catch {
        return {
            statusCode: "400",
            error: "INVALID_TOKEN"
        }
    }
    if(payload.iat > Date.now()+3600){
        return {
            statusCode: "400",
            error: "EXPIRED_TOKEN"
        }
    }
    const user = await User.findById(payload.uid);
    if(user === null){
        return {
            statusCode: "403",
            error: "USER_NOT_EXIST"
        }
    }
    user.set("emailVerified", true)
    user.save()
    return {
        statusCode: "200"
    }
}
export const getClientNameHandler = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    const clientid = req.params.clientid
    const client = await Client.findById(clientid).exec()
    if(client == null){
        return {
            statusCode: '404'
        }
    }else{
        return {
            statusCode: '200',
            data: client.get('payload').client_name
        }
    }
}