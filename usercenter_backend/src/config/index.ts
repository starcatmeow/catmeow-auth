import { exit } from "process"
import config from 'config'

const Config = {
    listen_addr: '',
    listen_port: 0,
    frontendurl: '',
    mongo: {
        host: '',
        user: '',
        password: ''
    },
    auth: {
        oidcurl: '',
        client_id: '',
        client_secret: ''
    },
    jwt: {
        tokenkey: '',
        tokenexpire: '',
        challengekey: ''
    },
    sitename: '',
    email: {
        host: '',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    }
}
const dfsLoadConfig = (prefix: string[], configobj: any) => {
    for (const key of Object.keys(configobj)) {
        if (typeof configobj[key] == 'object') {
            dfsLoadConfig(prefix.concat(key), configobj[key])
        } else if (typeof configobj[key] == 'number') {
            configobj[key] = Number(config.get(prefix.concat(key).join('.')))
        } else if (typeof configobj[key] == 'boolean') {
            configobj[key] = Boolean(config.get(prefix.concat(key).join('.')))
        } else if (typeof configobj[key] == 'string') {
            configobj[key] = config.get(prefix.concat(key).join('.'))
        }
    }
}
export const loadConfig = () => {
    try {
        dfsLoadConfig([], Config)
    } catch (err) {
        console.error('UNABLE TO LOAD CONFIG!')
        console.error(err)
        exit(1)
    }
}
export const loadInitConfig = () => {
    try {
        Config.mongo.host = config.get('mongo.host')
        Config.mongo.user = config.get('mongo.user')
        Config.mongo.password = config.get('mongo.password')
        Config.sitename = config.get('sitename')
    } catch (err) {
        console.error('UNABLE TO LOAD MONGOHOST & SITENAME!')
        console.error(err)
        exit(1)
    }
}
export default Config