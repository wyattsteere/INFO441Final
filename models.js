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

const userSchema = new mongoose.Schema({
    username: String,
    biography: String,
    accountCreation: Date,
    crimesReported: Number
})

models.Users = mongoose.model('Users', userSchema)
models.Reports = mongoose.model('Reports', reportSchema)

console.log("mongoose models created")

export default models