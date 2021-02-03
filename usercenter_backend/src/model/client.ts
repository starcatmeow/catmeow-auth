import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
    _id: String,
    payload: Object
});
export const Client = mongoose.model('Client', ClientSchema, 'client');