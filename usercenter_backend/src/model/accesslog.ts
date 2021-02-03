import mongoose from 'mongoose'

const AccessLogSchema = new mongoose.Schema({
    authTime: {
        type: Number,
        required: true,
        index: true,
    },
    scope: { type: String },
    clientId: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: true,
        index: true
    }
});
export const AccessLog = mongoose.model('AccessLog', AccessLogSchema);