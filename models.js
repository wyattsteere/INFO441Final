import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect('mongodb+srv://info441mongo:info441mongo@cluster0.5rbe0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

console.log("successfully connected to mongodb!")

const reportSchema = new mongoose.Schema({
    username: String,
    title: String,
    location: String,
    description: String,
})

const watchSchema = new mongoose.Schema({
    username: String,
    description: String,
    location: String,
    watch_date: Date,
    time_start: String,
    time_end: String
})

const userSchema = new mongoose.Schema({
    username: String,
    biography: String,
    accountCreation: Date,
    crimesReported: Number
})

const markerSchema = new mongoose.Schema({
    title: String,
    description: String,
    latitude: Number,
    longitude: Number
})

models.Watchs = mongoose.model('Watchs', watchSchema)
models.Users = mongoose.model('Users', userSchema)
models.Reports = mongoose.model('Reports', reportSchema)
models.Markers = mongoose.model('Markers', markerSchema)

console.log("mongoose models created")

export default models