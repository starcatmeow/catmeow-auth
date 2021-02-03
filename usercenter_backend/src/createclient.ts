import Config, { loadInitConfig } from './config'
import mongoose from 'mongoose'
import { CreateClient } from './admin/handler';
import { exit } from 'process';
loadInitConfig()
const backendURL = process.argv[2]
if(!backendURL || !backendURL.startsWith('http')){
    console.error("USAGE: yarn createclient <your backend deployment url (end without '/')>")
    exit(1)
}
const create = async () => {
    console.log('Connecting to DB...')
    await mongoose.connect(Config.mongouri+'/auth', {
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log('Creating Client...')
    const client = await CreateClient(Config.sitename, backendURL+'/auth/callback')
    console.log('Done.\n\n')
    console.log("Client ID: \t",client.payload.client_id)
    console.log("Client Secret: \t",client.payload.client_secret)
    exit(0)
}
create()