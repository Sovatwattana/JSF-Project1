const mongoose = require('mongoose');

var date = new Date(); 

var d = date.getDate();
var m = date.getMonth()+1;
//Horse Schema
const HorseSchema = new mongoose.Schema({
    riderId: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Gelding','Mare'],
        required: true
    },
    height: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    sire: {
        type: String
    },
    earnings: {
        type: Number,
        default: 0
    },
    starts: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

function getRiderless() {
    return this.where({
        riderId: null
    });
}

function getHorseOfRider(riderId) {
    return this.where({
        riderId: riderId
    });
}

HorseSchema.query.getRiderless = getRiderless;
HorseSchema.query.getHorseOfRider = getHorseOfRider;

module.exports = mongoose.model('Horse', HorseSchema);