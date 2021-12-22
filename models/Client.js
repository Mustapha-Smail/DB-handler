import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
    lName: {
        type: String,
        required: true,
    },
    fName: {
        type: String,
        required: true,
    },
    bDay: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    numTel: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Client', ClientSchema)