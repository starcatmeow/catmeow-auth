import { loadConfig } from './config'
loadConfig()

import * as hapi from '@hapi/hapi'
import * as vision from '@hapi/vision'
import * as error from 'hapi-error'
import * as ejs from 'ejs'
import routes from './routes'
import { Mongo as MongoAdapter } from './adapter/oidc/mongo'
import mongoose from 'mongoose'
import Config from './config'

const init = async () => {
    MongoAdapter.setup()
    mongoose.connect('mongodb://'+Config.mongo.user+':'+Config.mongo.password+'@'+Config.mongo.host+'/auth', {
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    const server = new hapi.Server({
        port: Config.listen_port,
        host: Config.listen_addr
    });
    await server.register(vision);
    await server.register(error);
    server.views({
        engines: { ejs: ejs },
        relativeTo: __dirname,
        path: `view`,
        layout: true
    })
    server.route(routes);
    await server.start();
    console.log('Server running on ',server.info.uri)
}

init();