import * as hapi from '@hapi/hapi'
import oidc from './oidc'
import { interactionRoutes } from './auth'

const oidcRoute: any[] = [
    {
        method: '*',
        path: '/{any*}',
        // why the config property isn't in hapi.ServerRoute but it's still useful???
        config: { payload: { output: 'stream',parse:false } },
        handler: async ({ raw: { req, res } } : hapi.Request, h: hapi.ResponseToolkit) => {
            await new Promise((resolve) => {
                res.on('finish', resolve);
                oidc.callback(req, res)
            })
            return res.writableEnded ? h.abandon : h.continue;
        }
    }
];

let route: hapi.ServerRoute[] = [];

route = route.concat(oidcRoute);
route = route.concat(interactionRoutes)

export default route;