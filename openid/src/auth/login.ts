import * as hapi from '@hapi/hapi'
import oidc from '../oidc';
import { User } from '../model/user';
import bcrypt from 'bcrypt';
import Config from '../config'
import { InteractionResults } from 'oidc-provider'

interface loginPayload {
    prompt: String,
    login: String,
    password: String
}
enum AuthenticateError {
    NONE, USER_PASS_INCORRECT, EMAIL_NOT_VERIFIED
}
const authenticate = async (payload: loginPayload,ts: number): Promise<{account: string,error: AuthenticateError}> => {
    let query;
    if(payload.login.includes('@')){
        //email login
        query = {
            email: payload.login
        }
    }else{
        //username login
        query = {
            name: payload.login
        }
    }
    let user = await User.findOne(query).exec()
    if(user == null){
        return {account: "", error: AuthenticateError.USER_PASS_INCORRECT}
    }
    if(!bcrypt.compareSync(payload.password, user.get("password"))){
        return {account: "", error: AuthenticateError.USER_PASS_INCORRECT}
    }
    if(user.get("emailVerified") != true){
        return {account: user.id, error: AuthenticateError.EMAIL_NOT_VERIFIED}
    }
    return {account: user.id, error: AuthenticateError.NONE}
}

export const loginHandler = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    const payload = req.payload;
    let details: InteractionResults = {};
    try{
        details = await oidc.interactionDetails(req.raw.req,req.raw.res);
    }catch{
        h.view('error_template',{
            statusCode: 400,
            errorTitle: '请求无效',
            errorDescription: '如果你是用户，请返回重新点击登录<br/>如果你是开发者，请检查请求参数是否正确。'
        })
    }
    
    const loginPayload = <loginPayload> payload;
    if(!loginPayload.login || !loginPayload.password){
        return h.view('login',{
            uid: details.uid,
            prompt: 'login',
            message: '请输入用户名/邮箱和密码'
        })
    }
    const result = await authenticate(loginPayload, details.iat);
    if(result.error === AuthenticateError.USER_PASS_INCORRECT){
        return h.view('login',{
            uid: details.uid,
            prompt: 'login',
            message: '用户名/邮箱或密码错误',
            hint: loginPayload.login
        })
    }
    if(result.error === AuthenticateError.EMAIL_NOT_VERIFIED){
        return h.view('login',{
            uid: details.uid,
            prompt: 'login',
            message: '邮箱未验证',
            btn_name: '重新发送验证邮件',
            btn_url: Config.USERCENTER_BACKEND_URL+'/user/emailverify?uid='+result.account,
            successmsg: '发送成功',
            failmsg: '发送失败，详情查看控制台',
            hint: loginPayload.login
        })
    }
    await oidc.interactionFinished(req.raw.req,req.raw.res,{
        login: {
            account: result.account
        }
    }, {mergeWithLastSubmission: false})
    return h.abandon;
}