import * as hapi from '@hapi/hapi'
import axios from 'axios'
import Config from '../config'
import { Response } from '../model/response'
import { authUrl, logoutUrl, redirectUrl, tokenUrl, userInfoUrl } from './'
import * as jwt from 'jsonwebtoken'

export const loginRedirect = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    return h.redirect(authUrl
        + '?client_id=' + Config.auth.client_id
        + '&response_type=code'
        + '&scope=openid profile email'
        + '&redirect_uri=' + redirectUrl);
}
export const logoutRedirect = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    return h.redirect(logoutUrl)
}
export const loginCallback = async (req: hapi.Request, h: hapi.ResponseToolkit): Promise<Response> => {
    let code: string = req.query.code
    const tokenParams = new URLSearchParams()
    tokenParams.append('grant_type', 'authorization_code')
    tokenParams.append('code', code)
    tokenParams.append('redirect_uri', redirectUrl)
    return await axios.post(tokenUrl, tokenParams, {
        auth: {
            username: Config.auth.client_id,
            password: Config.auth.client_secret
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then((res) => axios.get(userInfoUrl
        + '?access_token=' + res.data.access_token))
    .then((res) => {
        return {
            statusCode: "200",
            data: {
                jwt: jwt.sign(res.data, Config.jwt.tokenkey,{
                    expiresIn: Config.jwt.tokenexpire
                })
            }
        }
    })
    .catch((err)=>{
        return {
            statusCode: "403",
            error: "INVALID_CODE",
            message: "The authorization code is invalid."
        }
    })
}