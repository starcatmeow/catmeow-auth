import mongoose from 'mongoose'

const UserCenterAdminSchema = new mongoose.Schema({
    accountId: {
        type: String,
        unique: true,
        required: true
    }
});
export const UserCenterAdmin = mongoose.model('UserCenterAdmin', UserCenterAdminSchema);