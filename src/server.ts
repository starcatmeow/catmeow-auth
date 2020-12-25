import * as hapi from '@hapi/hapi'
import routes from './routes'

const init = async () => {
    const server = new hapi.Server({
        port: 3000,
        host: 'localhost'
    });
    server.route(routes);
    await server.start();
    console.log('Server running on ',server.info.uri)
}

init();