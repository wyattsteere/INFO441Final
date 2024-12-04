import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect('mongodb+srv://info441mongo:info441mongo@cluster0.5rbe0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

console.log("successfully connected to mongodb!")

const reportSchema = new mongoose.Schema({
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

models.Reports = mongoose.model('Reports', reportSchema)
models.Watchs = mongoose.model('Watchs', watchSchema)

console.log("mongoose models created")

export default models