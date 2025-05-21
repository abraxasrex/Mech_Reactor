import mongoose, {Schema, Document} from 'mongoose';
import bcrypt from 'bcryptjs';


// import mongoose, { Schema, Document, Model } from "mongoose";

//1. create user interface
// interface IUser {
//     username: string;
//     hashedPassword: string;
// }

interface IUser {
    username: string;
    email: string;
    password: string;  
}

// 2. create document interface extending it from mongoose document
// interface IUserDocument extends IUser, Document {
//     setPassword: (password: string) => Promise<void>;
//     checkPassword: (password: string) => Promise<boolean>;
// }

interface IUserDocument extends IUser, Document {
    comparePassword: (password: string) => Promise<boolean>;
}

//3. create model interface from document with 
// interface IUserModel extends Model<IUserDocument> {
//     findByUsername: (username: string) => Promise<IUserDocument>;
// }

// const UserSchema: Schema<IUserDocument> = new Schema({
//     username: { type: String, required: true },
//     hashedPassword: { type: String, required: true },
// });

// UserSchema.methods.setPassword = async function (password: string) {
//     const hash = await bcrypt.hash(password, 10);
//     this.hashedPassword = hash;
// };

// UserSchema.methods.checkPassword = async function (password: string) {
//     const result = await bcrypt.compare(password, this.hashedPassword);
//     return result;
// };

// UserSchema.statics.findByUsername = function (username: string) {
//     return this.findOne({ username });
// };

// const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
// export default User;


const UserSchema: Schema<IUserDocument> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
