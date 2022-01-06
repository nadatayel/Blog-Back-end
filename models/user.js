const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength:20,
        unique: true,
    },

    password:
    {
        type: String,
        required: true,
        minlength:4,
    },

    firstName: {
        type: String,
        maxlength: 20,
        minlength:3,
        required: true,
    },
    lastName: {
        type: String,
        maxlength: 20,
        minlength:3,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,

    },
    userImage:
    {
        type:String,
        
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dob: Date
},
    {
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.password;
                return ret;
            },
        },


    });

userSchema.pre('save', function (next) {
    hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;
    next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('findOneAndUpdate', function preSave(next) {
    if (!this._update.password) {
        next();
    }
    this._update.password = bcrypt.hashSync(this._update.password, 8);
    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
