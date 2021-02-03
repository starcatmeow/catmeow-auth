import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    emailVerified: Boolean
});
export const User = mongoose.model('User', UserSchema);

export class Account {
    accountId: string;
    constructor(accountId: string) {
        this.accountId = accountId;
    }
    async claims(_use: any, _scope: any){
        let info = await User.findById(this.accountId).exec();
        if(info == null){
            throw new Error("Can't found user "+this.accountId)
        }
        return {
            sub: this.accountId,
            name: info.get("name"),
            email: info.get("email"),
            email_verified: info.get("emailVerified")
        }
    }
}