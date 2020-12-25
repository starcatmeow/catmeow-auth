import * as hapi from '@hapi/hapi'
import oidc from './oidc'

const route = [
    {
        method: 'GET',
        path: '/test',
        handler: function(req: hapi.Request, h: hapi.ResponseToolkit) {
            return 'Test /test !'
        }
    },
    {
        path: '/oidc/{any*}',
        method: '*',
        config: { payload: { output: 'stream', parse: false } },
        async handler({ raw: { req, res } } : hapi.Request, h: hapi.ResponseToolkit) {
            req.url = req.url?.replace('/oidc/','/')
            await new Promise((resolve) => {
                res.on('finish', resolve);
                oidc.callback(req, res)
            })
            req.url = req.url?.replace('/','/oidc/')
            return res.finished ? h.abandon : h.continue
        }
    }
];

export default route;