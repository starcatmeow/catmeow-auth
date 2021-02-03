import config from 'config'
import { exit } from 'process';
let Config = {
    LISTEN_ADDR: '',
    LISTEN_PORT: '',
    UNDER_PROXY: false,
    MONGO_HOST: '',
    MONGO_USER: '',
    MONGO_PASSWORD: '',
    USERCENTER_FRONTEND_URL: '',
    USERCENTER_BACKEND_URL: '',
    MONGO_URI: ''
};
export const loadConfig = () => {
    try {
        Config.LISTEN_ADDR = config.get('LISTEN_ADDR')
        Config.LISTEN_PORT = config.get('LISTEN_PORT')
        Config.UNDER_PROXY = Boolean(config.get('UNDER_PROXY'))
        Config.MONGO_HOST = config.get('MONGO_HOST')
        Config.USERCENTER_FRONTEND_URL = config.get('USERCENTER_FRONTEND_URL')
        Config.USERCENTER_BACKEND_URL = config.get('USERCENTER_BACKEND_URL')
        Config.MONGO_USER = process.env.MONGO_USER!
        Config.MONGO_PASSWORD = process.env.MONGO_PASSWORD!
        Config.MONGO_URI = 'mongodb://'+Config.MONGO_USER+':'+Config.MONGO_PASSWORD+'@'+Config.MONGO_HOST
    } catch {
        console.error('UNABLE TO LOAD CONFIG!')
        exit(1)
    }
}
export default Config;