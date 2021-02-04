import config from 'config'
import { exit } from 'process';
let Config = {
    listen_addr: '',
    listen_port: '',
    under_proxy: false,
    mongo: {
        host: '',
        user: '',
        password: ''
    },
    usercenter: {
        frontend: '',
        backend: ''
    }
};
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
export default Config;