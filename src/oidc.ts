import { Provider, Configuration } from 'oidc-provider'
const configuration: Configuration = {
    formats: {
        AccessToken: 'jwt'
    },
    clients: [{
        client_id: 'test',
        client_secret: 'testsecret',
        redirect_uris: ['http://localhost:8888/cb']
    }]
}
const oidc = new Provider('http://localhost:8000', configuration)
export default oidc