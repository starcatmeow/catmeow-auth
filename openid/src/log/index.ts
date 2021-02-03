import { AccessLog } from '../model/accesslog'
import oidc from '../oidc'
export const logAccess = (code: 
    {
        clientId: string
        accountId: string,
        scope: string,
        authTime: number,
        iat: number
    }) => {
    let log = code
    log.authTime = log.iat
    new AccessLog(code).save()
}