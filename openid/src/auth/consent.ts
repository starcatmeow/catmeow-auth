import * as hapi from '@hapi/hapi'
import oidc from '../oidc'

export const consentHandler = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    await oidc.interactionFinished(req.raw.req, req.raw.res, {
        consent: {
            rejectedClaims: [],
            rejectedScopes: []
        }
    }, { mergeWithLastSubmission: true });
    return h.abandon;
}

export const abortHandler = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    await oidc.interactionFinished(req.raw.req, req.raw.res, {
        error: 'user_canceled',
        error_description: '用户取消登录'
    }, { mergeWithLastSubmission: true });
    return h.abandon;
}