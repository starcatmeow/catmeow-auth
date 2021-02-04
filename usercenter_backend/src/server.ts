import { loadConfig } from './config'
loadConfig()

import * as hapi from '@hapi/hapi'
import routes from './routes'
import mongoose from 'mongoose'
import Config from './config'
import { authInit } from './auth'

const init = async () => {
    mongoose.connect('mongodb://'+Config.mongo.user+':'+Config.mongo.password+'@'+Config.mongo.host+'/auth', {
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    const server = new hapi.Server({
        port: Config.listen_port,
        host: Config.listen_addr,
        routes: {
            cors: {
                origin: [
                    Config.frontendurl,
                    Config.auth.oidcurl
                ]
            }
        }
    });
    await authInit(server)
    server.route(routes);
    await server.start();
    console.log('Server running on ',server.info.uri)
}

init();