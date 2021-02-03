import * as hapi from '@hapi/hapi'
import { InteractionResults } from 'oidc-provider';
import oidc from "../oidc";

export const pageHandler = async (req: hapi.Request, h: hapi.ResponseToolkit) => {
    let details: InteractionResults;
    try {
        details = await oidc.interactionDetails(req.raw.req,req.raw.res);
    }catch{
        return h.abandon
    }
    
    switch(details.prompt.name){
        case 'login':
            return h.view('login', {
                uid: req.params['uid'],
                prompt: 'login'
            });
        case 'consent':
            return h.view('consent', {
                uid: req.params['uid'],
                scopes: details.prompt.details.scopes.new,
                prompt: 'consent',
                clientName: (await oidc.Client.find(details.params.client_id))?.clientName || '此应用'
            });
    }
}