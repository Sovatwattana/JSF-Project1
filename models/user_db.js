const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

UserSchema.virtual('passwordConfirmation')
.get(() => this.passwordConfirmation)
.set((value) => this.passwordConfirmation = value);

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    if (user.password !== user.passwordConfirmation) {
        throw new Error('Password and password confirmation do not match.');
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
});

function authenticate(plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, (error, isMatch) => {
        if (error) {
            return callback(error);
        }
        callback(null, isMatch);
    });
}

UserSchema.methods.authenticate = authenticate;

module.exports = mongoose.model('User', UserSchema);