import config from 'config'
import { exit } from 'process';
let Config = {
    LISTEN_ADDR: '',
    LISTEN_PORT: '',
    UNDER_PROXY: false,
    MONGO_URI: '',
    USERCENTER_FRONTEND_URL: '',
    USERCENTER_BACKEND_URL: ''
};
export const loadConfig = () => {
    try {
        Config.LISTEN_ADDR = config.get('LISTEN_ADDR')
        Config.LISTEN_PORT = config.get('LISTEN_PORT')
        Config.UNDER_PROXY = Boolean(config.get('UNDER_PROXY'))
        Config.MONGO_URI = config.get('MONGO_URI')
        Config.USERCENTER_FRONTEND_URL = config.get('USERCENTER_FRONTEND_URL')
        Config.USERCENTER_BACKEND_URL = config.get('USERCENTER_BACKEND_URL')
    } catch {
        console.error('UNABLE TO LOAD CONFIG!')
        exit(1)
    }
}
export default Config;