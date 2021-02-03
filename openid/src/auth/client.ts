import * as hapi from '@hapi/hapi'
import oidc from '../oidc'

export const clientNameHandler = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    let name = (await oidc.Client.find(req.params.clientid))?.clientName
    if(!name){
        return {
            statusCode: "404"
        }
    }
    return {
        statusCode: "200",
        data: name
    }
}