import ejs from 'ejs'
import { Provider, Configuration } from 'oidc-provider'
import { exit } from 'process'
import { MongoAdapter } from './adapter/oidc/mongo_adapter'
import { findAccount } from './auth'
import Config from './config'
import { logAccess } from './log'
let jwks: any
let cookiekeys: any
// try {
    jwks = require('../config/jwks.json')
    cookiekeys = require('../config/cookiekeys.json')   
// }catch{
//     console.error('UNABLE TO IMPORT KEYS!')
//     exit(1)
// }
const configuration: Configuration = {
    adapter: MongoAdapter,
    findAccount: findAccount,
    claims: {
        profile: ['name'],
        email: ['email', 'email_verified']
    },
    cookies: {
        keys: cookiekeys
    },
    formats: {
        AccessToken: 'jwt'
    },
    features: {
        devInteractions: {
            enabled: false
        },
        frontchannelLogout: {
            enabled: true,
            ack: 'draft-04'
        },
        sessionManagement: {
            enabled: true,
            ack: 'draft-30'
        }
    },
    jwks,
    renderError: async function (ctx, out, error) {
        ctx.body = await ejs.renderFile(__dirname+'/view/render_error.ejs',{
            statusCode: 400,
            errorTitle: out.error,
            errorMessage: out.error_description
        })
        ctx.type = 'html'
    }
}

const oidc = new Provider('http://localhost:3000', configuration);
oidc.proxy = Config.UNDER_PROXY

oidc.on('authorization_code.consumed', logAccess)

export default oidc;